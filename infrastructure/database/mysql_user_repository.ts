import { Logger } from "../../domain/interfaces/logger.ts";
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { UserRoleStrategy } from "../../domain/interfaces/user_role_strategy.ts";
import { TestableUserRepository } from "../../domain/interfaces/testable_user_repository.ts";

export class MySqlUserRepository implements TestableUserRepository {
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
    
    async findTestPair(): Promise<{subjectId: string, observerId: string}> {
        const [rows] = await this.db.execute<RowDataPacket[]>(`
            SELECT 
                s.id as subjectId, 
                t.id as observerId 
            FROM users s
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



}

