export interface SpotifyUser {
	display_name: string;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images?: ImagesEntity[] | null;
	type: string;
	uri: string;
	followers: Followers;
	email: string;
}
interface ExternalUrls {
	spotify: string;
}
interface ImagesEntity {
	url: string;
	height: number;
	width: number;
}
interface Followers {
	href?: null;
	total: number;
}
