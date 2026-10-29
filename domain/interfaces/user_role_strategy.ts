export interface UserRoleStrategy {
    supports(role: string): boolean;
    getRelatedIds(userId:string): Promise<RoomMappingPayload[]>;
    supportsV2(data: any): Promise<boolean>;
    getStrategyName(): string;
}

export interface RoomMappingPayload {
    token: string; 
    sqlRoomId: number; 
    type: TypeChannelMode;
}

export type TypeChannelMode = 'team' | 'direct_message';