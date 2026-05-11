// infrastructure/events/event_bus.ts
import { EventEmitter } from "events";
import { Logger } from "../../domain/interfaces/logger";

export class EventBus extends EventEmitter {
    constructor(private logger: Logger) {
        super();
    }

    /**
     * GENERIC MIDDLEWARE:
     * Overriding the emit method allows us to intercept every 
     * single event that passes through this bus.
     */
    public emit(eventName: string | symbol, ...args: any[]): boolean {
        const payload = args[0];
        
        this.logger.info(`[EVENT BUS DISPATCH] 
            Event: ${String(eventName)} 
            Details: ${this.formatDetails(payload)}`);

        return super.emit(eventName, ...args);
    }

    private formatDetails(payload: any): string {
        return JSON.stringify(payload);
    }
}