// infrastructure/repositories/icall26_crm_mysql_user_repository.ts
import type { Logger } from "../../../domain/interfaces/logger";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { UserRoleStrategy, RoomMappingPayload } from "../../../domain/interfaces/user_role_strategy";
import type { TestableUserRepository } from "../../../domain/interfaces/testable_user_repository";
import { TeamMemberDto } from "../../../domain/dtos/team_member_dto";
const { Superadmin2UserStrategy } = require("../../strategies/superadmin2/superadmin2_user_strategy.ts");
const { Superadmin2ManagerStrategy } = require("../../strategies/superadmin2/superadmin2_manager_strategy.ts");
const { UserTeamDto } = require("../../../domain/dtos/user_team_dto.ts");

export class Superadmin2MySqlUserRepository implements TestableUserRepository {
    private db: Pool;
    logger: Logger;
    private strategies: UserRoleStrategy[];

    private readonly usersTable = "t_user";
    private readonly teamsTable = "t_user_team";
    private readonly userTeamUserTable = "t_user_team_user";

    constructor(db: Pool, logger: Logger) {
        const actualDb = (db as any)?.default || db;

        if (!actualDb || typeof actualDb.execute !== 'function') {
            console.error("[Superadmin2MySqlUserRepository] Received invalid DB instance:", db);
            throw new Error("[Superadmin2MySqlUserRepository] Invalid MySQL pool passed to constructor. 'execute' method is missing.");
        }

        this.db = actualDb;
        this.logger = logger;

        this.strategies = [
            new Superadmin2UserStrategy(this.db, this.logger),
            new Superadmin2ManagerStrategy(this.db, this.logger)
        ];
    }

    async findById(id: string): Promise<any> {
        const [rows] = await this.db.execute<RowDataPacket[]>(
            `SELECT * FROM ${this.usersTable} WHERE id = ? AND status = 'ACTIVE' LIMIT 1`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async getRelatedUserIds(userId: string): Promise<RoomMappingPayload[]> {
        this.logger.info(`[Superadmin2MySqlUserRepository] Fetching related user IDs for userId: ${userId}`);
        const user = await this.findById(userId);

        if (!user) {
            this.logger.error(`[Superadmin2MySqlUserRepository] User with ID ${userId} not found or inactive`);
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

        this.logger.info(`[Superadmin2MySqlUserRepository] Matched strategy: ${matchedStrategy.getStrategyName()}`);
        return await matchedStrategy.getRelatedIds(String(user.id));
    }

    async findTestPair(): Promise<{ subjectId: string, observerId: string }> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                u.id as subjectId,
                t.manager_id as observerId
            FROM ${this.usersTable} u
            INNER JOIN t_user_team_user tu ON u.id = tu.user_id
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
            this.logger.debug(`[Superadmin2MySqlUserRepository] No active team exists with ID ${teamId}`);
            return null;
        }

        return new UserTeamDto({
            id: rows[0].id,
            name: rows[0].name,
        });
    }

    async getTeamMembers(userId:number,teamId:number,query?:string): Promise<TeamMemberDto[]>{
        try{
        let sql = `
            SELECT 
                u.id, 
                u.username AS name, 
                u.avatar_path,
                CASE
                    WHEN u.id = t.manager_id THEN 'Manager'
                    ELSE 'User'
                END AS role    
            FROM ${this.userTeamUserTable} utu
            INNER JOIN ${this.usersTable} u
            ON utu.user_id = u.id
            INNER JOIN ${this.teamsTable} t
            ON t.id = utu.team_id
            WHERE utu.team_id = ? 
                AND utu.is_active = 'Y' 
                AND u.id != ? 
                AND u.status = 'ACTIVE'
        `;
        const params: any[] = [teamId, userId];
        if (query && query.trim() !== '') {
            sql += ` AND LOWER(u.username) LIKE LOWER(?)`;
            params.push(`${query.trim()}%`); 
        }
        const [rows] = await this.db.execute<RowDataPacket[]>(sql, params);

        if (!rows.length) {
            this.logger.debug(`[Superadmin2MySqlUserRepository] No active team members with ID ${teamId}`);
            return [];
        }

        return rows.map((user: RowDataPacket) => new TeamMemberDto({
            id: user.id,
            name: user.name,
            avatarUrl: process.env.FRONTEND_URL + user.avatar_path,
            role: user.role
        }));
        }catch(error:any){
            this.logger.error("[Superadmin2MySqlUserRepository] getTeamMembers error ",error);
            throw error;
        }
    }

    async getUserFriends(userId:number): Promise<TeamMemberDto[]>{
        try{
            const [rows] = await this.db.execute<RowDataPacket[]>(`
                SELECT 
                    u.id,
                    u.username AS name,
                    u.avatar_path,
                    uu.permission_status
                FROM t_user u
                INNER JOIN t_user_user uu 
                ON (uu.requester_id = ? AND uu.target_id = u.id)
                OR (uu.requester_id = u.id AND uu.target_id = ?)
                WHERE u.status = 'ACTIVE'
                AND u.is_active = 'Y'
                AND uu.permission_status = 'ALLOWED';
            `, [userId,userId]);
             
            this.logger.debug("[Superadmin2MySqlUserRepository] getUserFriends rows ",rows.length);

            if (!rows.length) {
                this.logger.debug(`[Superadmin2MySqlUserRepository] No active friends with ID ${userId}`);
                return [];
            }
            return rows.map((user: RowDataPacket) => new TeamMemberDto({
                id: user.id,
                name: user.name,
                avatarUrl: process.env.FRONTEND_URL + user.avatar_path,
            }));
        }catch(error:any){
            this.logger.error("[Superadmin2MySqlUserRepository] getUserFriends error ",error);
            throw error;
        }
    }

    
}