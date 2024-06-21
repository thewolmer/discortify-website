import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import db from '@/lib/db';

export const revalidate = 0;

export async function POST(req: NextRequest) {
  const headers = new Headers(req.headers);
  const api_key = headers.get('X-API-KEY');
  if (api_key !== env.DISCORTIFY_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, refresh_token } = body;
    if (!refresh_token || !id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token,
        }).toString(),
      });

      const data = await response.json();

      if (response.status === 200) {
        const updatedUser = await db.user.update({
          where: { id },
          data: {
            spotify_access_token: data.access_token,
            spotify_refresh_token: data.refresh_token,
            spotify_token_expires: new Date(Date.now() + data.expires_in * 1000),
          },
        });
        return NextResponse.json({ updatedUser }, { status: 200 });
      } else {
        console.error('Spotify token refresh failed', data);
        throw new Error('Failed to refresh spotify access token');
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'Failed to refresh spotify access token' }, { status: 400 });
    }
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
