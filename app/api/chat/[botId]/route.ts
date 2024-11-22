import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getPerplexityResponse } from '@/lib/perplexity';
import { APIError, handleAPIError } from '@/lib/error';

// Model-specific max tokens
const MODEL_MAX_TOKENS = {
  "mistral-7b-instruct": 4096,
  "mixtral-8x7b-instruct": 4096,
  "sonar-small-chat": 2048,
  "sonar-small-online": 2048,
} as const;

export async function POST(
  req: Request,
  { params }: { params: { botId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const { message, settings } = await req.json();

    if (!message || typeof message !== 'string') {
      throw new APIError('Invalid message', 400);
    }

    // Get max tokens for the model
    const modelMaxTokens = MODEL_MAX_TOKENS[settings?.model as keyof typeof MODEL_MAX_TOKENS] || 2048;

    // Calculate safe max tokens (reserve tokens for system prompt)
    const safeMaxTokens = Math.min(
      settings?.maxTokens || modelMaxTokens - 500,
      modelMaxTokens - 500
    );

    const messages = [
      ...(settings?.systemPrompt ? [{ role: "system" as const, content: settings.systemPrompt }] : []),
      { role: "user" as const, content: message },
    ];

    const response = await getPerplexityResponse(
      messages,
      settings?.model || "mistral-7b-instruct",
      settings?.temperature || 0.7,
      safeMaxTokens
    );

    return NextResponse.json({
      response,
      model: settings?.model || "mistral-7b-instruct",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleAPIError(error);
  }
}