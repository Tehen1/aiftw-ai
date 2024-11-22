import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityChart } from '@/components/dashboard/analytics/activity-chart';
import { ChatbotPerformance } from '@/components/dashboard/analytics/chatbot-performance';

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Messages',
      value: '24.5K',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Users',
      value: '1.2K',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Response Rate',
      value: '95%',
      change: '-2%',
      changeType: 'negative',
    },
    {
      title: 'Avg. Response Time',
      value: '1.5s',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Message Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Chatbot Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatbotPerformance />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
