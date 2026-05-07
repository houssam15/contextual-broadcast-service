export interface UserRoleStrategy {
    supports(role: string): boolean;
    getRelatedIds(userId:string): Promise<string[]>;
}