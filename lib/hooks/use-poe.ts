import { useCallback, useState } from 'react';
import { useChatbotStore } from '@/lib/store/chatbot-store';
import { poeService } from '@/lib/services/poe-service';
import { useToast } from '@/hooks/use-toast';

export function usePoe() {
  const [isLoading, setIsLoading] = useState(false);
  const { addChatbot, deleteChatbot } = useChatbotStore();
  const { toast } = useToast();

  const createBot = useCallback(async (name: string, description: string, prompt: string) => {
    setIsLoading(true);
    try {
      const bot = await poeService.createBot(name, prompt);
      addChatbot({
        name: bot.name,
        description,
        model: 'custom',
        messages: 0,
        responseRate: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'Success',
        description: 'Bot created successfully',
      });
      return bot;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create bot',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addChatbot]);

  const removeBot = useCallback(async (botName: string) => {
    setIsLoading(true);
    try {
      await poeService.deleteBot(botName);
      deleteChatbot(botName);
      toast({
        title: 'Success',
        description: 'Bot deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete bot',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [deleteChatbot]);

  const sendMessage = useCallback(async (botName: string, message: string) => {
    setIsLoading(true);
    try {
      const response = await poeService.sendMessage(botName, message);
      return response;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBots = useCallback(async () => {
    setIsLoading(true);
    try {
      const bots = await poeService.getBots();
      return bots;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch bots',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createBot,
    removeBot,
    sendMessage,
    getBots,
  };
}
