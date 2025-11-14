'use client'

import { useState } from 'react'
import { shortenUrl } from '@/app/actions'
import { sanitizeSlug, sanitizeSlugLive } from '@/lib/slug'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'


export function ShortenForm() {
    const [url, setUrl] = useState('')
	const [useCustomSlug, setUseCustomSlug] = useState(true)
	const [customSlug, setCustomSlug] = useState('')
    const [result, setResult] = useState<{ shortUrl: string } | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setResult(null)
        setLoading(true)

        try {
            // Apply final sanitization to remove trailing hyphens before submission
            const finalSlug = customSlug ? sanitizeSlug(customSlug) : customSlug
            const data = await shortenUrl(url, finalSlug)
            setResult(data)
            setUrl('')
            setCustomSlug('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
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
						<Switch id="useCustomSlug" defaultChecked={true} checked={useCustomSlug} onCheckedChange={(checked) => setUseCustomSlug(checked)}/>
					</div>
				</div>

				{useCustomSlug && <div className="space-y-2">
					<Label htmlFor="slug">Super ! Comment souhaitez-vous la raccourcir ?</Label>
					<InputGroup>
						<InputGroupAddon>
							<InputGroupText>{typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:3000/'}</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							placeholder="tiny-url"
							className="!pl-0.5"
							value={customSlug}
							onChange={(e) => setCustomSlug(sanitizeSlugLive(e.target.value))}
							onBlur={(e) => setCustomSlug(sanitizeSlug(e.target.value))}
						/>
					</InputGroup>

				</div>
				}


                <Button
                    type="submit"
                    disabled={!url || loading}
                    className="w-full"
					size="lg"
                >
                    {loading ? <Spinner size="sm" className="text-white mr-2" /> : ('✨ Raccourcir')}
                </Button>
            </form>

            {error && (
                <Alert variant="destructive" className="mt-6 bg-red-50 border-red-200">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && (
                <Alert className="mt-6 bg-green-50 border-green-200">
                    <AlertDescription>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            Votre lien court : <a href={result.shortUrl} target="_blank">{result.shortUrl}</a>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
