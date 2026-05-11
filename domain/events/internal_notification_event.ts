export interface InternalNotificationEvent {
    rooms: string[];
    event: string;
    data: any;
    category?: string;
}