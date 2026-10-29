const { hmRequire } = require("../config/hm_require.ts");
const dbConnection = require('./database/mysql_client');
const { RedisClient } = require('./cache/redis_client');
const { SchoolMySqlUserRepository } = require('./database/school/school_my_sql_user_repository');
const { Superadmin2MySqlUserRepository } = require('./database/superadmin2/superadmin2_my_sql_user_repository');
const { RedisPresenceTracker } = require('./cache/redis_presence_tracker');
const { SchoolStudentStrategy } = require('./strategies/school/school_student_strategy');
const { SchoolTeacherStrategy } = require('./strategies/school/school_teacher_strategy');
const { SchoolParentStrategy } = require('./strategies/school/school_parent_strategy');
const { CrmUserStrategy } = require('./strategies/crm/crm_user_strategy');
const { CrmManagerStrategy } = require('./strategies/crm/crm_manager_strategy');
const { ConsoleLogger } = require('./logging/console_logger');
const { EventBus } = require('./events/event_bus');
const { Pool } = hmRequire('mysql2/promise');
import type { Logger } from "../domain/interfaces/logger";
import { Icall261MySqlUserConnectionLogRepository } from "./database/icall261/icall261_my_sql_user_connection_log_repository";
import { Icall262MySqlUserConnectionLogRepository } from "./database/icall262/icall262_my_sql_user_connection_log_repository";

import { ImageServiceImpl } from "./service/image_service_impl";
const { UserRoleStrategy } = require('../domain/interfaces/user_role_strategy');
const { CrmMySqlUserRepository } = require('./database/crm/crm_my_sql_user_repository');
const { defaultCrmTableConfig } = require("../domain/tables_config/crm_table_config");
const { Icall261MySqlUserRepository } = require('./database/icall261/icall261_my_sql_user_repository');
const { Icall262MySqlUserRepository } = require('./database/icall262/icall262_my_sql_user_repository');
const { defaultIcall26TableConfig } = require("../domain/tables_config/icall26_table_config");
const { defaultSuperadmin2TableConfig } = require("../domain/tables_config/superadmin2_table_config");


const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);

const strategyRegistry: Record<string, new (db: Pool, logger: Logger) => UserRoleStrategy> = {
    school_student_strategy: SchoolStudentStrategy,
    school_teacher_strategy: SchoolTeacherStrategy,
    school_parent_strategy: SchoolParentStrategy,
};

const enabledStrategiesEnv = process.env.USER_STRATEGIES || '';
const enabledStrategyKeys = enabledStrategiesEnv.split(',').map(s => s.trim());
const userStrategies: UserRoleStrategy[] = enabledStrategyKeys
    .map(key => {
        const StrategyClass = strategyRegistry[key];
        if (!StrategyClass) {
            logger.debug(`Strategy "${key}" requested in .env but not found in registry.`);
            return null;
        }
        return new StrategyClass(dbConnection, logger);
    })
    .filter((strategy): strategy is UserRoleStrategy => strategy !== null);


const resolveUserRepository = () => {
    const repoType = process.env.USER_REPOSITORY_TYPE;

    if(!repoType) {
        throw new Error("USER_REPOSITORY_TYPE is not defined in the environment variables.");
    }

    if (repoType === 'school') {
        logger.debug('Initializing UserRepository Version 2 (V2)...');
        return new SchoolMySqlUserRepository(dbConnection, logger, userStrategies);
    }else if(repoType === 'crm') {
        logger.debug('Initializing CRM UserRepository Version 2 (V2)...');
        return new CrmMySqlUserRepository(dbConnection, logger,defaultCrmTableConfig);
    }else if(repoType === 'icall261'){
        logger.debug('Initializing ICALL26 UserRepository...');
        return new Icall261MySqlUserRepository(dbConnection, logger,defaultIcall26TableConfig);
    }else if(repoType === 'icall262'){
        logger.debug('Initializing ICALL26 UserRepository...');
        return new Icall262MySqlUserRepository(dbConnection, logger,defaultIcall26TableConfig);
    }else if(repoType === 'superadmin2'){
        logger.debug('Initializing Superadmin2 UserRepository...');
        return new Superadmin2MySqlUserRepository(dbConnection, logger,defaultSuperadmin2TableConfig);
    }else{
        throw new Error(`Unsupported USER_REPOSITORY_TYPE: ${repoType}.`);
    }
};

const resolveUserConnectionLogRepository = () => {
    const repoType = process.env.USER_REPOSITORY_TYPE;

    if(!repoType) {
        throw new Error("USER_CONNECTION_LOG_REPOSITORY_TYPE is not defined in the environment variables.");
    }

    if(repoType === 'icall261'){
        logger.debug('Initializing ICALL26 UserConnectionLogRepository...');
        return new Icall261MySqlUserConnectionLogRepository(dbConnection, logger);
    }else if(repoType === 'icall262'){
        logger.debug('Initializing ICALL26 UserConnectionLogRepository...');
        return new Icall262MySqlUserConnectionLogRepository(dbConnection, logger);
    }else{
        throw new Error(`Unsupported USER_REPOSITORY_TYPE: ${repoType}.`);
    }
};

export const container = {
    logger,
    userRepository: resolveUserRepository(),
    userConnectionLogRepository: resolveUserConnectionLogRepository(),
    presenceTracker: new RedisPresenceTracker(new RedisClient(logger).getClient()),
    eventBus,
    imageService: new ImageServiceImpl()
};
