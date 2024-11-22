import { getServerSession } from 'next-auth/next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  MessageSquare,
  Users,
  Activity,
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession();

  const stats = [
    {
      title: 'Total Chatbots',
      value: '12',
      icon: MessageSquare,
    },
    {
      title: 'Active Users',
      value: '342',
      icon: Users,
    },
    {
      title: 'Messages Today',
      value: '1,234',
      icon: Activity,
    },
    {
      title: 'Response Rate',
      value: '98%',
      icon: BarChart,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity chart will be implemented here
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Chatbots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Top performing chatbots will be listed here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
