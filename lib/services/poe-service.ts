const API_BASE_URL = process.env.NEXT_PUBLIC_POE_SERVER_URL || 'http://localhost:3001';

export interface PoeBot {
  name: string;
  description: string;
  isCustom: boolean;
}

export interface ChatResponse {
  text: string;
  messageId: string;
}

class PoeService {
  private static instance: PoeService;

  private constructor() {}

  static getInstance(): PoeService {
    if (!PoeService.instance) {
      PoeService.instance = new PoeService();
    }
    return PoeService.instance;
  }

  private async fetchWithError(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  async getBots(): Promise<PoeBot[]> {
    const { bots } = await this.fetchWithError('/api/bots');
    return bots;
  }

  async createBot(name: string, prompt: string): Promise<PoeBot> {
    const { bot } = await this.fetchWithError('/api/create-bot', {
      method: 'POST',
      body: JSON.stringify({ name, prompt }),
    });
    return bot;
  }

  async deleteBot(botName: string): Promise<void> {
    await this.fetchWithError(`/api/delete-bot/${encodeURIComponent(botName)}`, {
      method: 'DELETE',
    });
  }

  async sendMessage(botName: string, message: string): Promise<ChatResponse> {
    const { response } = await this.fetchWithError('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ botName, message }),
    });
    return response;
  }
}

export const poeService = PoeService.getInstance();
