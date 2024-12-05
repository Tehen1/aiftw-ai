import { NextResponse } from 'next/server';

export class PoeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'PoeError';
  }

  static badRequest(message: string, details?: unknown): PoeError {
    return new PoeError(message, 'BAD_REQUEST', 400, details);
  }

  static unauthorized(message: string): PoeError {
    return new PoeError(message, 'UNAUTHORIZED', 401);
  }

  static notFound(message: string): PoeError {
    return new PoeError(message, 'NOT_FOUND', 404);
  }

  static serverError(message: string, details?: unknown): PoeError {
    return new PoeError(message, 'INTERNAL_SERVER_ERROR', 500, details);
  }
}

export class ValidationError extends PoeError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class BotError extends PoeError {
  constructor(message: string, details?: unknown) {
    super(message, 'BOT_ERROR', 500, details);
    this.name = 'BotError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof PoeError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}
