// infrastructure/http_server.ts
const { hmRequire } = require("../config/hm_require.ts");
const { createServer: createHttpServer, Server: HttpServer } = hmRequire("http");
const { createServer: createHttpsServer, Server: HttpsServer } = hmRequire("https");
const { readFileSync } = hmRequire("fs");
const { config } = require("../config/index");
import type { Logger } from "../domain/interfaces/logger";

export function createBaseServer(logger: Logger): HttpServer | HttpsServer {
    if (config.https.useHttps) {
        try {
            const options = {
                key: readFileSync(config.https.keyPath),
                cert: readFileSync(config.https.certPath)
            };
            logger.info("🔒 HTTPS enabled. Using SSL certificates.");
            return createHttpsServer(options);
        } catch (err) {
            logger.error("Failed to load SSL certificates, falling back to HTTP", err);
        }
    }
    
    logger.info("🔓 Running with HTTP.");
    return createHttpServer();
}