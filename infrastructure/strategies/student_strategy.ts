import { UserRoleStrategy } from "../../domain/interfaces/user_role_strategy.ts";
import {Pool,RowDataPacket} from 'mysql2/promise';
import { Logger } from "../../domain/interfaces/logger";

export class StudentStrategy implements UserRoleStrategy {
    private db: Pool;
    private logger: Logger;

    constructor(db: Pool, logger: Logger){
        this.db = db;
        this.logger = logger;
    }

    supports(role: string): boolean {
        return role === "student";
    }

    async getRelatedIds(userId: string): Promise<string[]> {
      const relatedIds: Set<string> = new Set();
      
      const [rows] = await this.db.execute<RowDataPacket[]>(
        'SELECT teacher_id, parent_id FROM users WHERE id = ?',
        [userId]
      );

      const data = rows[0];

      if (data) {
        if (data.teacher_id) relatedIds.add(String(data.teacher_id));
        if (data.parent_id) relatedIds.add(String(data.parent_id));
      }

      const result = Array.from(relatedIds);
      this.logger.info(`[StudentStrategy] Found ${result.length} relations for user ${userId}:`, result);
      
      return result;
    }
}