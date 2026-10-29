import path from 'node:path';

//If DB_HOST isn't set, we are likely running locally without Docker
if (!process.env.DB_HOST) {
    const envFile = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env";
    const envPath = path.resolve(process.cwd(), envFile);
    try {
        process.loadEnvFile(envPath);
    } catch {
        // Silently skip if file doesn't exist
    }
}

export const config = {
    import:{
        node_path: process.env.NODE_PATH,
        system_path: process.env.SYSTEM_PATH,
    },
    server: {
        port: parseInt(process.env.PORT || "3000"),
        env: process.env.NODE_ENV || "development"
    },
    logging: {
        level: process.env.LOG_LEVEL || "info"
    },
    https: {
        useHttps: process.env.USE_HTTPS === "true",
        keyPath: process.env.SSL_KEY_PATH || "",
        certPath: process.env.SSL_CERT_PATH || ""
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || "0")
    },
    db: {
        mySql: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "8889"),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
            tables:{
                userUserTable: process.env.DB_USERS_USERS_TABLE,
                teamUsersTable: process.env.DB_TEAM_USERS_TABLE,
                teamsTable: process.env.DB_TEAMS_TABLE,
                usersTable: process.env.DB_USERS_TABLE,
                userConnectionLogTable: process.env.DB_USER_CONNECTION_LOG_TABLE
            }
        }
    },
    internalTrigger: {
        enabled: process.env.INTERNAL_TRIGGER_ENABLED === "true",
        secret: process.env.INTERNAL_TRIGGER_SECRET || "default_secret",
        endpoint: "/api/internal/trigger"
    }
};
