import { NextRequest, NextResponse } from 'next/server';

import { DiscordLookup } from '@/lib/DiscordLookup';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  const data = await DiscordLookup(id);
  return NextResponse.json(data);
}
