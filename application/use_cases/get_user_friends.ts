const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function getUserFriendsUseCase(userId: string, {userRepository, presenceTracker,logger} : AppDependencies){
    try{
        var userIds = await userRepository.getRelatedUserIds(userId);  
        userIds = userIds.filter(e => e.type == "direct_message");
        logger.debug(`[getUserFriendsUseCase] userIds ${JSON.stringify(userIds)}`);
        //const friends = await userRepository.getUserFriends(Number(userId));  
        //logger.debug(`[getUserFriendsUseCase] friends ${JSON.stringify(friends)}`);
        //return friends;
         var userFriends: any[] = [];
        for(let e of userIds){
            const friend = await userRepository.findById(String(e.sqlRoomId));
            if (friend) {
                userFriends.push({
                    id: friend.id,
                    name: friend.username,
                    type: "direct_message"
                });
            }
        }
        logger.debug(`[getUserFriendsUseCase] userFriends ${userFriends.map(e =>JSON.stringify(e)).join("\n")}`);
        return userFriends;
    }catch(error:any){
        logger.error(`[getUserFriendsUseCase] error ${error}`);
        throw error;
    }
}
