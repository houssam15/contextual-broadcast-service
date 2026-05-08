import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { createBaseServer } from './http_server.ts';
import { SocketServer } from './realtime/socket_service.ts';
import { config } from '../config/index.ts';
import { Logger } from '../domain/interfaces/logger.ts';
import { UserRepository } from '../domain/interfaces/user_repository.ts';
import { PresenceTracker } from '../domain/interfaces/presence_tracker.ts';
import { TestRouter } from './http/test_router.ts';

export interface AppDependencies {
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

        // --- TEST DISCOVERY ENDPOINT ---
        if (config.server.env === "dev") {
            const testRouter = new TestRouter(deps);
            this.httpServer.on("request", (req, res) => {
                testRouter.handleRequest(req, res);
            });
            deps.logger.info("Test Backdrop activated");
        }
    }

    public listen() {
        const port = config.server.port || 3000;
        this.httpServer.listen(port, () => {
            console.log(`🚀 Server listening on port ${port}`);
        });
    }
}