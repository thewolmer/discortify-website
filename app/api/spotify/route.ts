import { NextRequest, NextResponse } from 'next/server';
import qs from 'query-string';

import { env } from '@/env';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get('id');
  if (!state) return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  const scope = 'user-read-email user-top-read playlist-read-private';
  const redirectUri = env.SPOTIFY_REDIRECT_URI;
  const clientId = env.SPOTIFY_CLIENT;

  const spotifyAuthUrl = qs.stringifyUrl({
    url: 'https://accounts.spotify.com/authorize',
    query: {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
    },
  });

  return NextResponse.redirect(spotifyAuthUrl);
}
