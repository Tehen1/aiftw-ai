'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/loading';
import { Send, RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ChatPage() {
  const { botId } = useParams();
  const { messages, isLoading, error, sendMessage, resetChat } = useChat(botId as string);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim() || isLoading) return;

    await sendMessage(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <ErrorBoundary>
      <div className="container max-w-4xl h-[calc(100vh-4rem)] py-4">
        <Card className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetChat}
              title="Reset chat"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <time className="text-xs opacity-50 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
                    {error.message}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ErrorBoundary>
  );
}