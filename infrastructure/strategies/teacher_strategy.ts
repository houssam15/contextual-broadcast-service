import { UserRoleStrategy } from "../../domain/interfaces/user_role_strategy.ts";
import {Pool,RowDataPacket} from 'mysql2/promise';
import { Logger } from "../../domain/interfaces/logger";

export class TeacherStrategy implements UserRoleStrategy {
    private db: Pool;
    private logger: Logger;

    constructor(db: Pool, logger: Logger){
        this.db = db;
        this.logger = logger;
    }

    supports(role: string): boolean {
        return role === "teacher";
    }

    async getRelatedIds(userId: string): Promise<string[]> {
      const relatedIds: Set<string> = new Set();
      
      const [rows] = await this.db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE teacher_id = ? AND is_student = TRUE',
        [userId]
      );
      rows.forEach(row => relatedIds.add(String(row.id)));

      const result = Array.from(relatedIds);
      this.logger.info(`[TeacherStrategy] Found ${result.length} relations for user ${userId}:`, result);
      
      return result;
    }
}