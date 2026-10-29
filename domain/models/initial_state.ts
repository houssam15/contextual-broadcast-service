import { TeamStatus } from "./team_status";

// domain/models/initial_state.ts
export interface InitialState {
    onlineUserIds: string[];          // list of user IDs currently online
    offlineUserIds: string[];         // list of user IDs currently offline
    teamsStates: TeamStatus[];
}
