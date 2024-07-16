import { type NextRequest, NextResponse } from 'next/server';
import qs from 'query-string';

import { DiscordLookup } from '@/lib/DiscordLookup';
import { getUserProfile } from '@/lib/Spotify/userProfile';
import db from '@/lib/db';

import { env } from '@/env';

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get('code') || null;
	const state = req.nextUrl.searchParams.get('state') || null;
	if (!code || !state) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	const redirectUri = env.SPOTIFY_REDIRECT_URI;
	const clientId = env.SPOTIFY_CLIENT;
	const clientSecret = env.SPOTIFY_CLIENT_SECRET;
	try {
		const tokenResponse = await fetch(
			qs.stringifyUrl({
				url: 'https://accounts.spotify.com/api/token',
				query: {
					grant_type: 'authorization_code',
					code,
					redirect_uri: redirectUri,
					client_id: clientId,
					client_secret: clientSecret,
				},
			}),
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
				},
			},
		);
		const tokenData = await tokenResponse.json();
		const [discordUser, spotifyUser] = await Promise.all([
			DiscordLookup(state),
			getUserProfile(tokenData.access_token),
		]);
		if (!spotifyUser?.display_name) {
			throw new Error('Failed to fetch spotify user data');
		}
		if (!discordUser?.username) {
			throw new Error('Failed to fetch discord user data');
		}
		const user = await db.user.upsert({
			where: {
				id: state,
			},
			update: {
				email: spotifyUser.email,
				discord_global_name: discordUser.global_name,
				discord_username: discordUser.username,
				discord_avatar: discordUser.avatar.link ? discordUser.avatar.link : undefined,
				discord_created_at: discordUser.created_at,
				spotify_id: spotifyUser.id,
				spotify_global_name: spotifyUser.display_name,
				spotify_username: spotifyUser.display_name,
				spotify_avatar: spotifyUser.images?.[1]?.url ? spotifyUser.images[0]?.url : undefined,
				spotify_profile_url: spotifyUser.external_urls.spotify,
				spotify_followers: spotifyUser.followers.total.toString(),
				spotify_access_token: tokenData.access_token,
				spotify_refresh_token: tokenData.refresh_token,
				spotify_token_expires: new Date(Date.now() + tokenData.expires_in * 1000),
			},
			create: {
				id: state,
				email: spotifyUser.email,
				discord_global_name: discordUser.global_name,
				discord_username: discordUser.username,
				discord_avatar: discordUser.avatar.link ? discordUser.avatar.link : undefined,
				discord_created_at: discordUser.created_at,
				spotify_id: spotifyUser.id,
				spotify_global_name: spotifyUser.display_name,
				spotify_username: spotifyUser.display_name,
				spotify_avatar: spotifyUser.images?.[1]?.url ? spotifyUser.images[0]?.url : undefined,
				spotify_profile_url: spotifyUser.external_urls.spotify,
				spotify_followers: spotifyUser.followers.total.toString(),
				spotify_access_token: tokenData.access_token,
				spotify_refresh_token: tokenData.refresh_token,
				spotify_token_expires: new Date(Date.now() + tokenData.expires_in * 1000),
			},
		});
		return NextResponse.json(user);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: 'Server Error' }, { status: 500 });
	}
}
