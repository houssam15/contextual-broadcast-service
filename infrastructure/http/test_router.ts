import { IncomingMessage, ServerResponse } from "http";
import { AppDependencies } from "../app.ts";

export class TestRouter {
    constructor(private deps: AppDependencies) {}

    /**
     * Attempts to handle a request. 
     * Returns true if it handled the request, false otherwise.
     */
    public async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
        const isGetPair = req.url === "/api/test/pair" && req.method === "GET";

        if (!isGetPair) return false;

        try {
            // We use 'any' to bypass the interface check for this dev-only method
            const repo = this.deps.userRepository as any;
            
            if (typeof repo.findTestPair !== 'function') {
                this.deps.logger.error("UserRepository implementation missing findTestPair");
                return this.sendError(res, 500, "Repository mismatch");
            }

            const pair = await repo.findTestPair();
            this.sendJson(res, 200, pair);
        } catch (err) {
            this.deps.logger.error("Failed to fetch test pair", err);
            this.sendError(res, 500, "Database lookup failed");
        }

        return true;
    }

    private sendJson(res: ServerResponse, status: number, data: any) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }

    private sendError(res: ServerResponse, status: number, message: string) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: message }));
        return true; 
    }
}