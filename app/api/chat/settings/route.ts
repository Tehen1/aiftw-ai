import { NextResponse } from "next/server";
import { z } from "zod";
import { withRateLimit } from "../../middleware";

// Settings validation schema
const settingsSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(4000).optional(),
  systemPrompt: z.string().max(1000).optional(),
});

// Model-specific max tokens
const MODEL_MAX_TOKENS = {
  "mistral-7b-instruct": 4096,
  "mixtral-8x7b-instruct": 4096,
  "sonar-small-chat": 2048,
  "sonar-small-online": 2048,
} as const;

// Mock settings storage
let mockSettings = {
  model: "mistral-7b-instruct",
  temperature: 0.7,
  maxTokens: MODEL_MAX_TOKENS["mistral-7b-instruct"] - 500, // Reserve tokens for system prompt
  systemPrompt: "You are a helpful AI assistant.",
};

async function getHandler() {
  try {
    return NextResponse.json({
      ...mockSettings,
      modelMaxTokens: MODEL_MAX_TOKENS[mockSettings.model as keyof typeof MODEL_MAX_TOKENS],
    });
  } catch (error) {
    console.error("Settings API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

async function putHandler(req: Request) {
  try {
    const json = await req.json();
    const validatedSettings = settingsSchema.parse(json);

    // Get max tokens for the selected model
    const modelMaxTokens = MODEL_MAX_TOKENS[validatedSettings.model as keyof typeof MODEL_MAX_TOKENS] || 2048;

    // Ensure maxTokens doesn't exceed model limit
    if (validatedSettings.maxTokens) {
      validatedSettings.maxTokens = Math.min(
        validatedSettings.maxTokens,
        modelMaxTokens - 500 // Reserve tokens for system prompt
      );
    }

    // Update mock settings
    mockSettings = {
      ...mockSettings,
      ...validatedSettings,
    };

    return NextResponse.json({
      ...mockSettings,
      modelMaxTokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid settings data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Settings API Error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(getHandler);
export const PUT = withRateLimit(putHandler);
