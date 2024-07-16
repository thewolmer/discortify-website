import { env } from '@/env';

import { USER_FLAGS } from './flags';

export const DiscordLookup = async (id: string) => {
	try {
		const response = await fetch(`https://canary.discord.com/api/v10/users/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bot ${env.DISCORD_TOKEN}`,
			},
		});

		const json = await response.json();
		if (json.message) return json;

		const publicFlags: string[] = [];

		const premiumTypes: Record<number, string> = {
			0: 'None',
			1: 'Nitro Classic',
			2: 'Nitro',
			3: 'Nitro Basic',
		};

		for (const flag of USER_FLAGS) {
			if (json.public_flags & flag.bitwise) publicFlags.push(flag.flag);
		}

		const avatarLink = json.avatar ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}` : null;
		const bannerLink = json.banner ? `https://cdn.discordapp.com/banners/${json.id}/${json.banner}?size=480` : null;

		const output = {
			id: json.id,
			created_at: snowflakeToDate(json.id),
			username: json.username,
			avatar: {
				id: json.avatar,
				link: avatarLink,
				is_animated: json.avatar?.startsWith('a_'),
			},
			avatar_decoration: json.avatar_decoration_data,
			badges: publicFlags,
			premium_type: premiumTypes[json.premium_type],
			accent_color: json.accent_color,
			global_name: json.global_name,
			banner: {
				id: json.banner,
				link: bannerLink,
				is_animated: json.banner?.startsWith('a_'),
				color: json.banner_color,
			},
			raw: json,
		};

		return output;
	} catch (err) {
		console.log(err);
		return { error: 'Failed to fetch data' };
	}
};

function snowflakeToDate(id: string) {
	let temp = Number.parseInt(id).toString(2);
	const length = 64 - temp.length;

	if (length > 0) for (let i = 0; i < length; i++) temp = `0${temp}`;

	temp = temp.substring(0, 42);
	const date = new Date(Number.parseInt(temp, 2) + 1420070400000);

	return date;
}
