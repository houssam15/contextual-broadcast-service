import type { Logger } from "../../domain/interfaces/logger";

export class ConsoleLogger implements Logger {
  info(message: string, context?: any): void {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context || '');
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error || '');
  }

  debug(message: string, data?: any): void {
    // Only log if we are in development mode
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}