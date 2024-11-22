'use client';

import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ChatHook {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useChat(botId: string): ChatHook {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history
  const { data, error: fetchError } = useSWR(`/api/chat/${botId}/history`, fetcher);

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
    if (fetchError) {
      setError(new Error('Failed to load chat history'));
      toast.error('Failed to load chat history');
    }
  }, [data, fetchError]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
}