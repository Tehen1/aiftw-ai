"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  MessageSquare,
  Brain,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingProvider } from "@/components/loading/loading-provider";

interface StatsData {
  totalUsers: number;
  activeChats: number;
  totalMessages: number;
  modelUsage: {
    [key: string]: number;
  };
}

async function fetchStats(): Promise<StatsData> {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function StatsCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error loading stats</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <LoadingProvider loading={isLoading}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activeChats || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ongoing conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalMessages?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Messages processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.modelUsage ? (
                Object.entries(data.modelUsage).map(([model, count]) => (
                  <div
                    key={model}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{model}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </LoadingProvider>
  );
}
