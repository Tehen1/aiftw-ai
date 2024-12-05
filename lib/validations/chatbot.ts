import * as z from 'zod';
import { ValidationError } from '../error';

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

export const ChatMessageSchema = z.object({
  botName: z.string().min(1, 'Bot name is required'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
});

export const BotConfigSchema = z.object({
  name: z.string().min(1, 'Bot name is required').max(50, 'Bot name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  prompt: z.string().min(1, 'Prompt is required').max(5000, 'Prompt is too long'),
  settings: z.object({
    enable_multi_bot_chat_prompting: z.boolean().default(true),
    enforce_author_role_alternation: z.boolean().default(false),
    allow_attachments: z.boolean().default(true),
    expand_text_attachments: z.boolean().default(true),
    enable_image_comprehension: z.boolean().default(true)
  }).default({
    enable_multi_bot_chat_prompting: true,
    enforce_author_role_alternation: false,
    allow_attachments: true,
    expand_text_attachments: true,
    enable_image_comprehension: true
  })
});

export type ChatbotFormData = z.infer<typeof chatbotSchema>;
export type ChatbotUpdateFormData = z.infer<typeof chatbotUpdateSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type BotConfig = z.infer<typeof BotConfigSchema>;

export function validateChatMessage(data: unknown): ChatMessage {
  try {
    return ChatMessageSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid chat message', {
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    throw error;
  }
}

export function validateBotConfig(data: unknown): BotConfig {
  try {
    return BotConfigSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid bot configuration', {
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    throw error;
  }
}
