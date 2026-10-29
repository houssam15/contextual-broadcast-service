const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function connectUserUseCase(
    userId: string, 
    { userRepository, presenceTracker, userConnectionLogRepository, logger }: AppDependencies,
    ipAddress?: string,
    userAgent?: string
) {
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Connection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) connecting. Notifying rooms: ${rooms.map((r: any) => r.token || r).join(', ')}`);
    
    // 1. Log connection start with IP and User-Agent
    const connectedAt = new Date();
    const logId = await userConnectionLogRepository.createLog({
        userId,
        connectedAt,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined
    });

    // 2. Save active session metadata via PresenceTracker
    await presenceTracker.setUserSession(userId, {
        logId: String(logId),
        connectedAt: connectedAt.toISOString()
    });

    // 3. Update real-time presence
    await presenceTracker.setOnline(userId);
    await presenceTracker.setAllowedRooms(userId, rooms);
    
    const roomTokens = rooms.map((r: any) => typeof r === 'string' ? r : r.token);
    await presenceTracker.broadcastPresence(userId, 'user_online', roomTokens);
    
    logger.info(`User ${userId} is now online (Log ID: ${logId})`);
    return { user, rooms };
}

/*
const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function connectUserUseCase(userId: string, {userRepository, presenceTracker,logger} : AppDependencies){
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Connection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) connecting. Notifying rooms: ${rooms.join(', ')}`);
    
    await presenceTracker.setOnline(userId);
    //Save cross-service identity map link for safe SQL persistence
    //await presenceTracker.mapIdentityToSqlId(userId, user.id);
    //Save calculated allowed rooms to cache for External Services lookups
    await presenceTracker.setAllowedRooms(userId, rooms);
    //Publish presence broadcast so External Services registers it in real-time
    await presenceTracker.broadcastPresence(userId, 'user_online', rooms);
    
    logger.info(`User ${userId} is now online`);
    return { user , rooms };
}
*/