interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export async function getPerplexityResponse(
  messages: PerplexityMessage[],
  model: string = "mistral-7b-instruct",
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API;
  if (!apiKey) {
    throw new Error("Perplexity API key is not configured");
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Perplexity API error: ${response.status} ${JSON.stringify(error)}`
      );
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Perplexity API error:", error);
    throw error;
  }
}

export const PERPLEXITY_MODELS = [
  { id: "mistral-7b-instruct", name: "Mistral-7B" },
  { id: "mixtral-8x7b-instruct", name: "Mixtral-8x7B" },
  { id: "sonar-small-chat", name: "Sonar Small" },
  { id: "sonar-small-online", name: "Sonar Small Online" },
] as const;
