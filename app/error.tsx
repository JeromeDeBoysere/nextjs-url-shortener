'use client';

/**
 * Next.js Error Boundary - catches runtime errors across the entire app
 * Distinguishes between connection errors (Supabase paused) and other errors
 */
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PRISMA_ERRORS = [
	'PrismaClientInitializationError',
	'PrismaClientKnownRequestError',
	'PrismaClientUnknownRequestError',
	'PrismaClientRustPanicError',
];

/**
 * Get error type from error object
 * @param error - The error object
 * @returns Error type: connection, database, or generic
 */
function getErrorType(error: Error): 'connection' | 'database' | 'generic' {
	if (error.name === 'PrismaClientInitializationError') {
		return 'connection';
	}
	if (PRISMA_ERRORS.includes(error.name)) {
		return 'database';
	}
	return 'generic';
}

export default function Error({ error }: { error: Error; reset: () => void }) {
	const errorType = getErrorType(error);

	return (
		<main>
			<div className="text-center">
				<h1 className="text-6xl mb-4">Oops!</h1>
				<h2 className="text-2xl font-bold text-gray-900 mb-4">Quelque chose s'est mal passé</h2>
				<p className="text-gray-600 mb-6">
					{errorType === 'connection' && 'Ce projet est probablement en pause auprès de Supabase.'}
					{errorType === 'database' &&
						"Une erreur technique s'est produite. Réessayez dans quelques instants."}
					{errorType === 'generic' && "Une erreur s'est produite. Réessayez dans quelques instants."}{' '}
					<Link
						href="https://www.linkedin.com/in/jeromedeboysere"
						target="_blank"
						className="text-blue-600 hover:underline"
					>
						Contactez-moi
					</Link>{' '}
					ou consultez mon{' '}
					<Link
						href="https://github.com/jdeboysere/nextjs-url-shortener"
						target="_blank"
						className="text-blue-600 hover:underline"
					>
						Github
					</Link>
					.
				</p>

				<div className="flex justify-center gap-4">
					<Button onClick={() => window.location.reload()}>Réessayer</Button>
					<Button asChild variant="outline">
						<Link href="/">Retour à l'accueil</Link>
					</Button>
					<Button asChild variant="secondary">
						<Link href="https://www.linkedin.com/in/jeromedeboysere" target="_blank">
							Contactez-moi sur LinkedIn
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
