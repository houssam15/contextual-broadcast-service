const { hmRequire } = require("../config/hm_require.ts");
const { Server: SocketIOServer } = hmRequire('socket.io');
const { Server: HttpServer } = hmRequire('http');
const { Server: HttpsServer } = hmRequire('https');
const { createBaseServer } = require('./http_server');
const { SocketServer } = require('./realtime/socket_service');
const { config } = require('../config/index');
import type { Logger } from '../domain/interfaces/logger';
import type { UserRepository } from '../domain/interfaces/user_repository';
import type { PresenceTracker } from '../domain/interfaces/presence_tracker';
const { TestRouter } = require('./http/test_router');
const { InternalTriggerRouter } = require('./http/internal_trigger_router');
import type { EventBus } from './events/event_bus';
import { ImageService } from '../domain/interfaces/image_service';
import { UserConnectionLogRepository } from '../domain/interfaces/user_connection_log_repository';
const path = hmRequire('path');

const express = hmRequire('express');

export interface AppDependencies {
    userRepository: UserRepository;
    userConnectionLogRepository:UserConnectionLogRepository;
    presenceTracker: PresenceTracker;
    logger: Logger;
    eventBus: EventBus;
    imageService: ImageService;
}

export class App {
    private httpServer: HttpServer | HttpsServer;
    private io: SocketIOServer;
    private expressApp: any;

    constructor(deps: AppDependencies) {
        this.expressApp = express();
        this.expressApp.use((req: any, res: any, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.expressApp.use(express.static(path.join(__dirname, '../public')));
        this.httpServer = createBaseServer(deps.logger,this.expressApp);

        this.io = new SocketIOServer(this.httpServer, {
            cors: { origin: "*", methods: ["GET", "POST"] },
            transports: ["websocket", "polling"],
            allowUpgrades: true
        });

        const socketServer = new SocketServer(this.io, deps).init();

        // --- HTTP REQUEST HANDLER ---
        this.expressApp.use((req: any, res: any, next: any) => {
            if (config.server.env === "dev") {
                const handled = new TestRouter(deps).handleRequest(req, res);
                if (handled) return; 
            }

            if (config.internalTrigger.enabled) {
                const handled = new InternalTriggerRouter(deps, socketServer).handleRequest(req, res);
                if (handled) return;
            }

            next();
        });

    }
    
    public listen() {
        const port = config.server.port || 3000;
        this.httpServer.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}
