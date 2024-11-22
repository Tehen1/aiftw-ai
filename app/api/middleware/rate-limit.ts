import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimit: RateLimitStore = {};

export function withRateLimit(handler: Function) {
  return async function (req: NextRequest) {
    const ip = headers().get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Clean up expired entries
    Object.keys(rateLimit).forEach((key) => {
      if (rateLimit[key].resetTime < now) {
        delete rateLimit[key];
      }
    });

    // Initialize or get rate limit data for this IP
    if (!rateLimit[ip] || rateLimit[ip].resetTime < now) {
      rateLimit[ip] = {
        count: 0,
        resetTime: now + RATE_LIMIT_WINDOW,
      };
    }

    // Check rate limit
    if (rateLimit[ip].count >= MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil((rateLimit[ip].resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (rateLimit[ip].resetTime - now) / 1000
            ).toString(),
          },
        }
      );
    }

    // Increment request count
    rateLimit[ip].count++;

    try {
      // Call the original handler
      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);
      return new NextResponse(
        JSON.stringify({ error: "Internal Server Error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };
}
