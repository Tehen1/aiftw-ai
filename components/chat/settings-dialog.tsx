'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PERPLEXITY_MODELS } from "@/lib/perplexity";

interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  modelMaxTokens: number;
}

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<ChatSettings>({
    queryKey: ['chatSettings'],
    queryFn: async () => {
      const response = await fetch('/api/chat/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: ChatSettings) => {
      const response = await fetch('/api/chat/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSettings'] });
      setOpen(false);
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update settings: ' + error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    mutation.mutate({
      model: formData.get('model') as string,
      temperature: parseFloat(formData.get('temperature') as string),
      maxTokens: parseInt(formData.get('maxTokens') as string),
      systemPrompt: formData.get('systemPrompt') as string,
      modelMaxTokens: settings?.modelMaxTokens || 0,
    });
  };

  if (isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>
            Adjust your chat preferences. Changes will apply to new messages.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select name="model" defaultValue={settings?.model}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {PERPLEXITY_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature: {settings?.temperature.toFixed(1)}
            </Label>
            <Slider
              name="temperature"
              defaultValue={[settings?.temperature ?? 0.7]}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxTokens">
              Max Tokens (1-{settings?.modelMaxTokens || 4096})
            </Label>
            <Input
              name="maxTokens"
              type="number"
              defaultValue={settings?.maxTokens}
              min={1}
              max={settings?.modelMaxTokens || 4096}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens in the response. Higher values allow for longer responses but may take more time.
              {settings?.modelMaxTokens && ` This model supports up to ${settings.modelMaxTokens} tokens.`}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Input
              name="systemPrompt"
              defaultValue={settings?.systemPrompt}
              placeholder="Enter a system prompt"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
