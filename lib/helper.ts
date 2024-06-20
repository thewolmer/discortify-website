import { env } from '@/env';

const headers = { 'Content-Type': 'application/json' };

const baseUrl = env.NEXT_PUBLIC_APP_URL;
interface Props {
  tags?: string[];
  revalidate?: number;
  searchParams?: Record<string, string | number | undefined>;
}
export const Get = async (uri: string, { tags, revalidate = 3600, searchParams }: Props) => {
  const url = new URL(`${baseUrl}${uri}`);
  if (searchParams) {
    for (const param of Object.keys(searchParams)) {
      const value = searchParams[param];
      if (value) {
        url.searchParams.append(param, value.toString());
      }
    }
  }
  return await fetch(url.toString(), {
    headers,
    next: { revalidate, tags },
  });
};
