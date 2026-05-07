// infrastructure/http_server.ts
import { createServer as createHttpServer, Server as HttpServer } from "http";
import { createServer as createHttpsServer, Server as HttpsServer } from "https";
import { readFileSync } from "fs";
import { config } from "../config/index.ts";
import { Logger } from "../domain/interfaces/logger.ts";

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