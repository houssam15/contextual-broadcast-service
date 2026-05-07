import { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";

export class RedisPresenceTracker implements PresenceTracker{
    redis: any;
    prefix: string;

    constructor(redisClient: any){
        this.redis = redisClient;
        this.prefix = "presence:";
    }

    async setOnline(userId: string): Promise<void> {
        await this.redis.set(`${this.prefix}${userId}`, "true","EX",86400);
    }

    async setOffline(userId: string): Promise<void> {
        await this.redis.del(`${this.prefix}${userId}`);
    }

    async isOnline(userId: string): Promise<boolean> {
        const exists = await this.redis.exists(`${this.prefix}${userId}`);
        return exists === 1;
    }

    async getOnlineUsers(userIds: string[]): Promise<string[]> {
        if (userIds.length === 0) return [];

        const keys = userIds.map(id => `${this.prefix}${id}`);
        const results = await this.redis.mget(keys);

        return userIds.filter((id, index) => results[index] !== null);
    }
}

