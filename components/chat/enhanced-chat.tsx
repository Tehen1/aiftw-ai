'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Bot,
  Send,
  Download,
  Search,
  History,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSkeleton } from "@/components/loading/loading-provider";
import { SettingsDialog } from "./settings-dialog";
import { PERPLEXITY_MODELS } from "@/lib/perplexity";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export function EnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { data: settings, isLoading: settingsLoading } = useQuery<ChatSettings>({
    queryKey: ["chatSettings"],
    queryFn: async () => {
      const res = await fetch("/api/chat/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const { data: chatHistory, isLoading: historyLoading } = useQuery<ChatHistory[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const res = await fetch("/api/chat/history");
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return res.json();
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!settings) throw new Error("Settings not loaded");
      
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          systemPrompt: settings.systemPrompt,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: input,
        model: settings?.model || "unknown",
        timestamp: new Date().toISOString(),
      }, data]);
      setInput("");
    },
  });

  const exportChat = () => {
    const exportData = messages.map((m) => ({
      role: m.role,
      content: m.content,
      model: m.model,
      timestamp: m.timestamp,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (settingsLoading) return <ChatSkeleton />;

  return (
    <div className="flex h-full">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">AI Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <SettingsDialog />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <History className="h-5 w-5" />
                  <span className="sr-only">History</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full py-4">
                  {historyLoading ? (
                    <ChatSkeleton />
                  ) : (
                    <div className="space-y-4">
                      {chatHistory?.map((chat) => (
                        <div
                          key={chat.id}
                          className="flex cursor-pointer items-start space-x-4 rounded-lg p-3 hover:bg-accent"
                          onClick={() => {
                            // Load chat history
                          }}
                        >
                          <Bot className="h-5 w-5" />
                          <div className="space-y-1">
                            <p className="font-medium">{chat.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {chat.lastMessage}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(chat.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={exportChat}
              disabled={messages.length === 0}
            >
              <Download className="h-5 w-5" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <Bot className="h-8 w-8 mt-2" />
                )}
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-accent"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{PERPLEXITY_MODELS.find(m => m.id === message.model)?.name || message.model}</span>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage.mutate(input);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              disabled={sendMessage.isPending || !input.trim()}
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
