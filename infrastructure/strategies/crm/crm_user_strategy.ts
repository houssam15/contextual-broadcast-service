import type { UserRoleStrategy,RoomMappingPayload } from "../../../domain/interfaces/user_role_strategy.ts";
import type {Pool,RowDataPacket} from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";
import type {CrmTableConfig} from "../../../domain/tables_config/crm_table_config.ts";

export class CrmUserStrategy implements UserRoleStrategy {
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

    supports(role: string): boolean {
        return role === "parent";
    }

    getStrategyName():string{
        return this.constructor.name;
    }

    async supportsV2(data: any): Promise<boolean> {
        const [rows] = await this.db.execute<RowDataPacket[]>(
          `SELECT id FROM ${this.tables.teamsTable} WHERE manager_id = ?`,
          [data.id]
        );
        const isStandardUser = rows.length == 0;
        this.logger.info(`[CrmUserStrategy] Checking user ${data.id}. rows.length ${rows.length},Is standard user? ${isStandardUser}`);
        return isStandardUser;
    }
    
    async getRelatedIds(userId: string): Promise<RoomMappingPayload[]> {
      const mappingsMap: Map<string, RoomMappingPayload> = new Map();
      
      this.logger.info(`[CrmUserStrategy] getRelatedIds userId ${userId}`);

      const [userteams] = await this.db.execute<RowDataPacket[]>(
          `SELECT team_id FROM ${this.tables.teamUsersTable} WHERE user_id = ?`,
          [userId]
      );

      this.logger.info(`[CrmUserStrategy] getRelatedIds userteams.length ${userteams.length}`);

      for(let i = 0;i < userteams.length;i++){
        let userTeam = userteams[i];

        this.logger.info(`[CrmUserStrategy] getRelatedIds JSON.stringify(userTeam) ${JSON.stringify(userTeam)}`);

        const currentTeamSqlId = parseInt(userTeam.team_id, 10);
        const tokenKey = `team_${currentTeamSqlId}`;
        mappingsMap.set(tokenKey, {
            token: tokenKey,
            sqlRoomId: currentTeamSqlId,
            //mode: 'group'
        });
        /*const [userTeamMembers] = await this.db.execute<RowDataPacket[]>(
          `SELECT user_id FROM ${this.tables.teamUsersTable} WHERE user_id != ? AND team_id = ?`,
          [userId,String(userTeam.team_id)]
        );

        this.logger.info(`[CrmUserStrategy] getRelatedIds userTeamMembers.length ${userTeamMembers.length}`);

        for(let j = 0 ; j<userTeamMembers.length; j++){
            let userTeamMember = userTeamMembers[j];
            this.logger.info(`[CrmUserStrategy] getRelatedIds JSON.stringify(userTeamMembers[${j}]) ${JSON.stringify(userTeamMember)}`);
            const tokenKey =`team_${userTeam.team_id}_member_${userTeamMember.user_id}`;
            mappingsMap.set(tokenKey,{
                token: tokenKey,
                sqlRoomId: parseInt(userTeam.id,10)
            });
        }*/

      }

      const result = Array.from(mappingsMap.values());
      this.logger.info(`[CrmUserStrategy] Found ${result.length} relations for user ${userId}:`, result);
      
      return result;
    }
}