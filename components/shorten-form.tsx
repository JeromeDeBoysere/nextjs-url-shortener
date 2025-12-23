'use client'

import {useState, useEffect} from 'react'
import {shortenUrl, checkSlugAvailability} from '@/app/actions'
import {sanitizeSlug, sanitizeSlugLive} from '@/lib/slug'
import {Spinner} from '@/components/ui/spinner'
import {Input} from '@/components/ui/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group"
import {Switch} from "@/components/ui/switch"
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {Copy, Check} from 'lucide-react'


export function ShortenForm() {
	const [url, setUrl] = useState('')
	const [useCustomSlug, setUseCustomSlug] = useState(true)
	const [customSlug, setCustomSlug] = useState('')
	const [result, setResult] = useState<{ shortUrl: string } | null>(null)
	const [loading, setLoading] = useState(false)

	// Slug availability check states
	const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'>('idle')
	const [slugMessage, setSlugMessage] = useState('')

	// Dialog and copy states
	const [dialogOpen, setDialogOpen] = useState(false)
	const [copied, setCopied] = useState(false)

	/**
	 * Copy short URL to clipboard
	 */
	const copyToClipboard = async () => {
		if (!result?.shortUrl) return

		try {
			await navigator.clipboard.writeText(result.shortUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	/**
	 * Check slug availability with debounce
	 */
	useEffect(() => {

		// Reset status if custom slug is disabled or empty
		if (!useCustomSlug || !customSlug) {
			setSlugStatus('idle')
			setSlugMessage('')
			return
		}

		// Set checking status immediately
		setSlugStatus('checking')
		setSlugMessage('')

		// Debounce: wait 500ms after user stops typing
		const timeoutId = setTimeout(async () => {
			try {
				const result = await checkSlugAvailability(customSlug)

				if (result.error) {
					// Slug is invalid
					setSlugStatus('invalid')
					setSlugMessage(result.error)
				} else if (result.available) {
					// Slug is available
					setSlugStatus('available')
					setSlugMessage(`Génial, c'est disponible !`)
				} else {
					// Slug is already taken
					setSlugStatus('unavailable')
					setSlugMessage(`Mince, ce n'est pas disponible...`)
				}
			} catch (err) {
				// Handle unexpected errors
				setSlugStatus('invalid')
				setSlugMessage(`Erreur lors de la vérification`)
			}
		}, 500)

		// Cancel timeout if user types again
		return () => clearTimeout(timeoutId)
	}, [customSlug, useCustomSlug])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setResult(null)
		setLoading(true)

		try {
			// Apply final sanitization to remove trailing hyphens before submission
			const finalSlug = useCustomSlug ? sanitizeSlug(customSlug) : ''
			const data = await shortenUrl(url, finalSlug)
			setResult(data)
			setDialogOpen(true)
			setUrl('')
			setCustomSlug('')
		} catch (err) {
			setSlugStatus('invalid');
			setSlugMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="url">Entrez l'URL longue à raccourcir</Label>
					<Input
						id="url"
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://exemple.com/une-tres-longue-url..."
						required
					/>
				</div>

				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Label htmlFor="useCustomSlug">Personnaliser l'URL raccourcie ?</Label>
						<Switch id="useCustomSlug" defaultChecked={true} checked={useCustomSlug}
								onCheckedChange={(checked) => setUseCustomSlug(checked)}/>
					</div>
				</div>

				{useCustomSlug && <div className="space-y-2">
					<Label htmlFor="slug">Super ! Comment souhaitez-vous la raccourcir ?</Label>
					<InputGroup>
						<InputGroupAddon>
							<InputGroupText
								className="relative top-[1px]">{typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:3000/'}</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							placeholder="tiny-url"
							className="!pl-0.5"
							value={customSlug}
							onChange={(e) => setCustomSlug(sanitizeSlugLive(e.target.value))}
							onBlur={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
						/>
					</InputGroup>

					{/* Slug availability feedback */}
					{slugStatus === 'checking' && (
						<Alert className="mt-2 bg-yellow-50 border-yellow-400">
							<AlertDescription className="flex items-center gap-2">
								<Spinner size="sm"/>
								<span>Un instant, nous vérifions la disponibilité...</span>
							</AlertDescription>
						</Alert>
					)}

					{slugStatus === 'available' && (
						<Alert className="mt-2 bg-green-50 border-green-200">
							<AlertDescription className="flex items-center gap-2">
								<span>✅</span>
								<span className="text-green-700">{slugMessage}</span>
							</AlertDescription>
						</Alert>
					)}

					{(slugStatus === 'unavailable' || slugStatus === 'invalid') && (
						<Alert variant="destructive" className="mt-2 bg-red-50 border-red-200">
							<AlertDescription className="flex items-center gap-2">
								<span>❌</span>
								<span>{slugMessage}</span>
							</AlertDescription>
						</Alert>
					)}

				</div>
				}

				<Button
					type="submit"
					disabled={!url || (useCustomSlug && (loading || slugStatus !== 'available'))}
					className="w-full"
					size="lg"
				>
					{loading ? <Spinner className="text-white mr-2"/> : ('✨ Raccourcir')}
				</Button>
			</form>

			{/* Dialog to display the short URL */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Houston, nous sommes prêt ! ✨</DialogTitle>
						<DialogDescription>
							Votre URL a été raccourcie. Vous pouvez maintenant la copier et la partager.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 mt-2">
						{/* Short URL display */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-4">
							<a
								href={result?.shortUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-lg font-semibold text-green-700 hover:text-green-800 hover:underline break-all"
							>
								{result?.shortUrl}
							</a>
						</div>

						{/* Copy button */}
						<Button
							onClick={copyToClipboard}
							className="w-full"
							size="lg"
							variant={copied ? "outline" : "default"}
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2"/>
									Copié !
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2"/>
									Copier le lien
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
