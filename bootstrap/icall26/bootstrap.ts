const { EnvInjector } = require('../../config/env_injector');
const { ConfigProvider } = require('../../config/config_provider');
const path = require('node:path');
const { createRequire } = require('node:module');
const Module = require('node:module');

class Icall26ConfigProvider extends ConfigProvider {
    async fetchConfig(): Promise<Record<string, any>> {
        const rawGlobalConfig = require(path.resolve(__dirname,"../../../../config/config.js"));
        const systemPath = rawGlobalConfig?.default?.system_path;
        if (systemPath) {
            (Module as any).globalPaths.push(systemPath);
        }
        const configPath = path.resolve(__dirname, './config.cjs');
        const rawConfig = require(configPath);
        let cliParser: any;
        try {
            cliParser = require(path.join(systemPath, 'hm-cli-parser'));
        } catch (err) {
            console.error('❌ Failed to locate hm-cli-parser inside system_path:', systemPath,err);
            process.exit(1);
        }
        
        //console.log("[Icall26ConfigProvider] raw config :",rawConfig);
        const mergedConfig = cliParser.parseAndApply(rawConfig);
        //console.log("merged config ",mergedConfig);
        //manage certificates
        function getCertificates(){
            if(mergedConfig["use_https"] == true){
                if(mergedConfig["certificates"].some((elm:any) => elm["host"] == mergedConfig["host"])){
                    return mergedConfig["certificates"].find((elm:any) => elm["host"] == mergedConfig["host"]);
                } else if(mergedConfig["certificates"].some((elm:any) => elm["host"].startsWith("*") && mergedConfig["host"].split(".").slice(1).join(".")==elm["host"].slice(2))){
                    return mergedConfig["certificates"].find((elm:any) => elm["host"].startsWith("*") && mergedConfig["host"].split(".").slice(1).join(".")==elm["host"].slice(2));
                }else {
                    null;
                }
            }else{
                return null;
            }
        }

        const certificate = getCertificates();

        if(certificate != null){
            mergedConfig.SSL_CERT_PATH = certificate.certificate;
            mergedConfig.SSL_KEY_PATH = certificate.private_key;
        }

        //console.log("[Icall26ConfigProvider] merged config :",mergedConfig);
        
        const dbName = mergedConfig.database || mergedConfig.application || 'admin';
        if (mergedConfig.database_path) {
            const dbJsonPath = path.join(mergedConfig.database_path, `${dbName}.json`);
            try {
                const fs = await import('node:fs/promises');
                const rawDbData = await fs.readFile(dbJsonPath, 'utf-8');
                console.log(`[Icall26ConfigProvider] dbJsonPath ${dbJsonPath}`);
                //console.log(rawDbData);
                if(rawConfig){
                    const dbConfig = JSON.parse(rawDbData);
                    if (dbConfig.host) mergedConfig.DB_HOST = dbConfig.host;
                    if (dbConfig.port) mergedConfig.DB_PORT = dbConfig.port;
                    if (dbConfig.user) mergedConfig.DB_USER = dbConfig.user;
                    if (dbConfig.password) mergedConfig.DB_PASSWORD = dbConfig.password;
                    if (dbConfig.database) mergedConfig.DB_NAME = dbConfig.database;
                    if (dbConfig.connectionLimit) mergedConfig.DB_CONNECTION_LIMIT = dbConfig.connectionLimit;
                    mergedConfig.db_data = dbConfig;
                }
                
            } catch (error: any) {
                console.warn(`⚠️ [Icall26ConfigProvider] Could not load DB config at ${dbJsonPath}: ${error.message}`);
            }
        }
        return mergedConfig;
    }
}

async function main() {
    const provider = new Icall26ConfigProvider();

    const bootstrapKeys = await EnvInjector.loadAndInject(provider, {
        overrideExisting: true,
        aliases: {
            PORT: 'port',
            NODE_ENV: 'node_env',
            REDIS_HOST: 'redis_host',
            REDIS_PORT: 'redis_port',
            REDIS_PASSWORD: 'redis_password',
            REDIS_DB: 'redis_db',
            NODE_PATH: 'node_path',
            SYSTEM_PATH: 'system_path',
            USE_HTTPS: 'use_https',
            USER_REPOSITORY_TYPE: "user_type_repo",
            DB_USERS_USERS_TABLE:"db_users_users_table",
            DB_TEAM_USERS_TABLE:"db_team_users_table",
            DB_TEAMS_TABLE:"db_teams_table",
            DB_USERS_TABLE:"db_users_table",
            DB_USER_CONNECTION_LOG_TABLE: "db_user_connection_log_table"
        },
        formatters: {
            LOG_LEVEL: (_, config) => (config["debug"] === true || config["debug"] === 'true' ? 'debug' : 'info'),
            PORT: (value, _) => String(parseInt(value, 10) || 7000)
        }
    });

    const localEnvPath = path.resolve(process.cwd(), `.env${process.env.NODE_ENV === "dev" ? ".dev" : ""}`);
    console.log("[EnvInjector] local env path:", localEnvPath);

    // Snapshot keys before loading
    const envKeysBefore = new Set(Object.keys(process.env));

    try {
        process.loadEnvFile(localEnvPath);
    } catch (err: any) {
        console.warn(`[EnvInjector] Could not load env file at ${localEnvPath}: ${err.message}`);
    }

    // Capture any newly loaded keys
    const dotenvKeys = Object.keys(process.env).filter(key => !envKeysBefore.has(key));

    const allActiveKeys = Array.from(new Set([...bootstrapKeys, ...dotenvKeys]));

    console.log('✅ Icall26 Bootstrapped successfully!');
    
    const maxKeyLength = Math.max(...allActiveKeys.map(k => k.length), 0);

    allActiveKeys.forEach((key, index) => {
        const isLast = index === allActiveKeys.length - 1;
        const prefix = isLast ? '   └─ ' : '   ├─ ';
        
        const paddedKey = key.padEnd(maxKeyLength, ' ');
        const value = process.env[key];

        console.log(`${prefix}${paddedKey} :`, value);
    });

    require('../../main.ts');
}

main().catch(console.error);