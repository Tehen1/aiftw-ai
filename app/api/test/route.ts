import { NextRequest } from 'next/server';
import { withRateLimit, handleApiResponse } from '../middleware';

async function handler(request: NextRequest) {
    return handleApiResponse({ message: 'Test endpoint successful' });
}

export const GET = withRateLimit(handler);
