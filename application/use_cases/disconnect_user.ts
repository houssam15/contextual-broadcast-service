import { UserRepository } from "../../domain/interfaces/user_repository.ts";
import { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";
import { Logger } from "../../domain/interfaces/logger.ts";
import { AppDependencies } from "../../infrastructure/app.ts";

export async function disconnectUserUseCase(userId: string, {userRepository, presenceTracker,logger} : AppDependencies){
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Disconnection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) disconnecting. Notifying rooms: ${rooms.join(', ')}`);
    await presenceTracker.setOffline(userId);
    logger.info(`User ${userId} is now offline`);
    return { user , rooms };
}