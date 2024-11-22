import RedisClient from '../lib/redis';
import { RATE_LIMIT_CONFIG } from '../config/redis.config';

async function testRedisConnection() {
    try {
        console.log('Testing Redis connection...');
        const redis = await RedisClient.getInstance();
        
        // Test basic operations
        console.log('Testing basic Redis operations...');
        await redis.set('test_key', 'Hello Redis!');
        const value = await redis.get('test_key');
        console.log('Basic operations test:', { value });
        
        // Test rate limiting
        console.log('\nTesting rate limiting...');
        const identifier = 'test-user';
        const results = [];
        
        for (let i = 0; i < 5; i++) {
            const result = await RedisClient.checkRateLimit(
                redis,
                identifier,
                3, // max requests
                10000 // window in ms
            );
            results.push(result);
            console.log(`Request ${i + 1}:`, result);
        }
        
        // Clean up
        console.log('\nCleaning up...');
        await redis.del('test_key');
        await redis.del(RedisClient.getRateLimitKey(identifier));
        await redis.quit();
        
        console.log('\nTests completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Redis test failed:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('Received SIGINT. Cleaning up...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Cleaning up...');
    process.exit(0);
});

testRedisConnection();
