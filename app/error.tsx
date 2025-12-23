"use client";

// Error Boundary de Next.js.
// Cela intercepte les erreurs runtime de toute l'app, ce qui évite des try-catch partout.
import {Button} from "@/components/ui/button";
import Link from "next/link";

const PRISMA_ERRORS = [
	"PrismaClientInitializationError",
	"PrismaClientKnownRequestError",
	"PrismaClientUnknownRequestError",
	"PrismaClientRustPanicError",
];

export default function Error({
								  error
							  }: {
	error: Error;
	reset: () => void;
}) {

	const isDatabaseError = PRISMA_ERRORS.includes(error.name);

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="text-center">
				<h1 className="text-6xl mb-4">Oops!</h1>
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Quelque chose s&apos;est mal passé
				</h2>
				<p className="text-gray-600 mb-6">
					{isDatabaseError ? "Ce projet est probablement en pause auprès de Supabase. Contactez-moi pour le réactiver." : "Reessayez dans quelques instants."}
				</p>

				<div className="flex justify-center gap-4">
					<Button
						onClick={() => window.location.reload()}
					>
						Réessayer
					</Button>
					<Button asChild
							variant="outline">
						<Link href="/">Retour à l'accueil</Link>
					</Button>
					<Button asChild
							variant="secondary">
						<Link
							href="https://www.linkedin.com/in/jeromedeboysere"
							target="_blank"
						>
							Contactez-moi sur LinkedIn
						</Link>
					</Button>
				</div>

			</div>
		</main>
	);
}
