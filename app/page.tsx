'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to AIFTW</h1>
        <p className="text-xl text-muted-foreground">Your AI-powered chat platform</p>
        <div className="flex gap-4 justify-center">
          <Link href="/chat" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
            Start Chatting
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
