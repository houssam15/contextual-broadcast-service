import { IncomingMessage, ServerResponse } from "http";
import { AppDependencies } from "../app.ts";
import { BaseRouter } from "./base_router.ts";
import { config } from "../../config/index.ts";
import { SocketServer } from "../realtime/socket_service.ts";
import { EventNames } from "../../domain/events/event_types.ts";

export class InternalTriggerRouter extends BaseRouter{

    constructor(private deps: AppDependencies,private socketServer: SocketServer) {
        super();
    }

    /**
     * Attempts to handle a request. 
     * Returns true if it handled the request, false otherwise.
     */
    public async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
        const isInternalTrigger = req.url === config.internalTrigger.endpoint && req.method === "POST";

        if (!isInternalTrigger) return false;

        try {
            const providedSecret = req.headers['x-internal-trigger-secret'];
            const expectedSecret = config.internalTrigger.secret;
            if (providedSecret !== expectedSecret) {
                this.sendError(res, 401, "Unauthorized");
                return true;
            }
            const body  = await this.parseJsonBody(req);
            const { rooms, event, data } = body;
            if (!rooms || !event || !Array.isArray(rooms)) {
                this.sendError(res, 400, "Missing required fields: rooms (array), event (string)");
                return true;
            }

            this.deps.eventBus.emit(EventNames.INTERNAL_NOTIFICATION,{
                rooms: body.rooms,
                event: body.event,
                data: body.data
            });

            this.sendJson(res, 200, { message: "Internal trigger received" });
        } catch (err) {
            this.deps.logger.error("Failed to handle internal trigger", err);
            this.sendError(res, 500, "Failed to handle internal trigger");
        }

        return true;
    }

}