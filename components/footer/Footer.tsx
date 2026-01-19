import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa6';
import DatabaseStatus from './DatabaseStatus';

/**
 * Global footer component with project description and social links
 * Server component for optimal performance
 */
export function Footer() {
	return (
		<footer className="mt-auto">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-10" />

				<div className="flex flex-col items-center gap-5 text-center text-slate-400">
					<p className="font-light max-w-lg">
						Développé en autodidacte pour explorer et pratiquer la stack React/Next.js moderne.
					</p>

					<p className="text-sm">
						Next.js 16 · React 19 · TypeScript · Prisma · <DatabaseStatus /> · Tailwind CSS · shadcn/ui
					</p>

					<div className="flex items-center gap-3 text-sm">
						<Link
							href="mailto:j.deboysere@gmail.com"
							className="hover:text-white inline-flex items-center gap-2"
						>
							<FaEnvelope className="w-5 h-5" /> <span className="underline">Jérôme De Boysère</span>
						</Link>
						<span>·</span>
						<Link
							href="https://github.com/jeromedeboysere/nextjs-url-shortener"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white inline-flex items-center gap-2"
						>
							<FaGithub className="w-5 h-5" /> <span className="underline">GitHub</span>
						</Link>
						<span>·</span>
						<Link
							href="https://www.linkedin.com/in/jeromedeboysere"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white inline-flex items-center gap-2"
						>
							<FaLinkedin className="w-5 h-5" /> <span className="underline">LinkedIn</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
