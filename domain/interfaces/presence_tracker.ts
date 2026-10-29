import { UserSessionData } from "../models/user_session_data";

const { RoomMappingPayload } = require("./user_role_strategy.ts");

export abstract class PresenceTracker {

    abstract setOnline(userId:string): Promise<void>;
    abstract setOffline(userId: string): Promise<void>;
    abstract isOnline(userId: string): Promise<boolean>;
    abstract getOnlineUsers(userIds: string[]): Promise<string[]>;

    abstract setAllowedRooms(userId: string, rooms: RoomMappingPayload[]): Promise<void>;
    abstract broadcastPresence(userId: string, event: 'user_online' | 'user_offline', rooms: string[]): Promise<void>;

    //abstract mapIdentityToSqlId(userIdToken: string, sqlId: number): Promise<void>;

    abstract setUserSession(userId: string, session: UserSessionData): Promise<void>;
    abstract getUserSession(userId: string): Promise<UserSessionData | null>;
}