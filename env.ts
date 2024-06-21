import z from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  DISCORD_TOKEN: z.string().min(1),
  SPOTIFY_CLIENT: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REDIRECT_URI: z.string().min(1),
  DISCORTIFY_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
