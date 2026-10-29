import type { AppDependencies } from "../../infrastructure/app.ts";

export async function getTeamMembersUseCase({teamId,userId,query}: {teamId:number,userId:number,query? :string}, {logger,userRepository,presenceTracker,imageService} : AppDependencies){

    logger.debug(`[getTeamMembersUseCase] userId ${userId} teamId ${teamId} query ${query}`);

    var teamMembers = await userRepository.getTeamMembers(userId,teamId,query);  

    for(let teamMember of teamMembers){
        teamMember.setOnline(await presenceTracker.isOnline(teamMember.getId()));
        teamMember.setStatus(teamMember.getOnline() ? "online":"offline");
        const avatarHealh = teamMember.getAvatarUrl() && await imageService.isImageUrlValid(teamMember.getAvatarUrl()!);
        if(!avatarHealh){
            teamMember.setAvatarUrl(process.env.DEFAULT_USER_PROFILE);
        }
    }

    logger.debug(`[getUserTeamsUseCase] teamMembers ${teamMembers.map(e =>JSON.stringify(e)).join("\n")}`);
    
    return {
        teamId,
        query,
        teamMembers
    };
}

