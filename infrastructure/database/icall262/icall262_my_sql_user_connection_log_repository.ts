import { UserConnectionLog } from "../../../domain/models/user_connection_log";
import { UserConnectionLogRepository } from "../../../domain/interfaces/user_connection_log_repository";
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import type { Logger } from "../../../domain/interfaces/logger";
const { config } = require("../../../config/index");

export class Icall262MySqlUserConnectionLogRepository implements UserConnectionLogRepository {
    private db: Pool;
    logger: Logger;

    private userConnectionLogTable : string;
    
    constructor(db: Pool, logger: Logger) {
        const actualDb = (db as any)?.default || db;

        if (!actualDb || typeof actualDb.execute !== 'function') {
            console.error("[Icall262MySqlUserConnectionLogRepository] Received invalid DB instance:", db);
            throw new Error("[Icall262MySqlUserConnectionLogRepository] Invalid MySQL pool passed to constructor. 'execute' method is missing.");
        }

        this.db = actualDb;
        this.logger = logger;

        this.userConnectionLogTable = config.db.mySql.tables.userConnectionLogTable;
    }

    async createLog(log: Omit<UserConnectionLog, "id">): Promise<number> {
        try {
            const query = `
                INSERT INTO ${this.userConnectionLogTable} (user_id, connected_at, ip_address, user_agent)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await this.db.execute<ResultSetHeader>(query, [
                log.userId, 
                log.connectedAt, 
                log.ipAddress || null,
                log.userAgent || null
            ]);
            
            return result.insertId;
        } catch (err: any) {
            this.logger.error(`[Icall262MySqlUserConnectionLogRepository] createLog error: ${err?.message || err}`);
            throw err;
        }
    }

    async closeLog(logId: number, disconnectedAt: Date, durationSeconds: number): Promise<void> {
        try {
            const query = `
                UPDATE ${this.userConnectionLogTable}
                SET disconnected_at = ?, duration_seconds = ?
                WHERE id = ?
            `;
            await this.db.execute(query, [disconnectedAt, durationSeconds, logId]);
        } catch (err: any) {
            this.logger.error(`[Icall262MySqlUserConnectionLogRepository] closeLog error: ${err?.message || err}`);
            throw err;
        }
    }
}