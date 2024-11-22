import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPerplexityResponse } from '@/lib/perplexity';

// Model-specific max tokens
const MODEL_MAX_TOKENS = {
  "mistral-7b-instruct": 4096,
  "mixtral-8x7b-instruct": 4096,
  "sonar-small-chat": 2048,
  "sonar-small-online": 2048,
} as const;

// Message validation schema
const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  model: z.string(),
  systemPrompt: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().int().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { content, model, systemPrompt, temperature, maxTokens } = messageSchema.parse(json);

    // Get max tokens for the model
    const modelMaxTokens = MODEL_MAX_TOKENS[model as keyof typeof MODEL_MAX_TOKENS] || 2048;

    // Calculate safe max tokens (reserve tokens for system prompt)
    const safeMaxTokens = Math.min(
      maxTokens || modelMaxTokens - 500,
      modelMaxTokens - 500
    );

    const messages = [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      { role: "user" as const, content },
    ];

    const response = await getPerplexityResponse(
      messages,
      model,
      temperature,
      safeMaxTokens
    );

    return NextResponse.json({
      id: Math.random().toString(36).substring(7),
      role: "assistant",
      content: response,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
