const { UserRepository } = require("../../domain/interfaces/user_repository.ts");
const { PresenceTracker } = require("../../domain/interfaces/presence_tracker.ts");
const { Logger } = require("../../domain/interfaces/logger.ts");
import type { AppDependencies } from "../../infrastructure/app.ts";

export async function getUserTeamsUseCase(userId: string, {userRepository, presenceTracker,logger} : AppDependencies){
    var userTeamIds = await userRepository.getRelatedUserIds(userId);  
    userTeamIds = userTeamIds.filter(e => e.type == "team");
    logger.debug(`[getUserTeamsUseCase] userTeamIds ${userTeamIds.map(e => `token ${e.token}, sqlId ${e.sqlRoomId}`).join("\n")}`);
    var userTeams: any[] = [];
    for(let teamId of userTeamIds){
        const team = await userRepository.getTeamById(teamId.sqlRoomId);
        logger.debug(`[getUserTeamsUseCase] teamId ${JSON.stringify(team)}`);
        if (team) {
            userTeams.push({
                ...team.toJson(),
                type: "team"
            });
        }
    }
    logger.debug(`[getUserTeamsUseCase] userTeams ${userTeams.map(e =>JSON.stringify(e)).join("\n")}`);
    return userTeams;
}
