export interface UserConnectionLog {
    id?: string;
    userId: string;
    connectedAt: Date;
    disconnectedAt?: Date;
    durationSeconds?: number;
    ipAddress?: string;
    userAgent?: string;
}