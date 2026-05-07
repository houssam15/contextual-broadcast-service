import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { createBaseServer } from './http_server.ts';
import { SocketServer } from './realtime/socket_service.ts';
import { config } from '../config/index.ts';
import { Logger } from '../domain/interfaces/logger.ts';
import { UserRepository } from '../domain/interfaces/user_repository.ts';
import { PresenceTracker } from '../domain/interfaces/presence_tracker.ts';

interface AppDependencies {
    userRepository: UserRepository;
    presenceTracker: PresenceTracker;
    logger: Logger;
}

export class App {
    private httpServer: HttpServer | HttpsServer;
    private io: SocketIOServer;

    constructor(deps: AppDependencies) {
        this.httpServer = createBaseServer(deps.logger);

        this.io = new SocketIOServer(this.httpServer, {
            cors: { origin: "*", methods: ["GET", "POST"] }
        });

        new SocketServer(this.io, deps).init();
    }

    public listen() {
        const port = config.server.port || 3000;
        this.httpServer.listen(port, () => {
            console.log(`🚀 Server listening on port ${port}`);
        });
    }
}