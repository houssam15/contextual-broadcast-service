import type { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";
import type { RoomMappingPayload } from "../../domain/interfaces/user_role_strategy.ts";
import { UserSessionData } from "../../domain/models/user_session_data.ts";

export class RedisPresenceTracker implements PresenceTracker{
    redis: any;
    prefix: string;
    channelName: string;

    constructor(redisClient: any){
        this.redis = redisClient;
        this.prefix = process.env.REDIS_PRESENCE_PREFIX || "presence:";
        this.channelName = process.env.REDIS_PRESENCE_CHANNEL || "user_presence_channel";
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

    async setAllowedRooms(userId: string, rooms: RoomMappingPayload[]): Promise<void> {
        const authorizationKey = `user:${userId}:allowed_rooms`;

        // 1. Deduplicate input array in-memory by sqlRoomId & type (or token)
        const uniqueRoomsMap = new Map<string, RoomMappingPayload>();
        for (const room of rooms) {
            // Create a unique key per room entity
            const uniqueKey = `${room.type}:${room.sqlRoomId}:${room.token}`;
            if (!uniqueRoomsMap.has(uniqueKey)) {
                uniqueRoomsMap.set(uniqueKey, room);
            }
        }
        const uniqueRooms = Array.from(uniqueRoomsMap.values());

        // 2. Clear old allowed rooms set
        await this.redis.del(authorizationKey);

        if (uniqueRooms.length === 0) return;

        // 3. Use pipeline for efficient batch execution and network trip reduction
        const pipeline = this.redis.pipeline();

        // SADD naturally prevents duplicate tokens in the Set
        const tokens = uniqueRooms.map(r => r.token);
        pipeline.sadd(authorizationKey, ...tokens);
        pipeline.expire(authorizationKey, 86400); // 24h lease

        // 4. Set mapping keys for unique rooms only
        for (const room of uniqueRooms) {
            const mappingKey = `room_map:${room.token}`;
            pipeline.hset(mappingKey, "sql_id", String(room.sqlRoomId));
            pipeline.hset(mappingKey, "type", String(room.type));
            pipeline.expire(mappingKey, 86400);

            const reverseMappingKey = `room_sql_map:${room.type}:${room.sqlRoomId}`;
            pipeline.set(reverseMappingKey, room.token, "EX", 86400);
        }

        // Execute all Redis operations at once
        await pipeline.exec();
    }
    
    async broadcastPresence(userId: string, event: 'user_online' | 'user_offline', rooms: string[]): Promise<void> {
        const payload = {
            event,
            userId,
            rooms
        };
        await this.redis.publish(this.channelName, JSON.stringify(payload));
    }

    /*async mapIdentityToSqlId(userIdToken: string, sqlId: number): Promise<void> {
        const mappingKey = `identity_map:${userIdToken}:sql_id`;
        await this.redis.set(mappingKey, String(sqlId), "EX", 86400);
    }*/

    async setUserSession(userId: string, session: UserSessionData): Promise<void> {
        const key = `presence:session:${userId}`;
        // Support both ioredis (hset) and node-redis v4+ (hSet)
        if (typeof (this.redis as any).hset === 'function') {
            await (this.redis as any).hset(key, session);
        } else if (typeof (this.redis as any).hSet === 'function') {
            await (this.redis as any).hSet(key, session);
        }
    }

    async getUserSession(userId: string): Promise<UserSessionData | null> {
        const key = `presence:session:${userId}`;
        let data: any = null;

        if (typeof (this.redis as any).hgetall === 'function') {
            data = await (this.redis as any).hgetall(key);
        } else if (typeof (this.redis as any).hGetAll === 'function') {
            data = await (this.redis as any).hGetAll(key);
        }

        if (data && data.logId && data.connectedAt) {
            return {
                logId: String(data.logId),
                connectedAt: String(data.connectedAt)
            };
        }
        return null;
    }
}
