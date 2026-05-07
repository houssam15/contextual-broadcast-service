import { Logger } from "../../domain/interfaces/logger.ts";
import { UserRepository } from "../../domain/interfaces/user_repository.ts";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { UserRoleStrategy } from "../../domain/interfaces/user_role_strategy.ts";

export class MySqlUserRepository implements UserRepository {
    private db: Pool;
    logger: Logger;
    private strategies: UserRoleStrategy[];

    constructor(db: Pool, logger: Logger, strategies: UserRoleStrategy[]){
      this.db = db;
      this.logger = logger;
      this.strategies = strategies;
    }

    async findById(id: string): Promise<any> {
        const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getRelatedUserIds(userId: string): Promise<string[]> {
        const user = await this.findById(userId);
        if (!user) {
          this.logger.error(`User with ID ${userId} not found`);
          return [];
        }
        const strategy = this.strategies.find(s => s.supports(user.role));
        if (!strategy) {
            this.logger.error(`No strategy found for role ${user.role}`);
            return [];
        }
        return await strategy.getRelatedIds(user.id);
    }

}

