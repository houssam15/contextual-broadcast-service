// src/config/config_provider.ts

export abstract class ConfigProvider {
    /**
     * Fetches configuration key-value pairs from any source 
     * (e.g. local JSON file, remote URL, AWS Secrets Manager, etc.)
     */
    abstract fetchConfig(): Promise<Record<string, any>>;
}
