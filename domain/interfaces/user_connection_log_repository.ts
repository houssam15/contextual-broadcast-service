import { UserConnectionLog } from "../models/user_connection_log";

export interface UserConnectionLogRepository {
    createLog(log: Omit<UserConnectionLog, "id">): Promise<number>; // returns logId
    closeLog(logId: number, disconnectedAt: Date, durationSeconds: number): Promise<void>;
}