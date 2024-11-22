"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProviderProps {
  children: React.ReactNode;
  loading?: boolean;
}

export function LoadingProvider({ children, loading = false }: LoadingProviderProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted mb-4" />
      <div className="h-4 w-2/3 bg-muted mb-2" />
      <div className="h-3 w-full bg-muted" />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 bg-muted" />
          <div className="h-16 w-3/4 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
