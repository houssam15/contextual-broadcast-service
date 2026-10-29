import { TeamMemberDto } from "../dtos/team_member_dto";
import type { RoomMappingPayload } from "./user_role_strategy";

export abstract class  UserRepository {
     abstract findById(id: string): Promise<any>;
     abstract getRelatedUserIds(userId: string): Promise<RoomMappingPayload[]>;
     abstract getTeamById(teamId: number): Promise<UserTeamDto | null>;
     abstract getTeamMembers(userId:number,teamId:number,query?:string): Promise<TeamMemberDto []>;
     abstract getUserFriends(userId:number): Promise<TeamMemberDto[]>;
}

