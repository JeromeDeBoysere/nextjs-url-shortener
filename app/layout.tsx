import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/footer/Footer';

const roboto = Roboto({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
});

export const metadata: Metadata = {
	title: 'URL Shortener',
	description: "Application de raccourcissement d'URLs construite avec Next.js 15, Prisma et Supabase.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body className={`${roboto.variable} antialiased min-h-screen flex flex-col bg-gray-100 py-12 px-4`}>
				<div className="flex-1">{children}</div>
				<Footer />
			</body>
		</html>
	);
}
