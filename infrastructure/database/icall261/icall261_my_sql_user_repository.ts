// infrastructure/repositories/icall26_crm_mysql_user_repository.ts
import type { Logger } from "../../../domain/interfaces/logger";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { UserRoleStrategy, RoomMappingPayload } from "../../../domain/interfaces/user_role_strategy";
import type { TestableUserRepository } from "../../../domain/interfaces/testable_user_repository";
import { TeamMemberDto } from "../../../domain/dtos/team_member_dto";
const { Icall261UserStrategy } = require("../../strategies/icall261/icall261_user_strategy.ts");
const { Icall261ManagerStrategy } = require("../../strategies/icall261/icall261_manager_strategy.ts");
const { UserTeamDto } = require("../../../domain/dtos/user_team_dto.ts");
const { config } = require("../../../config/index");

export class Icall261MySqlUserRepository implements TestableUserRepository {
    private db: Pool;
    logger: Logger;
    private strategies: UserRoleStrategy[];

    private usersTable : string;
    private teamsTable : string;
    private teamUsersTable : string;
    
    constructor(db: Pool, logger: Logger) {
        const actualDb = (db as any)?.default || db;

        if (!actualDb || typeof actualDb.execute !== 'function') {
            console.error("[Icall261MySqlUserRepository] Received invalid DB instance:", db);
            throw new Error("[Icall261MySqlUserRepository] Invalid MySQL pool passed to constructor. 'execute' method is missing.");
        }

        this.db = actualDb;
        this.logger = logger;

        this.strategies = [
            new Icall261UserStrategy(this.db, this.logger),
            new Icall261ManagerStrategy(this.db, this.logger)
        ];

        this.teamsTable = config.db.mySql.tables.teamsTable;
        this.usersTable = config.db.mySql.tables.usersTable;
        this.teamUsersTable = config.db.mySql.tables.teamUsersTable;
    }

    async findById(id: string): Promise<any> {
        const [rows] = await this.db.execute<RowDataPacket[]>(
            `SELECT * FROM ${this.usersTable} WHERE id = ? AND status = 'ACTIVE' LIMIT 1`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async getRelatedUserIds(userId: string): Promise<RoomMappingPayload[]> {
        this.logger.info(`[Icall261MySqlUserRepository] Fetching related user IDs for userId: ${userId}`);
        const user = await this.findById(userId);

        if (!user) {
            this.logger.error(`[Icall261MySqlUserRepository] User with ID ${userId} not found or inactive`);
            return [];
        }

        let matchedStrategy: UserRoleStrategy | undefined = undefined;

        for (const strategy of this.strategies) {
            try {
                const supports = await strategy.supportsV2(user);
                if (supports) {
                    matchedStrategy = strategy;
                    break;
                }
            } catch (err) {
                this.logger.error(`Error checking strategy ${strategy.getStrategyName()}:`, err);
            }
        }

        if (!matchedStrategy) {
            this.logger.warn(`No strategy matched for userId ${userId}, falling back to user strategy`);
            matchedStrategy = this.strategies[0];
        }

        this.logger.info(`[Icall261MySqlUserRepository] Matched strategy: ${matchedStrategy.getStrategyName()}`);
        return await matchedStrategy.getRelatedIds(String(user.id));
    }

    async findTestPair(): Promise<{ subjectId: string, observerId: string }> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                u.id as subjectId,
                t.manager_id as observerId
            FROM ${this.usersTable} u
            INNER JOIN ${this.teamUsersTable} tu ON u.id = tu.user_id
            INNER JOIN ${this.teamsTable} t ON tu.team_id = t.id
            WHERE u.status = 'ACTIVE' 
              AND t.status = 'ACTIVE' 
              AND t.manager_id IS NOT NULL 
              AND u.id != t.manager_id
            LIMIT 1
        `);

        if (!rows.length) {
            throw new Error("No team member / team manager pair found in t_user database for testing.");
        }

        return {
            subjectId: String(rows[0].subjectId),
            observerId: String(rows[0].observerId)
        };
    }

    async getTeamById(teamId: number): Promise<UserTeamDto | null> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT id, name
            FROM ${this.teamsTable}
            WHERE id = ? AND status = 'ACTIVE'
            LIMIT 1;
        `, [teamId]);

        if (!rows.length) {
            this.logger.debug(`[Icall261MySqlUserRepository] No active team exists with ID ${teamId}`);
            return null;
        }

        return new UserTeamDto({
            id: rows[0].id,
            name: rows[0].name,
        });
    }

    async getTeamMembers(userId:number,teamId:number): Promise<TeamMemberDto[]>{
        try{
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                u.id, 
                u.username AS name, 
                u.avatar,
                CASE
                    WHEN u.id = t.manager_id THEN 'Manager'
                    ELSE 'User'
                END AS role    
            FROM ${this.teamUsersTable} utu
            INNER JOIN ${this.usersTable} u
            ON utu.user_id = u.id
            INNER JOIN ${this.teamsTable} t
            ON t.id = utu.team_id
            WHERE utu.team_id = ? 
                AND utu.is_active = 'Y' 
                AND u.id != ? 
                AND u.status = 'ACTIVE';
        `, [teamId,userId]);

        if (!rows.length) {
            this.logger.debug(`[Icall261MySqlUserRepository] No active team members with ID ${teamId}`);
            return [];
        }

        return rows.map((user: RowDataPacket) => new TeamMemberDto({
            id: user.id,
            name: user.name,
            avatarUrl: process.env.FRONTEND_URL + user.avatar,
            role: user.role
        }));
        }catch(error:any){
            this.logger.error("[Icall261MySqlUserRepository] getTeamMembers error ",error);
            throw error;
        }
    }

    async getUserFriends(userId:number): Promise<TeamMemberDto[]>{
        try{
            const data = await this.getRelatedUserIds(String(userId));
            var ids = data.filter(e => e.type == "direct_message").map(e => Number(e.sqlRoomId)).filter(e => !isNaN(e));
            if (ids.length === 0) {
                return [];
            }
            const placeholders = ids.map(() => '?').join(', ');
            const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                u.id,
                u.username AS name,
                u.avatar
            FROM ${this.usersTable} u
            WHERE u.status = 'ACTIVE'
            AND u.is_active = 'YES'
            AND u.id IN (${placeholders});
            `, ids);
            const result = rows.map((user: RowDataPacket) => new TeamMemberDto({
                id: user.id,
                name: user.name,
                avatarUrl: process.env.FRONTEND_URL + user.avatar,
            }));
            return result;
        }catch(error:any){
            this.logger.error("[Icall261MySqlUserRepository] getUserFriends error ",error);
            throw error;
        }
    }

    
}