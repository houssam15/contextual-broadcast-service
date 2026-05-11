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
import { InternalTriggerRouter } from './http/internal_trigger_router.ts';
import { EventBus } from './events/event_bus.ts';

export interface AppDependencies {
    userRepository: UserRepository;
    presenceTracker: PresenceTracker;
    logger: Logger;
    eventBus: EventBus;
}

export class App {
    private httpServer: HttpServer | HttpsServer;
    private io: SocketIOServer;

    constructor(deps: AppDependencies) {
        this.httpServer = createBaseServer(deps.logger);

        this.io = new SocketIOServer(this.httpServer, {
            cors: { origin: "*", methods: ["GET", "POST"] }
        });

        const sockerServer = new SocketServer(this.io, deps).init();

        // --- HTTP REQUEST HANDLER ---
        this.httpServer.on("request", (req, res) => {
            // --- TEST DISCOVERY ENDPOINT ---
            if (config.server.env === "dev") {
                new TestRouter(deps).handleRequest(req, res);
                deps.logger.info("Test Backdrop activated");
            }
            // --- INTERNAL TRIGGER ENDPOINT ---
            if (config.internalTrigger.enabled) {
                new InternalTriggerRouter(deps,sockerServer).handleRequest(req, res);
                deps.logger.info("Internal Trigger activated");
            }
        });

    }

    public listen() {
        const port = config.server.port || 3000;
        this.httpServer.listen(port, () => {
            console.log(`🚀 Server listening on port ${port}`);
        });
    }
}