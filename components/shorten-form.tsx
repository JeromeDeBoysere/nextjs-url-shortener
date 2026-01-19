'use client';

import { useState, useEffect } from 'react';
import { shortenUrl, checkSlugAvailability } from '@/app/actions';
import { sanitizeSlug, sanitizeSlugLive } from '@/lib/slug';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

export function ShortenForm() {
	const [url, setUrl] = useState('');
	const [useCustomSlug, setUseCustomSlug] = useState(true);
	const [customSlug, setCustomSlug] = useState('');
	const [result, setResult] = useState<{ shortUrl: string } | null>(null);
	const [loading, setLoading] = useState(false);

	// Slug availability check states
	const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'>('idle');
	const [slugMessage, setSlugMessage] = useState('');

	// Dialog and copy states
	const [dialogOpen, setDialogOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	/**
	 * Copy short URL to clipboard
	 */
	const copyToClipboard = async () => {
		if (!result?.shortUrl) return;

		try {
			await navigator.clipboard.writeText(result.shortUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	/**
	 * Check slug availability with debounce
	 */
	useEffect(() => {
		// Reset status if custom slug is disabled or empty
		if (!useCustomSlug || !customSlug) {
			setSlugStatus('idle');
			setSlugMessage('');
			return;
		}

		// Set checking status immediately
		setSlugStatus('checking');
		setSlugMessage('');

		// Debounce: wait 500ms after user stops typing
		const timeoutId = setTimeout(async () => {
			try {
				const result = await checkSlugAvailability(customSlug);

				if (result.error) {
					// Slug is invalid
					setSlugStatus('invalid');
					setSlugMessage(result.error);
				} else if (result.available) {
					// Slug is available
					setSlugStatus('available');
					setSlugMessage(`Génial, c'est disponible !`);
				} else {
					// Slug is already taken
					setSlugStatus('unavailable');
					setSlugMessage(`Mince, ce n'est pas disponible...`);
				}
			} catch {
				// Handle unexpected errors
				setSlugStatus('invalid');
				setSlugMessage(`Erreur lors de la vérification`);
			}
		}, 500);

		// Cancel timeout if user types again
		return () => clearTimeout(timeoutId);
	}, [customSlug, useCustomSlug]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setResult(null);
		setLoading(true);

		try {
			// Apply final sanitization to remove trailing hyphens before submission
			const finalSlug = useCustomSlug ? sanitizeSlug(customSlug) : '';
			const data = await shortenUrl(url, finalSlug);
			setResult(data);
			setDialogOpen(true);
			setUrl('');
			setCustomSlug('');
		} catch (err) {
			setSlugStatus('invalid');
			setSlugMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="space-y-2">
					<Label htmlFor="url" className="text-slate-200">
						Entrez l'URL à raccourcir
					</Label>
					<Input
						id="url"
						type="url"
						value={url}
						onChange={e => setUrl(e.target.value)}
						placeholder="https://mon-site.fr/articles/mon-article-de-blog"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Label htmlFor="useCustomSlug" className="text-slate-200">
							<FaWandMagicSparkles className="w-4 h-4 text-yellow-500" /> Personnaliser ?{' '}
						</Label>
						<Switch
							id="useCustomSlug"
							defaultChecked={false}
							checked={useCustomSlug}
							onCheckedChange={checked => setUseCustomSlug(checked)}
							className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-violet-500"
						/>
						{useCustomSlug}
					</div>
				</div>

				{useCustomSlug && (
					<div className="space-y-2">
						<Label htmlFor="slug" className="text-slate-200">
							Comment personnaliser l'URL ?
						</Label>
						<InputGroup className="bg-white/10 border border-white/20 rounded-md">
							<InputGroupAddon>
								<InputGroupText className="relative top-[1px] text-white">
									{process.env.NEXT_PUBLIC_BASE_URL}
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								placeholder="mon-article"
								className="!pl-0.5 bg-transparent border-0 text-white placeholder:text-slate-400 focus:ring-0"
								value={customSlug}
								onChange={e => setCustomSlug(sanitizeSlugLive(e.target.value))}
								onBlur={e => setCustomSlug(sanitizeSlug(e.target.value))}
							/>
						</InputGroup>

						{/* Slug availability feedback */}
						{slugStatus === 'checking' && (
							<Alert className="mt-2 bg-yellow-500/20 border-yellow-500/50">
								<AlertDescription className="flex items-center gap-2 text-yellow-200">
									<Spinner />
									<span>Un instant, nous vérifions la disponibilité...</span>
								</AlertDescription>
							</Alert>
						)}

						{slugStatus === 'available' && (
							<Alert className="mt-2 bg-green-500/20 border-green-500/50">
								<AlertDescription className="flex items-center gap-2 text-green-200">
									<span>✅</span>
									<span>{slugMessage}</span>
								</AlertDescription>
							</Alert>
						)}

						{(slugStatus === 'unavailable' || slugStatus === 'invalid') && (
							<Alert variant="destructive" className="mt-2 bg-red-500/30 border-red-400">
								<AlertDescription className="flex items-center gap-2 text-red-100 font-medium">
									<span>❌</span>
									<span>{slugMessage}</span>
								</AlertDescription>
							</Alert>
						)}
					</div>
				)}

				<Button
					type="submit"
					disabled={!url || (useCustomSlug && (loading || slugStatus !== 'available'))}
					className="w-full bg-white text-slate-900 hover:bg-slate-100 disabled:bg-white/50"
					size="lg"
				>
					{loading ? <Spinner className="text-slate-900 mr-2" /> : 'Générer le lien court'}
				</Button>
			</form>

			{/* Dialog to display the short URL */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="bg-slate-900 border-white/20 text-white">
					<DialogHeader>
						<DialogTitle className="text-white text-xl">Lien créé avec succès</DialogTitle>
						<DialogDescription className="text-slate-400">
							Votre URL a été raccourcie. Copiez-la et partagez-la.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 mt-2">
						{/* Short URL display */}
						<div className="bg-white/10 border border-white/20 rounded-lg p-4">
							<a
								href={result?.shortUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline break-all"
							>
								{result?.shortUrl}
							</a>
						</div>

						{/* Copy button */}
						<Button
							onClick={copyToClipboard}
							className={
								copied
									? 'w-full bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30'
									: 'w-full bg-white text-slate-900 hover:bg-slate-100'
							}
							size="lg"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2" />
									Copié !
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />
									Copier le lien
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
