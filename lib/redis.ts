import Redis from 'ioredis';
import { getRedisConfig, RATE_LIMIT_CONFIG } from '../config/redis.config';

class RedisClient {
    private static instance: Redis | null = null;
    private static connectionPromise: Promise<Redis> | null = null;

    public static async getInstance(): Promise<Redis> {
        if (this.instance) {
            return this.instance;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                const config = getRedisConfig();
                const redis = new Redis(config);

                redis.on('connect', () => {
                    console.info('Redis connected successfully', {
                        host: config.host,
                        port: config.port,
                        tls: !!config.tls
                    });
                    this.instance = redis;
                    resolve(redis);
                });

                redis.on('error', (error: Error) => {
                    console.error('Redis connection error:', error);
                    this.instance = null;
                    reject(error);
                });

                redis.on('close', () => {
                    console.warn('Redis connection closed');
                    this.instance = null;
                });

                redis.on('reconnecting', (delay: number) => {
                    console.info(`Redis reconnecting in ${delay}ms`);
                });

                // Handle process termination
                process.on('SIGINT', async () => {
                    await this.cleanup();
                    process.exit(0);
                });

                process.on('SIGTERM', async () => {
                    await this.cleanup();
                    process.exit(0);
                });

            } catch (error) {
                console.error('Redis initialization error:', error);
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    private static async cleanup(): Promise<void> {
        if (this.instance) {
            console.info('Cleaning up Redis connection');
            await this.instance.quit();
            this.instance = null;
        }
    }

    // Helper method to generate rate limit key
    public static getRateLimitKey(identifier: string): string {
        return `${RATE_LIMIT_CONFIG.KEY_PREFIX}${identifier}`;
    }

    // Helper method to check rate limit
    public static async checkRateLimit(
        redis: Redis,
        identifier: string,
        maxRequests: number = RATE_LIMIT_CONFIG.MAX_REQUESTS.production,
        windowMs: number = RATE_LIMIT_CONFIG.WINDOW_MS
    ): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }> {
        const key = this.getRateLimitKey(identifier);
        const now = Date.now();
        const windowStart = now - windowMs;

        try {
            // Remove old requests
            await redis.zremrangebyscore(key, 0, windowStart);

            // Count recent requests
            const requestCount = await redis.zcard(key);

            if (requestCount >= maxRequests) {
                // Get reset time
                const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
                const resetTime = oldestRequest[1] ? parseInt(oldestRequest[1]) + windowMs : now + windowMs;

                return {
                    allowed: false,
                    remaining: 0,
                    resetTime
                };
            }

            // Add current request
            await redis.zadd(key, now.toString(), now.toString());
            await redis.expire(key, Math.ceil(windowMs / 1000));

            return {
                allowed: true,
                remaining: maxRequests - requestCount - 1,
                resetTime: now + windowMs
            };
        } catch (error) {
            console.error('Rate limit check error:', error);
            // In case of error, allow the request but with a warning
            return {
                allowed: true,
                remaining: -1,
                resetTime: now + windowMs
            };
        }
    }
}

export default RedisClient;
