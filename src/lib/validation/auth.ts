import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/i, 'Password must include a letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a symbol');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional().default(false),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    userType: z.enum(['shipper', 'carrier'], {
      errorMap: () => ({ message: 'Select a user type' }),
    }),
    fullName: z.string().max(120, 'Full name too long').optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    company: z.string().max(160, 'Company name too long').optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;


