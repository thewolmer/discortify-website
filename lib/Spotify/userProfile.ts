import { SpotifyUser } from '@/types/Spotify/User';

export const getUserProfile = async (token: string): Promise<SpotifyUser> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
