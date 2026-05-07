import { UserRepository } from "../../domain/interfaces/user_repository.ts";
import { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";
import { Logger } from "../../domain/interfaces/logger.ts";

export async function connectUserUseCase(userId: string, {userRepository, presenceTracker,logger} : {userRepository: UserRepository, presenceTracker : PresenceTracker, logger: Logger}){
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Connection failed: User ${userId} not found`);
        throw new Error("User not found");
    }
    const rooms = await userRepository.getRelatedUserIds(userId);
    logger.info(`User ${userId} (${user.name}) connecting. Notifying rooms: ${rooms.join(', ')}`);
    await presenceTracker.setOnline(userId);
    logger.info(`User ${userId} is now online`);
    return { user , rooms };
}