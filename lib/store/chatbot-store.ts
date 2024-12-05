import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PoeError } from '../error';
import { logger } from '../logger';
import { poeService } from '../services/poe-service';
import type { ChatMessage, BotConfig } from '../validations/chatbot';

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  messages: number;
  responseRate: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ChatbotState {
  chatbots: Chatbot[];
  selectedChatbot: Chatbot | null;
  isLoading: boolean;
  error: string | null;
  addChatbot: (chatbot: Omit<Chatbot, 'id'>) => void;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => void;
  deleteChatbot: (id: string) => void;
  selectChatbot: (id: string) => void;
  setError: (error: string | null) => void;
  messages: ChatMessage[];
  selectedBot: string | null;
  bots: BotConfig[];
  sendMessage: (message: string) => Promise<void>;
  setSelectedBot: (botName: string) => void;
  clearMessages: () => void;
  clearError: () => void;
  loadBots: () => Promise<void>;
}

const initialState: ChatbotState = {
  chatbots: [],
  selectedChatbot: null,
  isLoading: false,
  error: null,
  messages: [],
  selectedBot: null,
  bots: [],
  addChatbot: () => {},
  updateChatbot: () => {},
  deleteChatbot: () => {},
  selectChatbot: () => {},
  setError: () => {},
  sendMessage: async () => {},
  setSelectedBot: () => {},
  clearMessages: () => {},
  clearError: () => {},
  loadBots: async () => {},
};

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addChatbot: (chatbot) => {
        const newChatbot = {
          ...chatbot,
          id: crypto.randomUUID(),
          messages: 0,
          responseRate: 0,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          chatbots: [...state.chatbots, newChatbot],
        }));
      },

      updateChatbot: (id, updates) => {
        set((state) => ({
          chatbots: state.chatbots.map((chatbot) =>
            chatbot.id === id
              ? { ...chatbot, ...updates, updatedAt: new Date().toISOString() }
              : chatbot
          ),
        }));
      },

      deleteChatbot: (id) => {
        set((state) => ({
          chatbots: state.chatbots.filter((chatbot) => chatbot.id !== id),
          selectedChatbot:
            state.selectedChatbot?.id === id ? null : state.selectedChatbot,
        }));
      },

      selectChatbot: (id) => {
        const chatbot = get().chatbots.find((c) => c.id === id) || null;
        set({ selectedChatbot: chatbot });
      },

      setError: (error) => {
        set({ error });
      },

      sendMessage: async (message: string) => {
        const { selectedBot } = get();
        if (!selectedBot) {
          set({ error: 'No bot selected' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await poeService.sendMessage(selectedBot, message);
          set((state) => ({
            messages: [...state.messages, { botName: selectedBot, message }],
          }));
          logger.info('Message sent successfully', { botName: selectedBot });
        } catch (error) {
          const errorMessage = error instanceof PoeError ? error.message : 'Failed to send message';
          set({ error: errorMessage });
          logger.error('Failed to send message', { error, botName: selectedBot });
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedBot: (botName: string) => {
        set({ selectedBot: botName });
        logger.info('Bot selected', { botName });
      },

      clearMessages: () => {
        set({ messages: [] });
        logger.info('Messages cleared');
      },

      clearError: () => {
        set({ error: null });
      },

      loadBots: async () => {
        set({ isLoading: true, error: null });

        try {
          const bots = await poeService.getBots();
          set({ bots });
          logger.info('Bots loaded successfully', { count: bots.length });
        } catch (error) {
          const errorMessage = error instanceof PoeError ? error.message : 'Failed to load bots';
          set({ error: errorMessage });
          logger.error('Failed to load bots', { error });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'chatbot-store',
    }
  )
);
