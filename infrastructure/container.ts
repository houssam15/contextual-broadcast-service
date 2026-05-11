import dbConnection from './database/mysql_client.ts';
import { RedisClient } from './cache/redis_client.ts';
import { MySqlUserRepository } from './database/mysql_user_repository.ts';
import { RedisPresenceTracker } from './cache/redis_presence_tracker.ts';
import { StudentStrategy } from './strategies/student_strategy.ts';
import { TeacherStrategy } from './strategies/teacher_strategy.ts';
import { ParentStrategy } from './strategies/parent_strategy.ts';
import { ConsoleLogger } from './logging/console_logger.ts';
import { EventBus } from './events/event_bus.ts';

const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);

const userStrategies = [
    new StudentStrategy(dbConnection, logger),
    new TeacherStrategy(dbConnection, logger),
    new ParentStrategy(dbConnection, logger)
];

export const container = {
    logger,
    userRepository: new MySqlUserRepository(dbConnection, logger, userStrategies),
    presenceTracker: new RedisPresenceTracker(new RedisClient(logger).getClient()),
    eventBus
};