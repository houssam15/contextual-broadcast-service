import { UserRepository } from "../../domain/interfaces/user_repository.ts";
import { PresenceTracker } from "../../domain/interfaces/presence_tracker.ts";
import { connectUserUseCase } from "../../application/use_cases/connect_user.ts";
import { Logger } from "../../domain/interfaces/logger.ts";

export class SocketServer {
    io: any;
    userRepository: UserRepository;
    presenceTracker: PresenceTracker;
    logger: Logger;

    constructor(io:any, {userRepository, presenceTracker, logger} : {userRepository: UserRepository, presenceTracker : PresenceTracker, logger: Logger}) {
        this.io = io;
        this.userRepository = userRepository;
        this.presenceTracker = presenceTracker;
        this.logger = logger;
    }

    init(){
        this.io.on("connection", async (socket: any) => {
            try{
                const userId = String(socket.handshake.auth.userId);
                this.logger.info(`New connection: userId=${userId}, socketId=${socket.id}`);
                if (!userId) {
                    this.logger.error("Connection attempt without userId");
                    socket.disconnect();
                    return;
                }
                
                const {user, rooms} = await connectUserUseCase(userId,{
                    userRepository: this.userRepository,
                    presenceTracker: this.presenceTracker,
                    logger: this.logger
                });

                this.logger.info(`User ${userId} connected. Joining rooms: ${rooms.join(", ")}`);
                
                await socket.join(userId);

                rooms.forEach(room => {
                    this.io.to(room).emit("user_online",{id: user.id, name: user.name});
                });
            }catch(err){
                this.logger.error("Error during connection handling:", err);
                socket.disconnect();
            }
        });
    }
    
}

