/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import React from 'react';
import { HiCheckBadge } from 'react-icons/hi2';
import { LuDot } from 'react-icons/lu';
import { SiSpotify } from 'react-icons/si';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  discord_global_name: z.string(),
  discord_username: z.string(),
  discord_avatar: z.string(),
  discord_created_at: z.string(),
  spotify_global_name: z.string(),
  spotify_username: z.string(),
  spotify_avatar: z.string(),
  spotify_profile_url: z.string(),
  spotify_followers: z.string(),
});

export async function GET(req: NextRequest) {
  const body = await req.json();
  const rawUser = body.user;

  const parsedUser = userSchema.safeParse(rawUser);

  if (!parsedUser.success) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: 'black',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          🚫 No user found.
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  const user = parsedUser.data;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'white',
          background:
            'url("https://cdn.discordapp.com/attachments/937015107618209833/1256265016177463336/girlie2.jpg?ex=66802378&is=667ed1f8&hm=45e0fdd1ad13680a3a5ec93ed302293e9e0b2542c96a23c70736f3434c7dd8ed&")',
          backdropFilter: 'blur(10px), opacity(0.8)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
          tw="relative"
        >
          <img
            src={user.discord_avatar as string}
            alt="User avatar"
            width={200}
            height={200}
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: '5px solid white',
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: 8,
              right: 6,
            }}
          >
            <HiCheckBadge style={{ color: 'green' }} />
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            color: 'black',
          }}
        >
          <SiSpotify fill="black" size={40} />
          {user.spotify_global_name}
        </div>
        <div
          style={{
            fontSize: 15,
            marginTop: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 15,
            color: 'black',
          }}
        >
          @{user.discord_username}
          <LuDot />
          {user.spotify_followers} followers
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
