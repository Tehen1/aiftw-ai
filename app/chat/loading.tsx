import { ChatSkeleton } from '@/components/loading/chat-skeleton';

export default function ChatLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ChatSkeleton />
    </div>
  );
}
