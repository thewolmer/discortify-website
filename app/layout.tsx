import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
	title: 'Discortify',
	description: 'Discord + Spotify, a discord bot that knows your music taste inside out!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="min-h-screen">{children}</body>
		</html>
	);
}
