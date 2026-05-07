export abstract class PresenceTracker {

    abstract setOnline(userId:string): Promise<void>;
    abstract setOffline(userId: string): Promise<void>;
    abstract isOnline(userId: string): Promise<boolean>;
    abstract getOnlineUsers(userIds: string[]): Promise<string[]>;

}