import { beforeEach, describe, expect, it } from '@jest/globals';
import { useChatbotStore } from '@/lib/store/chatbot-store';

describe('Chatbot Store', () => {
  beforeEach(() => {
    useChatbotStore.setState({
      chatbots: [],
      selectedChatbot: null,
      isLoading: false,
      error: null,
    });
  });

  it('should add a chatbot', () => {
    const chatbot = {
      name: 'Test Bot',
      description: 'A test chatbot',
      model: 'gpt-3.5-turbo' as const,
    };

    useChatbotStore.getState().addChatbot(chatbot);
    const state = useChatbotStore.getState();

    expect(state.chatbots).toHaveLength(1);
    expect(state.chatbots[0]).toMatchObject(chatbot);
    expect(state.chatbots[0].id).toBeDefined();
  });

  it('should update a chatbot', () => {
    const chatbot = {
      name: 'Test Bot',
      description: 'A test chatbot',
      model: 'gpt-3.5-turbo' as const,
    };

    useChatbotStore.getState().addChatbot(chatbot);
    const id = useChatbotStore.getState().chatbots[0].id;

    useChatbotStore.getState().updateChatbot(id, {
      name: 'Updated Bot',
    });

    const state = useChatbotStore.getState();
    expect(state.chatbots[0].name).toBe('Updated Bot');
  });

  it('should delete a chatbot', () => {
    const chatbot = {
      name: 'Test Bot',
      description: 'A test chatbot',
      model: 'gpt-3.5-turbo' as const,
    };

    useChatbotStore.getState().addChatbot(chatbot);
    const id = useChatbotStore.getState().chatbots[0].id;

    useChatbotStore.getState().deleteChatbot(id);

    const state = useChatbotStore.getState();
    expect(state.chatbots).toHaveLength(0);
  });

  it('should select a chatbot', () => {
    const chatbot = {
      name: 'Test Bot',
      description: 'A test chatbot',
      model: 'gpt-3.5-turbo' as const,
    };

    useChatbotStore.getState().addChatbot(chatbot);
    const id = useChatbotStore.getState().chatbots[0].id;

    useChatbotStore.getState().selectChatbot(id);

    const state = useChatbotStore.getState();
    expect(state.selectedChatbot).toMatchObject(chatbot);
  });
});
