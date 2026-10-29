// infrastructure/strategies/crm/superadmin2_crm_manager_strategy.ts
import type { RoomMappingPayload, UserRoleStrategy } from "../../../domain/interfaces/user_role_strategy";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";
const { config } = require("../../../config/index");

export class Icall262ManagerStrategy implements UserRoleStrategy {
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
        return role === "crm_manager" || role === "manager";
    }

    async supportsV2(data: any): Promise<boolean> {
        const userId = data.id;
        const [rows] = await this.db.execute<RowDataPacket[]>(
            `SELECT id FROM ${this.teamsTable} WHERE manager_id = ? AND status = 'ACTIVE'`,
            [userId]
        );
        const isManager = rows.length > 0;
        this.logger.info(`[Icall262ManagerStrategy] Checking user ${userId}, teams count ${rows.length}. Is manager? ${isManager}`);
        return isManager;
    }

    async getRelatedIds(userId: string): Promise<RoomMappingPayload[]> {
        const mappingsMap: Map<string, RoomMappingPayload> = new Map();

        this.logger.info(`[Icall262ManagerStrategy] getRelatedIds userId ${userId}`);

        //self join
        mappingsMap.set(`user_${userId}`, {
                token: `user_${userId}`,
                sqlRoomId: Number(userId),
                type: "direct_message"
        });

        const [userTeams] = await this.db.execute<RowDataPacket[]>(
            `SELECT id, name FROM ${this.teamsTable} WHERE manager_id = ? AND status = 'ACTIVE'`,
            [userId]
        );

        this.logger.info(`[Icall262ManagerStrategy] Found ${userTeams.length} managed teams for userId ${userId}`);

        const managedTeamIds: number[] = [];

        for (const team of userTeams) {
            const currentTeamSqlId = parseInt(team.id, 10);
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
            const [teamMembers] = await this.db.query<RowDataPacket[]>(
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

            this.logger.info(`[Icall262ManagerStrategy] Found ${teamMembers.length} team members for managed teams`);

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


        const [allowedUsers] = await this.db.execute<RowDataPacket[]>(
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
            [userId, userId, userId,userId]
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
        this.logger.info(`[Icall262ManagerStrategy] Found ${result.length} room mappings for user ${userId}:`, result);

        return result;
    }
}