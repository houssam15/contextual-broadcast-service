import type { RoomMappingPayload } from "../../../domain/interfaces/user_role_strategy";
import type { UserRoleStrategy } from "../../../domain/interfaces/user_role_strategy";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";
import type { CrmTableConfig } from "../../../domain/tables_config/crm_table_config";

export class CrmManagerStrategy implements UserRoleStrategy {
    private db: Pool;
    private logger: Logger;
    private tables: CrmTableConfig;

    constructor(
        db: Pool, 
        logger: Logger,
        tables: CrmTableConfig
    ){
        this.db = db;
        this.logger = logger;
        this.tables = tables;
    }

    getStrategyName():string{
        return this.constructor.name;
    }

    supports(role: string): boolean {
        return role === "crm_manager";
    }

    async supportsV2(data: any): Promise<boolean> {
        const [rows] = await this.db.execute<RowDataPacket[]>(
          `SELECT id FROM ${this.tables.teamsTable} WHERE manager_id = ?`,
          [data.id]
        );
        const isManager = rows.length > 0;
        this.logger.info(`[CrmManagerStrategy] Checking user ${data.id}, rows.length ${rows.length}. Is manager? ${isManager}`);
        return isManager;
    }

    async getRelatedIds(userId: string): Promise<RoomMappingPayload[]> {
      const mappingsMap: Map<string, RoomMappingPayload> = new Map();

      this.logger.info(`[CrmManagerStrategy] getRelatedIds userId ${userId}`);

      const [userteams] = await this.db.execute<RowDataPacket[]>(
          `SELECT id FROM ${this.tables.teamsTable} WHERE manager_id = ?`,
          [userId]
      );

      this.logger.info(`[CrmManagerStrategy] getRelatedIds userId ${userId} userTeams.length ${userteams.length}`);

      for(let i = 0;i < userteams.length;i++){
        let userTeam = userteams[i];
        const currentTeamSqlId = parseInt(userTeam.id, 10);
        const tokenKey = `team_${currentTeamSqlId}`;

        mappingsMap.set(tokenKey, {
            token: tokenKey,
            sqlRoomId: currentTeamSqlId,
            //mode: 'group'
        });
        /*
        const [userTeamMembers] = await this.db.execute<RowDataPacket[]>(
          `SELECT user_id FROM ${this.tables.teamUsersTable} WHERE user_id != ? AND team_id = ?`,
          [userId,userTeam.id]
        );
        for(let j = 0 ; j<userTeamMembers.length; j++){
            let userTeamMember = userTeamMembers[j];
            const tokenKey = `team_${userTeam.id}_member_${userTeamMember.user_id}`;
            mappingsMap.set(tokenKey,{
                token: tokenKey,
                sqlRoomId: parseInt(userTeam.id,10)
            });
        }*/
      }

      const result = Array.from(mappingsMap.values());
      this.logger.info(`[CrmManagerStrategy] Found ${result.length} relations for user ${userId}:`, result);
      
      return result;
    }
}