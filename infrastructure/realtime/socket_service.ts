import { UserRepository } from "../../domain/interfaces/user_repository.ts";
import { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";
import { connectUserUseCase } from "../../application/use_cases/connect_user.ts";
import { Logger } from "../../domain/interfaces/logger.ts";
import { disconnectUserUseCase } from "../../application/use_cases/disconnect_user.ts";
import { AppDependencies } from "../app.ts";
import { InternalNotificationEvent } from "../../domain/events/internal_notification_event.ts";
import { EventNames } from "../../domain/events/event_types.ts";

export class SocketServer {
    io: any;
    deps: AppDependencies;

    constructor(io:any, deps: AppDependencies) {
        this.io = io;
        this.deps = deps;
    }

    private broadcastToRooms(rooms: string [], event: string, data:any){
        rooms.forEach(room => {
            this.io.to(room).emit(event,data);
        })
    }

    init(): SocketServer{
        this.io.on("connection", async (socket: any) => {
            try{
                const userId = String(socket.handshake.auth.userId);
                this.deps.logger.info(`New connection: userId=${userId}, socketId=${socket.id}`);
                if (!userId) {
                    this.deps.logger.error("Connection attempt without userId");
                    socket.disconnect();
                    return;
                }
                await socket.join(userId);
                this.deps.logger.info(`Socket ${socket.id} joined room: ${userId}`);
                const {user, rooms} = await connectUserUseCase(userId,this.deps);
                this.deps.logger.info(`User ${userId} connected. Joining rooms: ${rooms.join(", ")}`);
                this.broadcastToRooms(rooms, "user_online", { id: user.id, name: user.name });

                socket.on("disconnect", async (reason: string) => {
                    try{
                        this.deps.logger.info(`Socket disconnected: userId=${userId}, socketId=${socket.id}, reason=${reason}`);
                        const {user, rooms} = await disconnectUserUseCase(userId,this.deps);
                        this.broadcastToRooms(rooms, "user_offline", { id: user.id, name: user.name });
                    }catch(err){
                        this.deps.logger.error("Error during disconnect handling:", err);
                    }
                });

            }catch(err){
                this.deps.logger.error("Error during connection handling:", err);
                socket.disconnect();
            }
        });

        this.deps.eventBus.on(EventNames.INTERNAL_NOTIFICATION, (payload: InternalNotificationEvent) => {
            this.deps.logger.info(`SocketServer caught event: ${payload.event}`);
            this.broadcastToRooms(payload.rooms, payload.event, payload.data);
        });
        
        return this;
    }
    
}

