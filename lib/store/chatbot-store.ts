import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      chatbots: [],
      selectedChatbot: null,
      isLoading: false,
      error: null,

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
    }),
    {
      name: 'chatbot-store',
    }
  )
);
