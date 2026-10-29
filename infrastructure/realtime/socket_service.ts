import type { UserRepository } from "../../domain/interfaces/user_repository";
import type { PresenceTracker } from "../../domain/interfaces/presence_tracker";
const { connectUserUseCase } = require("../../application/use_cases/connect_user");
import type { Logger } from "../../domain/interfaces/logger";
const { disconnectUserUseCase } = require("../../application/use_cases/disconnect_user");
const { getTeamMembersUseCase } = require("../../application/use_cases/get_team_members");

import type { AppDependencies } from "../app";
const { InternalNotificationEvent } = require("../../domain/events/internal_notification_event");
const { EventNames } = require("../../domain/events/event_types");
const { DomainException } = require("../../domain/exceptions/domain_exception");
import type { RoomMappingPayload } from "../../domain/interfaces/user_role_strategy";
import { getUserTeamsUseCase } from "../../application/use_cases/get_user_teams";
import { TeamMemberDto } from "../../domain/dtos/team_member_dto";
import { getUserFriendsUseCase } from "../../application/use_cases/get_user_friends";
import { getInitialStateUseCase } from "../../application/use_cases/get_initial_state";

export class SocketServer {
    io: any;
    deps: AppDependencies;

    constructor(io:any, deps: AppDependencies) {
        this.io = io;
        this.deps = deps;
    }

    private broadcastToRooms(rooms: RoomMappingPayload [], event: string, data:any){
        rooms.forEach(room => {
            this.io.to(room.token).emit(event,data);
        })
    }

    init(): SocketServer{
        this.io.on("connection", async (socket: any) => {
            try{
                const rawUserId = socket.handshake.query?.userId;
                const ipAddress = (
                    socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || 
                    socket.handshake.address
                )?.trim();
                const userAgent = socket.handshake.headers["user-agent"];

                if (!rawUserId) {
                    this.deps.logger.error(`Connection attempt refused: Missing userId on socket ${socket.id}`);
                    socket.disconnect(true); 
                    return;
                }
                const userId = String(rawUserId);
                this.deps.logger.info(`New connection: userId=${userId}, socketId=${socket.id}`);
                if (!userId) {
                    this.deps.logger.error("Connection attempt without userId");
                    socket.emit("failure", { message: "Missing query authentication identity parameter [userId]." });
                    socket.disconnect();
                    return;
                }
                try{
                    //await socket.join(userId);
                    //this.deps.logger.info(`Socket ${socket.id} joined personal room: ${userId}`);
                    const {user, rooms} = await connectUserUseCase(userId,this.deps,ipAddress,userAgent);
                    if (rooms && rooms.length > 0) {
                        socket.join(rooms.map(r => r.token));
                        this.deps.logger.info(`User ${userId} joined rooms: ${rooms.join(", ")}`);
                    }
                    //this.deps.logger.info(`User ${userId} connected. Joining rooms: ${rooms.join(", ")}`);
                    this.deps.logger.info(`[SocketServer] User is ONLINE: ${user.name} (ID: ${user.id})`);
                    this.broadcastToRooms(rooms, "user_online", { id: user.id, name: user.name });

                    socket.on("get_team_receivers",async ({teamId}: {teamId:string}) => {
                        try{
                            this.deps.logger.debug(`[SocketServer] get_team_receivers teamId ${teamId}`);
                            const result = await getTeamMembersUseCase({
                                teamId: Number(teamId),
                                userId: Number(userId),
                            },this.deps); 
                            socket.emit("team_receivers_updated",result);
                        }catch(err){
                            socket.emit("chat_error", { error: err });
                            this.deps.logger.error("[SocketServer] Error during get_team_receivers handling:", err);
                            throw err;
                        }
                    });

                    socket.on("get_team_members",async ({teamId,query}: {teamId:string, query?:string}) => {
                        try{
                            this.deps.logger.debug(`[SocketServer] get_team_receivers teamId ${teamId}`);
                            const result = await getTeamMembersUseCase({
                                teamId: Number(teamId),
                                userId: Number(userId),
                                query:query
                            },this.deps); 
                            socket.emit("team_members_updated",result);
                        }catch(err){
                            socket.emit("chat_error", { error: err });
                            this.deps.logger.error("[SocketServer] Error during get_team_members handling:", err);
                            throw err;
                        }
                    });

                    socket.on("get_team_members_v2",async ({teamId,query}: {teamId:string, query?:string}) => {
                        try{
                            this.deps.logger.debug(`[SocketServer] get_team_receivers teamId ${teamId}`);
                            const result = await getTeamMembersUseCase({
                                teamId: Number(teamId),
                                userId: Number(userId),
                                query:query
                            },this.deps); 
                            socket.emit("team_members_updated_v2",result);
                        }catch(err){
                            socket.emit("chat_error", { error: err });
                            this.deps.logger.error("[SocketServer] Error during get_team_members handling:", err);
                            throw err;
                        }
                    });

                    socket.on("get_selected_team_members",async ({teamId,selectedTeamMembersIds}: {teamId:string,selectedTeamMembersIds: string[]}) => {
                        try{
                            this.deps.logger.debug(`[SocketServer] get_selected_team_members teamId ${teamId} selectedTeamMembersIds ${JSON.stringify(selectedTeamMembersIds)}`);

                            const result = await getTeamMembersUseCase({
                                teamId: Number(teamId),
                                userId: Number(userId),
                            },this.deps); 

                            this.deps.logger.debug(`[SocketServer] get_selected_team_members teamId ${teamId} result ${JSON.stringify(result)}`);

                            const selectedteamMembers = result.teamMembers.filter((elm: TeamMemberDto) => selectedTeamMembersIds.includes(String(elm.getId())));

                            this.deps.logger.debug(`[SocketServer] get_selected_team_members teamId ${teamId} selectedteamMembers ${JSON.stringify(selectedteamMembers)}`);

                            socket.emit("selected_team_members_updated",{
                                ...result,
                                teamMembers:selectedteamMembers
                            });
                        }catch(err){
                            socket.emit("chat_error", { error: err });
                            this.deps.logger.error("[SocketServer] Error during get_team_members handling:", err);
                            throw err;
                        }
                    });

                    socket.on("disconnect", async (reason: string) => {
                        try{
                            this.deps.logger.info(`Socket disconnected: userId=${userId}, socketId=${socket.id}, reason=${reason}`);
                            const {user, rooms} = await disconnectUserUseCase(userId,this.deps);
                            this.broadcastToRooms(rooms, "user_offline", { id: user.id, name: user.name });
                        }catch(err){
                            this.deps.logger.error("Error during disconnect handling:", err);
                             throw err;
                        }
                    });


                    socket.on("get_user_teams", async () => {
                        try{
                            this.deps.logger.info("[SocketServer] event get_user_teams tiggred.");
                            const userTeams = await getUserTeamsUseCase(userId,this.deps);
                            socket.emit("user_teams_updated",{userTeams: userTeams});
                        }catch(err){
                            this.deps.logger.error("Error during get_user_teams handling:", err);
                            throw err;
                        }
                    });

                    socket.on("get_user_friends", async () => {
                        try{
                            this.deps.logger.info("[SocketServer] event get_user_friends tiggred.");
                            const userTeams = await getUserFriendsUseCase(userId,this.deps);
                            socket.emit("user_friends_updated",{userFriends: userTeams});
                        }catch(err){
                            this.deps.logger.error("Error during get_user_friends handling:", err);
                            throw err;
                        }
                    });

                    socket.on("get_initial_state", async () => {
                        try {
                            this.deps.logger.debug(`[SocketServer] get_initial_state requested for userId: ${userId}`);
                            
                            const initialState = await getInitialStateUseCase(String(userId),this.deps);

                            socket.emit("initial_state_updated", initialState);
                        } catch (err: any) {
                            this.deps.logger.error(`[SocketServer] get_initial_state error: ${err?.message || err}`);
                            socket.emit("chat_error", { error: err?.message || err });
                        }
                    });

                    socket.on("get_team_status", async (teamId: string) => {
                        try {
                            this.deps.logger.debug(`[SocketServer] get_team_status requested for userId: ${userId}`);
                            
                            const initialState = await getTeamStatusUseCase(String(userId),teamId,this.deps);

                            socket.emit("team_status_updated", initialState);
                        } catch (err: any) {
                            this.deps.logger.error(`[SocketServer] get_team_status error: ${err?.message || err}`);
                            socket.emit("chat_error", { error: err?.message || err });
                        }
                    });
                    

                }catch(err){
                    if (err instanceof DomainException) {
                        this.deps.logger.info(`[SocketServer] Connection handshake rejected: ${err.message}`);
                        socket.emit("failure", { code: err.code, message: err.message });
                    } else {
                        this.deps.logger.error("Unhandled error during connection handling:", err);
                        socket.emit("failure", { code: "INTERNAL_SERVER_ERROR", message: err || "Internal handshake processing failure." });
                    }
                    
                    socket.disconnect(true);
                }


            }catch(err){
                this.deps.logger.error("Error during connection handling:", err);
                socket.disconnect();
            }
        });

        this.deps.eventBus.on(EventNames.INTERNAL_NOTIFICATION, (payload: InternalNotificationEvent) => {
            this.deps.logger.info(`SocketServer caught event: ${payload.event}`);
            //this.broadcastToRooms(payload.rooms, payload.event, payload.data);
        });
        
        return this;
    }
    
}

