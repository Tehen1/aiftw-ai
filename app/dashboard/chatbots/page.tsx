import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, MessageSquare, Settings, Trash2 } from 'lucide-react';

const chatbots = [
  {
    id: 1,
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    messages: '1,234',
    responseRate: '98%',
  },
  {
    id: 2,
    name: 'Sales Assistant',
    description: 'Helps with product recommendations and sales',
    messages: '856',
    responseRate: '95%',
  },
  {
    id: 3,
    name: 'Technical Support',
    description: 'Provides technical assistance and troubleshooting',
    messages: '567',
    responseRate: '92%',
  },
];

export default function ChatbotsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Chatbots</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Chatbot
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chatbots.map((chatbot) => (
          <Card key={chatbot.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{chatbot.name}</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{chatbot.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Messages
                  </p>
                  <p className="text-2xl font-bold">{chatbot.messages}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold">{chatbot.responseRate}</p>
                </div>
              </div>
              <Button className="mt-6 w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Conversations
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
