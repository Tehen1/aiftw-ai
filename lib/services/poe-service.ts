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
  private readonly apiBaseUrl: string;

  private constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_POE_SERVER_URL || 'http://localhost:3001';
  }

  static getInstance(): PoeService {
    if (!PoeService.instance) {
      PoeService.instance = new PoeService();
    }
    return PoeService.instance;
  }

  private async fetchWithError(url: string, options: RequestInit = {}) {
    const response = await fetch(`${this.apiBaseUrl}${url}`, {
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
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/bots`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bots:', error);
      throw error;
    }
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
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botName, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export const poeService = PoeService.getInstance();
