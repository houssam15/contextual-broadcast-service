import dotenv from 'dotenv';

//If DB_HOST isn't set, we are likely running locally without Docker
if (!process.env.DB_HOST) {
    dotenv.config();
}

export const config = {
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
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10")
        }
    }
};