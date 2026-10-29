import { TeamMemberDto } from "./team_member_dto";

export class UserTeamDto{
    private id:string;
    private name:string;

    constructor({id,name}:{id:string,name:string}){
        this.id = id;
        this.name = name;
    }

    toJson():any{
        return {
            id: this.id,
            name: this.name,
        };
    }
}