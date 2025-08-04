import { z } from 'zod';

export const aiProviderSchema = z.enum(['grok', 'gemini']);
export type AIProvider = z.infer<typeof aiProviderSchema>;

export const aiMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

export type AIMessage = z.infer<typeof aiMessageSchema>;

export const aiChatRequestSchema = z.object({
  messages: z.array(aiMessageSchema),
  provider: aiProviderSchema.optional().default('grok'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().int().positive().optional(),
});

export type AIChatRequest = z.infer<typeof aiChatRequestSchema>;

export const aiProviderInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  available: z.boolean(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type AIProviderInfo = z.infer<typeof aiProviderInfoSchema>;

// Add any other shared types and schemas here
