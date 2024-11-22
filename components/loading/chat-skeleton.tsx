import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Card className="h-full">
        <CardHeader className="border-b px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 p-6">
          {/* Chat Messages */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 ${
                  i % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {i % 2 === 0 && (
                  <Skeleton className="h-8 w-8 rounded-full" />
                )}
                <div
                  className={`space-y-2 ${
                    i % 2 === 0 ? 'items-start' : 'items-end'
                  }`}
                >
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-20 w-[300px]" />
                </div>
                {i % 2 !== 0 && (
                  <Skeleton className="h-8 w-8 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-auto flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
