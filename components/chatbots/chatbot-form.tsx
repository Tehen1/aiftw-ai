import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { chatbotSchema, ChatbotFormData } from '@/lib/validations/chatbot';
import { useChatbotStore } from '@/lib/store/chatbot-store';

interface ChatbotFormProps {
  onSuccess?: () => void;
}

export function ChatbotForm({ onSuccess }: ChatbotFormProps) {
  const addChatbot = useChatbotStore((state) => state.addChatbot);

  const form = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: {
      name: '',
      description: '',
      model: 'gpt-3.5-turbo',
    },
  });

  const onSubmit = (data: ChatbotFormData) => {
    addChatbot({
      ...data,
      messages: 0,
      responseRate: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Chatbot" {...field} />
              </FormControl>
              <FormDescription>
                Give your chatbot a unique and descriptive name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="This chatbot helps with..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what your chatbot does and how it can help users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-2">Claude 2</SelectItem>
                  <SelectItem value="claude-instant">Claude Instant</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the AI model that best suits your needs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Chatbot</Button>
      </form>
    </Form>
  );
}
