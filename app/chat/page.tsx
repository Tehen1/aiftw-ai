'use client';

import { EnhancedChat } from "@/components/chat/enhanced-chat";

export default function ChatPage() {
  return (
    <div className="container mx-auto h-[calc(100vh-4rem)]">
      <EnhancedChat />
    </div>
  );
}
