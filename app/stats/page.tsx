import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { Link as LinkType } from '@prisma/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Force dynamic rendering - prevents Next.js from statically generating this page at build time
export const dynamic = 'force-dynamic';

export default async function Page() {
	// Opt out of data caching - ensures Prisma queries always fetch fresh data from the database
	noStore();

	const links = await prisma.link.findMany({
		orderBy: { createdAt: 'desc' },
	});

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	return (
		<main>
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-semibold tracking-tight text-white mb-4">Statistiques</h1>
					<p className="text-lg text-slate-400 font-light">Suivez les performances de tous les liens</p>
				</div>

				{/* Table card */}
				<Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md border border-white/20 mb-8">
					<CardContent className="pt-6">
						{links.length > 0 ? (
							<Table>
								<TableCaption className="text-slate-500">
									{links.length} lien{links.length > 1 ? 's' : ''}
								</TableCaption>
								<TableHeader>
									<TableRow className="border-white/10 hover:bg-transparent">
										<TableHead className="text-slate-300">Lien court</TableHead>
										<TableHead className="text-slate-300">Destination</TableHead>
										<TableHead className="text-slate-300">Créé le</TableHead>
										<TableHead className="text-right text-slate-300">Clics</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{links.map((link: LinkType) => {
										const date = new Intl.DateTimeFormat('fr-FR', {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										}).format(link.createdAt);

										return (
											<TableRow key={link.id} className="border-white/10 hover:bg-white/5">
												<TableCell className="max-w-xs">
													<Tooltip>
														<TooltipTrigger asChild>
															<a
																href={`${baseUrl}${link.shortCode}`}
																className="block truncate text-blue-400 hover:text-blue-300 transition-colors"
																target="_blank"
															>
																{link.shortCode}
															</a>
														</TooltipTrigger>
														<TooltipContent>
															<span className="max-w-sm break-all">{`${baseUrl}${link.shortCode}`}</span>
														</TooltipContent>
													</Tooltip>
												</TableCell>
												<TableCell className="max-w-xs">
													<Tooltip>
														<TooltipTrigger asChild>
															<a
																href={link.originalUrl}
																className="block truncate text-slate-300 hover:text-white transition-colors"
																target="_blank"
															>
																{link.originalUrl}
															</a>
														</TooltipTrigger>
														<TooltipContent>
															<span className="max-w-sm break-all">
																{link.originalUrl}
															</span>
														</TooltipContent>
													</Tooltip>
												</TableCell>
												<TableCell className="text-slate-400">{date}</TableCell>
												<TableCell className="text-right">
													<span className="text-white font-medium">{link.clicks}</span>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						) : (
							<p className="text-center text-slate-400 py-12">Aucun lien créé pour le moment.</p>
						)}
					</CardContent>
				</Card>

				{/* Back button */}
				<div className="text-center">
					<Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
						<Link href="/">← Retour à l'accueil</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
