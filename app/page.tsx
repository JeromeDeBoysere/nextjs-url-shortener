import {ShortenForm} from '@/components/shorten-form'
import Link from 'next/link'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'

export default function Home() {
	return (
		<main className="min-h-screen bg-gray-100 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						Projet 1 : URL Shortener
					</h1>
					<p className="text-gray-600 text-lg">
						Transformez vos liens longs en URLs courtes
					</p>
				</div>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Créer un lien court</CardTitle>
						<CardDescription>
							Entrez une URL longue et obtenez un lien court instantanément
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ShortenForm/>
					</CardContent>
				</Card>
			</div>
			<div className="pt-4 text-center">
				<Button asChild
						variant="outline">
					<Link href="/stats">Accéder aux statistiques</Link>
				</Button>
			</div>
		</main>
	)
}
