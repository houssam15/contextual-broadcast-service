import Redis from 'ioredis';
import { Logger } from '../../domain/interfaces/logger.js';
import {config} from "../../config/index.ts";

export class RedisClient {
  private client: Redis;

  constructor(private logger: Logger) {
    this.client = this.initializeClient();
    this.setupEventHandlers();
  }

  private initializeClient(): Redis {
    return new Redis({
      port: config.redis.port,  
      host: config.redis.host,
      password: config.redis.password,
      db: config.redis.db,

      retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: null
    });
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.logger.info('✅ Connected to Redis');
    });

    this.client.on('ready', () => {
      this.logger.info('✅ Redis client is ready');
    });

    this.client.on('error', (err: any) => {
      this.logger.error('❌ Redis Error:', err);
    });

    this.client.on('close', () => {
      this.logger.info('⚠️  Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      this.logger.info('🔄 Reconnecting to Redis...');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from Redis...');
    await this.client.quit();
  }
}