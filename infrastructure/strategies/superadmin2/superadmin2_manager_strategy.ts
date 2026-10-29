// infrastructure/strategies/crm/superadmin2_crm_manager_strategy.ts
import type { RoomMappingPayload, UserRoleStrategy } from "../../../domain/interfaces/user_role_strategy";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";

export class Superadmin2ManagerStrategy implements UserRoleStrategy {
    private db: Pool;
    private logger: Logger;
    private readonly teamsTable = "t_user_team";
    private readonly userUserTable = "t_user_user";
    private readonly usersTable = "t_user";
    private readonly teamUsersTable = "t_user_team_user";

    constructor(db: Pool, logger: Logger) {
        this.db = db;
        this.logger = logger;
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
            `SELECT id FROM ${this.teamsTable} WHERE (manager_id = ? OR assistant_id = ? OR director_id = ?) AND status = 'ACTIVE'`,
            [userId, userId, userId]
        );
        const isManager = rows.length > 0;
        this.logger.info(`[Superadmin2ManagerStrategy] Checking user ${userId}, teams count ${rows.length}. Is manager? ${isManager}`);
        return isManager;
    }

    async getRelatedIds(userId: string): Promise<RoomMappingPayload[]> {
        const mappingsMap: Map<string, RoomMappingPayload> = new Map();

        this.logger.info(`[Superadmin2ManagerStrategy] getRelatedIds userId ${userId}`);

        const [userTeams] = await this.db.execute<RowDataPacket[]>(
            `SELECT id, name FROM ${this.teamsTable} WHERE (manager_id = ? OR assistant_id = ? OR director_id = ?) AND status = 'ACTIVE'`,
            [userId, userId, userId]
        );

        this.logger.info(`[Superadmin2ManagerStrategy] Found ${userTeams.length} managed teams for userId ${userId}`);

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
            const [teamMembers] = await this.db.query<RowDataPacket[]>(
                `SELECT DISTINCT tu.user_id 
                FROM ${this.teamUsersTable} tu
                INNER JOIN ${this.usersTable} u ON tu.user_id = u.id
                WHERE tu.team_id IN (?) 
                AND tu.user_id != ? 
                AND tu.is_active = 'Y' 
                AND u.status = 'ACTIVE' 
                AND u.is_active = 'Y'`,
                [managedTeamIds, userId]
            );

            this.logger.info(`[Superadmin2ManagerStrategy] Found ${teamMembers.length} team members for managed teams`);

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
        this.logger.info(`[Superadmin2ManagerStrategy] Found ${result.length} room mappings for user ${userId}:`, result);

        return result;
    }
}