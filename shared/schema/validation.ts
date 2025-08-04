import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export const messageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  conversationId: z.string().uuid(),
});

export const conversationSchema = z.object({
  title: z.string().min(1).max(100),
  userId: z.string().uuid(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = userSchema.extend({
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserInput = z.infer<typeof userSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ConversationInput = z.infer<typeof conversationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
