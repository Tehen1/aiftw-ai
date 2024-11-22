import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    digest: z.enum(['daily', 'weekly', 'never'])
  }),
  accessibility: z.object({
    reduceMotion: z.boolean(),
    highContrast: z.boolean(),
    fontSize: z.enum(['small', 'medium', 'large'])
  }),
  language: z.string(),
  timezone: z.string()
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Mock user settings - replace with database query
    const settings = {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        digest: 'daily'
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        fontSize: 'medium'
      },
      language: 'en',
      timezone: 'UTC'
    };

    return NextResponse.json(settings);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = settingsSchema.parse(json);

    // Here you would save to your database
    return NextResponse.json(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}