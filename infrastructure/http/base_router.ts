import { ServerResponse } from "http";

export class BaseRouter {

    protected sendJson(res: ServerResponse, status: number, data: any) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }

    protected sendError(res: ServerResponse, status: number, message: string) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: message }));
        return true; 
    }

    protected async parseJsonBody(req: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk: any) => {
                body += chunk;
            });
            req.on("end", () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (err) {
                    reject(new Error("Invalid JSON body"));
                }
            });
            req.on("error", (err: any) => {
                reject(err);
            });
        });
    }
}