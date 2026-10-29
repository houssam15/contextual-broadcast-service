import type { Logger } from "../../../domain/interfaces/logger";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { UserRoleStrategy } from "../../../domain/interfaces/user_role_strategy";
import type { TestableUserRepository } from "../../../domain/interfaces/testable_user_repository";
import type { CrmTableConfig } from '../../../domain/tables_config/crm_table_config.ts';
const { defaultCrmTableConfig } = require("../../../domain/tables_config/crm_table_config.ts");
const { CrmUserStrategy } = require("../../strategies/crm/crm_user_strategy.ts");
const { CrmManagerStrategy } = require("../../strategies/crm/crm_manager_strategy.ts");
import type { RoomMappingPayload } from "../../../domain/interfaces/user_role_strategy.ts";
const {UserTeamDto} = require("../../../domain/dtos/user_team_dto.ts");
export class CrmMySqlUserRepository implements TestableUserRepository {
    private db: Pool;
    logger: Logger;
    private strategies: UserRoleStrategy[];
    private tables: CrmTableConfig;

    constructor(
        db: Pool,
        logger: Logger, 
        tables: CrmTableConfig = defaultCrmTableConfig
    ){
      const actualDb = (db as any)?.default || db;

      if (!actualDb || typeof actualDb.execute !== 'function') {
        console.error("[CrmMySqlUserRepository] Received invalid DB instance:", db);
        throw new Error("[CrmMySqlUserRepository] Invalid MySQL pool passed to constructor. 'execute' method is missing.");
      }
      this.db = actualDb;
      this.logger = logger;
      this.tables = tables;
      this.strategies = [
            new CrmUserStrategy(this.db, this.logger, this.tables),
            new CrmManagerStrategy(this.db, this.logger, this.tables)
      ];
    }
    
    async findById(id: string): Promise<any> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`SELECT * FROM ${this.tables.usersTable} WHERE id = ?`, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getRelatedUserIds(userId: string): Promise<RoomMappingPayload[]> {
        this.logger.info(`[CrmMySqlUserRepository] Fetching related user IDs for userId: ${userId}`);
        const user = await this.findById(userId);
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`);
            return [];
        }

        this.logger.info(`[CrmMySqlUserRepository] getRelatedUserIds JSON.stringify(user) ${JSON.stringify(user)}`);
        this.logger.info(`[CrmMySqlUserRepository] getRelatedUserIds this.strategies.map(s => s.getStrategyName())} ${this.strategies.map(s => s.getStrategyName())}`);
        
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

        this.logger.info(`[CrmMySqlUserRepository] strategy.getStrategyName() ${matchedStrategy.getStrategyName()}`);

        return await matchedStrategy.getRelatedIds(String(user.id));
    }
    
    async findTestPair(): Promise<{subjectId: string, observerId: string}> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                s.id as subjectId, 
                t.id as observerId 
            FROM users2 s
            INNER JOIN users t ON s.teacher_id = t.id
            WHERE s.role = 'student' 
            AND t.role = 'teacher'
            LIMIT 1
        `);

        if (!rows.length) {
            throw new Error("No student-teacher pair found in database for testing.");
        }

        return {
            subjectId: String(rows[0].subjectId),
            observerId: String(rows[0].observerId)
        };
    }

    async getTeamById(teamId:number): Promise<UserTeamDto | null> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT *
            FROM t_users2_team
            WHERE id = ?
            LIMIT 1;
        `,[teamId]);

        if (!rows.length) {
            this.logger.debug("No Teams exist for this user");
            return null;
        }

        return new UserTeamDto({
            id: rows[0].id,
            name: rows[0].name
        });
    }

}

