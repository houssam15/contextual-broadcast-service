import { RoomMappingPayload } from "../../domain/interfaces/user_role_strategy";
import { InitialState } from "../../domain/models/initial_state";
import { AppDependencies } from "../../infrastructure/app";

export async function getInitialStateUseCase(
    userId: string, 
    { userRepository, presenceTracker, logger }: AppDependencies
): Promise<InitialState> {
    // 1. Fetch user to verify identity
    const user = await userRepository.findById(userId);
    if (!user) {
        logger.error(`Connection failed: User ${userId} not found`);
        throw new Error("User not found");
    }

    // 2. Fetch related rooms/contacts
    const relatedRooms: RoomMappingPayload[] = await userRepository.getRelatedUserIds(userId);

    // Extract plain string identifiers
    const roomTokens: string[] = relatedRooms.map(r => r.token);
    
    // Extract SQL user IDs for direct messages
    const directMessageUserIds: string[] = relatedRooms
        .filter(r => r.type === "direct_message")
        .map(r => String(r.sqlRoomId));

    logger.info(`User ${userId} (${user.name}) connecting. Notifying rooms: ${roomTokens.join(', ')}`);

    // 3. Mark current user as online and setup room permissions
    await presenceTracker.setOnline(userId);
    await presenceTracker.setAllowedRooms(userId, relatedRooms);
    await presenceTracker.broadcastPresence(userId, 'user_online', roomTokens);

    logger.info(`User ${userId} is now online`);

    // 4. Query presence tracker using direct message SQL user IDs
    const onlineUserIds: string[] = await presenceTracker.getOnlineUsers(directMessageUserIds);
    const onlineSet = new Set(onlineUserIds);

    // 5. Partition direct message contacts into online vs offline SQL IDs
    const offlineUserIds = directMessageUserIds.filter(id => !onlineSet.has(id));

    return {
        onlineUserIds,
        offlineUserIds
    };
}