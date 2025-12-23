import {prisma} from "@/lib/prisma";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";

export default async function Page() {

	const links = await prisma.link.findMany({
		orderBy: {clicks: "desc"},
	});

	const host = typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:3000/';

	return <main className="min-h-screen bg-gray-100 py-12 px-4">
		<div className="max-w-6xl mx-auto">
			<div className="text-center mb-12">
				<h1 className="text-5xl font-bold text-gray-900 mb-4">
					Projet 1 : URL Shortener
				</h1>
				<p className="text-gray-600 text-lg">
					Statistiques de chaque lien raccourci.
				</p>
			</div>


			<Card className="mb-6">
				<CardContent>
					{links.length > 0 ? (
						<Table>
							<TableCaption>{links.length} résultats.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Lien raccourci</TableHead>
									<TableHead>Destination</TableHead>
									<TableHead>Date de création</TableHead>
									<TableHead className="text-right">Clicks</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{links.map((link) => {

									const date = new Intl.DateTimeFormat('fr-FR', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}).format(link.createdAt);

									return (
										<TableRow key={link.id}>
											<TableCell className="max-w-xs">
												<Tooltip>
													<TooltipTrigger asChild>
														<a
															href={`${host}${link.shortCode}`}
															className="block truncate text-blue-600 hover:underline"
															target="blank"
														>
															{`${host}${link.shortCode}`}
														</a>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-sm break-all">{`${host}${link.shortCode}`}</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>
											<TableCell className="max-w-xs">
												<Tooltip>
													<TooltipTrigger asChild>
														<a
															href={link.originalUrl}
															className="block truncate text-blue-600 hover:underline"
															target="blank"
														>
															{link.originalUrl}
														</a>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-sm break-all">{link.originalUrl}</p>
													</TooltipContent>
												</Tooltip>
											</TableCell>
											<TableCell>{date}</TableCell>
											<TableCell className="text-right">{link.clicks}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					) : (
						<p className="text-center text-gray-500 py-8">
							Aucun résultat.
						</p>
					)}
				</CardContent>
			</Card>

			<div className="pt-4 text-center">
				<Button asChild
						variant="outline">
					<Link href="/">Retour à l'accueil</Link>
				</Button>
			</div>

		</div>
	</main>

}
