const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function disconnectUserUseCase(
    userId: string, 
    { userRepository, presenceTracker, userConnectionLogRepository, logger }: AppDependencies
) {
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Disconnection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) disconnecting. Notifying rooms: ${rooms.map((r: any) => r.token || r).join(', ')}`);

    // 1. Retrieve connection session details via PresenceTracker
    const disconnectedAt = new Date();
    const sessionData = await presenceTracker.getUserSession(userId);

    if (sessionData && sessionData.logId && sessionData.connectedAt) {
        const connectedAt = new Date(sessionData.connectedAt);
        const durationSeconds = Math.max(0, Math.floor((disconnectedAt.getTime() - connectedAt.getTime()) / 1000));

        // 2. Persist log closure in MySQL
        await userConnectionLogRepository.closeLog(
            Number(sessionData.logId),
            disconnectedAt,
            durationSeconds
        );

        logger.info(`Closed log session ${sessionData.logId} for user ${userId} (Duration: ${durationSeconds}s)`);
    } else {
        logger.info(`No active connection session found for user ${userId}`);
    }

    // 3. Update real-time presence
    await presenceTracker.setOffline(userId);
    
    const roomTokens = rooms.map((r: any) => typeof r === 'string' ? r : r.token);
    await presenceTracker.broadcastPresence(userId, 'user_offline', roomTokens);
    
    logger.info(`User ${userId} is now offline`);
    return { user, rooms };
}

/*

const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function disconnectUserUseCase(
    userId: string, 
    {userRepository, presenceTracker,userConnectionLogRepository,logger} : AppDependencies,
    ipAddress?: string,
){
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Disconnection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) disconnecting. Notifying rooms: ${rooms.join(', ')}`);
    await presenceTracker.setOffline(userId);
    //Publish offline presence broadcast
    await presenceTracker.broadcastPresence(userId, 'user_offline', rooms);
    logger.info(`User ${userId} is now offline`);
    return { user , rooms };
}
*/