// infrastructure/strategies/crm/icall26_crm_user_strategy.ts
import type { RoomMappingPayload, UserRoleStrategy } from "../../../domain/interfaces/user_role_strategy";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";
const { config } = require("../../../config/index");

export class Icall262UserStrategy implements UserRoleStrategy {
    private db: Pool;
    private logger: Logger;
    private teamsTable : string;
    private userUserTable : string;
    private usersTable : string;
    private teamUsersTable : string;

    constructor(db: Pool, logger: Logger) {
        this.db = db;
        this.logger = logger;
        this.teamsTable = config.db.mySql.tables.teamsTable;
        this.userUserTable = config.db.mySql.tables.userUserTable;
        this.usersTable = config.db.mySql.tables.usersTable;
        this.teamUsersTable = config.db.mySql.tables.teamUsersTable;
    }
    
    getStrategyName(): string {
        return this.constructor.name;
    }

    supports(role: string): boolean {
        return role === "parent" || role === "user" || role === "standard";
    }

    async supportsV2(data: any): Promise<boolean> {
        const userId = data.id;
        const [rows] = await this.db.execute<RowDataPacket[]>(
            `SELECT id FROM ${this.teamsTable} WHERE manager_id = ? AND status = 'ACTIVE'`,
            [userId]
        );
        const isStandardUser = rows.length === 0;
        this.logger.info(`[Icall262UserStrategy] Checking user ${userId}. Managed teams count: ${rows.length}. Is standard user? ${isStandardUser}`);
        return isStandardUser;
    }
    
    async getRelatedIds(userId: string): Promise<RoomMappingPayload[]> {
        const mappingsMap: Map<string, RoomMappingPayload> = new Map();

        this.logger.info(`[Icall262UserStrategy] getRelatedIds userId ${userId}`);

        //self join
        mappingsMap.set(`user_${userId}`, {
                token: `user_${userId}`,
                sqlRoomId: Number(userId),
                type: "direct_message"
        });

        /**
         * Raw sql query : SELECT tu.team_id,tu.user_id FROM t_user_team_user tu INNER JOIN t_user_team t ON tu.team_id = t.id WHERE tu.user_id = 1 AND tu.is_active = "Y" AND t.status = 'ACTIVE';
         */

        const [userTeams] = await this.db.execute<RowDataPacket[]>(
            `SELECT tu.team_id 
             FROM ${this.teamUsersTable} tu
             INNER JOIN ${this.teamsTable} t ON tu.team_id = t.id
             WHERE tu.user_id = ? AND tu.is_active = 'Y' AND t.status = 'ACTIVE'`,
            [userId]
        );

        this.logger.info(`[Icall262UserStrategy] Found ${userTeams.length} joined teams for userId ${userId}`);

        const managedTeamIds: number[] = [];

        for (const userTeam of userTeams) {
            const currentTeamSqlId = parseInt(userTeam.team_id, 10);
            managedTeamIds.push(currentTeamSqlId);
            const tokenKey = `team_${currentTeamSqlId}`;

            mappingsMap.set(tokenKey, {
                token: tokenKey,
                sqlRoomId: currentTeamSqlId,
                type: "team"
            });
        }

        //add team members too as direct_message allowed users
        //...
        if (managedTeamIds.length > 0){
            const placeholders = managedTeamIds.map(() => '?').join(', ');
            const [teamMembers] = await this.db.execute<RowDataPacket[]>(
                `SELECT DISTINCT tu.user_id 
                FROM ${this.teamUsersTable} tu
                INNER JOIN ${this.usersTable} u ON tu.user_id = u.id
                WHERE tu.team_id IN (${placeholders}) 
                AND tu.user_id != ? 
                AND tu.is_active = 'Y' 
                AND u.status = 'ACTIVE' 
                AND u.is_active = 'Y'`,
                [...managedTeamIds, userId]
            );

            this.logger.info(`[Icall262UserStrategy] Found ${teamMembers.length} team members for managed teams`);

            for (const member of teamMembers) {
                const memberUserId = parseInt(member.user_id, 10);
                const tokenKey = `user_${memberUserId}`;

                mappingsMap.set(tokenKey, {
                    token: tokenKey,
                    sqlRoomId: memberUserId,
                    type: "direct_message"
                });
            }
        }

        const [allowedUsers] = await this.db.query<RowDataPacket[]>(
            `
            SELECT 
            CASE 
                WHEN uu.requester_id = ? THEN uu.target_id 
                ELSE uu.requester_id 
            END AS contact_id
            FROM ${this.userUserTable} uu
            INNER JOIN ${this.usersTable} u 
                ON u.id = (CASE WHEN uu.requester_id = ? THEN uu.target_id ELSE uu.requester_id END)
            WHERE (uu.requester_id = ? OR uu.target_id = ?)
            AND uu.permission_status = 'ALLOWED'
            AND u.status = 'ACTIVE'
            AND u.is_active = 'Y'
            `, 
            [userId, userId, userId, userId]
        );

        for (const user of allowedUsers) {
            const targetUserId = parseInt(user.contact_id, 10);
            const tokenKey = `user_${targetUserId}`;

            mappingsMap.set(tokenKey, {
                token: tokenKey,
                sqlRoomId: targetUserId,
                type: "direct_message"
            });
        }

        const result = Array.from(mappingsMap.values());
        this.logger.info(`[Icall262UserStrategy] Found ${result.length} room mappings for user ${userId}:`, result);

        return result;
    }
}