import * as fs from 'fs';
import * as path from 'path';

interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    tls?: {
        cert?: string;
        rejectUnauthorized?: boolean;
    };
    retryStrategy?: (times: number) => number | null;
}

export const getRedisConfig = (): RedisConfig => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const certPath = path.join(__dirname, 'redis.crt');

    const config: RedisConfig = {
        host: process.env.REDIS_HOST || '31.220.77.121',
        port: parseInt(process.env.REDIS_PORT || '6382'),
        password: process.env.REDIS_PASSWORD || 'Juliadilove07!',
        tls: {
            cert: fs.readFileSync(certPath, 'utf-8'),
            rejectUnauthorized: !isDevelopment // Strict in production, allow self-signed in development
        },
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    };

    return config;
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: {
        development: 100,
        production: 60
    },
    BLOCK_DURATION: 15 * 60, // 15 minutes in seconds
    KEY_PREFIX: 'rate_limit:'
};
