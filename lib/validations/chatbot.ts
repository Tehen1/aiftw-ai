import * as z from 'zod';

export const chatbotSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'claude-2', 'claude-instant']),
});

export const chatbotUpdateSchema = chatbotSchema.partial();

export type ChatbotFormData = z.infer<typeof chatbotSchema>;
export type ChatbotUpdateFormData = z.infer<typeof chatbotUpdateSchema>;
