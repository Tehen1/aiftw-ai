import { NextResponse } from "next/server";
import { withRateLimit } from "../../middleware";

async function handler() {
  try {
    // In a real application, this would come from your database
    const mockHistory = [
      {
        id: "1",
        title: "Project Discussion",
        lastMessage: "Let's analyze the requirements for the new feature.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Code Review",
        lastMessage: "The implementation looks good, but we should add more tests.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        title: "Bug Investigation",
        lastMessage: "I found the root cause of the performance issue.",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    return NextResponse.json(mockHistory);
  } catch (error) {
    console.error("Chat History API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler);
