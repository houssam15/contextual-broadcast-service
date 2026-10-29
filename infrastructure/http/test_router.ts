const { hmRequire } = require("../../config/hm_require");
const { IncomingMessage, ServerResponse } = hmRequire("http");
import type { AppDependencies } from "../app";
const { BaseRouter } = require("./base_router");

export class TestRouter extends BaseRouter{
    constructor(private deps: AppDependencies) {
        super();
    }

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

}