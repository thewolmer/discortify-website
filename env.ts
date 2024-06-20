import z from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
