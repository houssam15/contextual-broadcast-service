export const APP_ALLOWED_KEYS: ReadonlyArray<string> = [
    'NODE_ENV',
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_CONNECTION_LIMIT',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'REDIS_DB',
    'LOG_LEVEL',
    'USE_HTTPS',
    'SSL_KEY_PATH',
    'SSL_CERT_PATH',
    'INTERNAL_TRIGGER_ENABLED',
    'INTERNAL_TRIGGER_SECRET',
    'INTERNAL_TRIGGER_ENDPOINT',
    'USER_STRATEGIES',
    'USER_REPOSITORY_TYPE',
    'CRM_DB_USERS_TABLE',
    'CRM_DB_TEAMS_TABLE',
    'CRM_DB_TEAM_USERS_TABLE',
    "SUPERADMIN2_DB_USERS_TABLE",
    "SUPERADMIN2_DB_TEAMS_TABLE",
    "SUPERADMIN2_DB_TEAM_USERS_TABLE",
    'REDIS_PRESENCE_PREFIX',
    'REDIS_PRESENCE_CHANNEL',
    "NODE_PATH",
    "SYSTEM_PATH",
    "DB_USERS_USERS_TABLE",
    "DB_TEAM_USERS_TABLE",
    "DB_TEAMS_TABLE",
    "DB_USERS_TABLE",
    "DB_USER_CONNECTION_LOG_TABLE",
];

export interface EnvInjectorOptions {
    /** Whether to overwrite variables that already exist on process.env */
    overrideExisting?: boolean;
    /** 
     * Key-value mapping for renaming config keys to process.env names.
     * Example: { port: 'PORT', env: 'NODE_ENV', db_host: 'DATABASE_HOST' }
     */
    aliases?: Record<string, string>;
    /**
     * Strict list of environment variables allowed to be injected into process.env.
     * Anything not on this list will be ignored (like Docker Compose environment filtering).
     */
    allowedKeys?: string[];
    /** Functions to transform/format values before injecting into process.env */
    formatters?: Record<string, (val: any,config: Record<string, any>) => string>;
}

export class EnvInjector {
    /**
     * Pulls configuration from the given provider and injects it into process.env.
     */
    static async loadAndInject(provider: ConfigProvider, options: EnvInjectorOptions = {}): Promise<string[]> {
        try {
            console.log('[EnvInjector] Fetching external configuration...');
            const config = await provider.fetchConfig();

            const injectedKeys: string[] = [];
            const aliases = options.aliases || {};
            const formatters = options.formatters || {};
            const allowedKeys = options.allowedKeys || APP_ALLOWED_KEYS;

            for (const envVar of allowedKeys) {
                const configKey = aliases[envVar] || envVar;
                const rawValue = config[configKey] ?? config[configKey.toLowerCase()];

                if (rawValue === undefined && !formatters[envVar]) {
                    continue;
                }

                let finalValue: string;
                if (formatters[envVar]) {
                    finalValue = String(formatters[envVar](rawValue, config));
                } else if (typeof rawValue === 'object' && rawValue !== null) {
                    finalValue = JSON.stringify(rawValue);
                } else {
                    finalValue = String(rawValue);
                }

                if (process.env[envVar] === undefined || options.overrideExisting) {
                    process.env[envVar] = finalValue;
                    injectedKeys.push(envVar);
                }
            }

            console.log(`✅ [EnvInjector] Successfully injected ${injectedKeys.length} environment variables.`)
            return injectedKeys;
        } catch (error: any) {
            console.error(`❌ [EnvInjector] Failed to load config: ${error.message}`);
            throw error;
        }
    }
}