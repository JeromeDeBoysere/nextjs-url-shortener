import { ShortenForm } from '@/components/shorten-form';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<main>
			<div className="max-w-2xl mx-auto">
				{/* Hero section - Apple style */}
				<div className="text-center mb-16">
					<h1 className="text-6xl font-semibold tracking-tight text-white mb-6">
						Raccourcir.
						<br />
						<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
							Simplifier.
						</span>
					</h1>
					<p className="text-xl text-slate-400 font-light">
						Transformez n&apos;importe quelle URL en un lien court.
					</p>
				</div>

				{/* Form card */}
				<Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md border border-white/20">
					<CardHeader className="text-center pb-2">
						<CardTitle className="text-xl font-medium text-white">Nouveau lien</CardTitle>
						<CardDescription className="text-slate-400">
							Collez votre URL et obtenez un lien optimisé
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ShortenForm />
					</CardContent>
				</Card>

				{/* Stats link */}
				<div className="pt-8 text-center">
					<Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
						<Link href="/stats">Voir les statistiques →</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
