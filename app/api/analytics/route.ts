import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Mock analytics data - replace with real database queries
    const analyticsData = {
      overview: {
        totalMessages: 1234,
        activeUsers: 567,
        averageResponseTime: '1.2s',
        successRate: '98.5%'
      },
      messagesByDay: [
        { date: '2024-03-01', count: 150 },
        { date: '2024-03-02', count: 165 },
        { date: '2024-03-03', count: 145 },
        { date: '2024-03-04', count: 180 },
        { date: '2024-03-05', count: 200 },
        { date: '2024-03-06', count: 190 },
        { date: '2024-03-07', count: 210 }
      ],
      userEngagement: {
        dailyActiveUsers: 234,
        weeklyActiveUsers: 789,
        monthlyActiveUsers: 1234,
        averageSessionDuration: '8m 45s'
      },
      botPerformance: {
        averageResponseTime: 1.2,
        successfulResponses: 9850,
        failedResponses: 150,
        totalTokensUsed: 1234567
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}