import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { z } from 'zod';

const botSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'claude-2']),
  settings: z.object({
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(100).max(4000),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = botSchema.parse(json);

    // Here you would typically save to your database
    // For now, we'll just return the created bot
    return NextResponse.json({
      id: 'bot_' + Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      userId: session.user.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}