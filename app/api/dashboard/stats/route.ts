import { NextResponse } from "next/server";
import { withRateLimit } from "../../middleware";

async function handler() {
  try {
    // In a real application, these would come from your database
    const mockStats = {
      totalUsers: 1234,
      activeChats: 56,
      totalMessages: 78901,
      modelUsage: {
        "GPT-4": 456,
        "GPT-3.5": 789,
        "Claude-2": 123,
      },
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler);
