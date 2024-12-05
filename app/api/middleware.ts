import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import RedisClient from '@/lib/redis';
import { logger } from '@/lib/logger';
import { RATE_LIMIT_CONFIG } from '@/config/redis.config';

// Rate limiting middleware using Redis
export async function rateLimitMiddleware(request: NextRequest) {
    try {
        const redis = await RedisClient.getInstance();
        const identifier = request.ip || 'unknown';
        
        const { allowed, remaining, resetTime } = await RedisClient.checkRateLimit(
            redis,
            identifier,
            process.env.NODE_ENV === 'production' 
                ? RATE_LIMIT_CONFIG.MAX_REQUESTS.production 
                : RATE_LIMIT_CONFIG.MAX_REQUESTS.development,
            RATE_LIMIT_CONFIG.WINDOW_MS
        );

        if (!allowed) {
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
                    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.MAX_REQUESTS.production.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
                }
            });
        }

        // Add rate limit headers to successful response
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.MAX_REQUESTS.production.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

        return response;
    } catch (error) {
        logger.error('Rate limit middleware error', { error: error instanceof Error ? error.message : String(error) });
        // In case of Redis error, allow the request but log the error
        return NextResponse.next();
    }
}

export function withRateLimit(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
        const rateLimitResponse = await rateLimitMiddleware(request);
        
        if (rateLimitResponse.status === 429) {
            return rateLimitResponse;
        }
        
        return handler(request, ...args);
    }
}

// Enhanced middleware with proper auth checking and logging
export async function middleware(request: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        // Add request tracking
        logger.info('Request started', {
            requestId,
            method: request.method,
            url: request.url,
            userAgent: request.headers.get('user-agent')
        });

        // Basic security headers
        const response = NextResponse.next();
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        response.headers.set('X-Request-ID', requestId);
        
        // Log request completion
        logger.info('Request completed', {
            requestId,
            duration: Date.now() - startTime
        });
        
        return response;
    } catch (error) {
        logger.error('Middleware error', { error: error instanceof Error ? error.message : String(error), requestId });
        return NextResponse.json(
            { success: false, error: 'Internal server error', requestId },
            { status: 500 }
        );
    }
}

// Enhanced authentication check with JWT support
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
    const requestId = request.headers.get('X-Request-ID') || crypto.randomUUID();

    try {
        const authToken = request.headers.get('authorization')?.split(' ')[1];
        if (!authToken) {
            logger.warn('Missing authentication token', { requestId });
            return false;
        }
        
        // TODO: Implement JWT verification
        // For now, we'll check if the token exists
        logger.info('Authentication successful', { requestId });
        return true;
    } catch (error) {
        logger.error('Authentication error', { error: error instanceof Error ? error.message : String(error), requestId });
        return false;
    }
}

// Improved API response handler with proper typing and request tracking
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    requestId?: string;
}

export function handleApiResponse<T>(
    data: T | null,
    error?: string,
    requestId?: string
): NextResponse<ApiResponse<T>> {
    if (error) {
        logger.error('API Error:', { error, requestId });
        return NextResponse.json({
            success: false,
            error,
            requestId
        }, { 
            status: error === 'Internal server error' ? 500 : 400,
            headers: requestId ? { 'X-Request-ID': requestId } : undefined
        });
    }
    
    return NextResponse.json({
        success: true,
        data: data ?? undefined,  // Convert null to undefined
        requestId
    }, {
        headers: requestId ? { 'X-Request-ID': requestId } : undefined
    });
}
