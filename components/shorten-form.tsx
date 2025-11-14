'use client'

import { useState } from 'react'
import { shortenUrl } from '@/app/actions'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ShortenForm() {
    const [url, setUrl] = useState('')
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
            const data = await shortenUrl(url, customSlug)
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
                    <Label htmlFor="url">Quelle URL souhaitez-vous raccourcir ?</Label>
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
                    <Label htmlFor="slug">Quelle URL raccourcie souhaitez-vous ? (optionnel)</Label>
                    <div className="relative flex items-stretch border border-input rounded-md transition-all duration-150 focus-within:border-[var(--bs-focus-border)] focus-within:shadow-[var(--bs-focus-shadow)]">
        <span className="flex items-center px-3 py-2 text-sm text-muted-foreground whitespace-nowrap bg-muted rounded-l-md border-r">
            {window.location.origin}/
        </span>
                        <Input
                            id="slug"
                            type="text"
                            value={customSlug}
                            onChange={(e) => setCustomSlug(e.target.value)}
                            placeholder="mon-lien-perso"
                            className="flex-1 border-0 shadow-none focus:shadow-none focus:border-transparent rounded-l-none"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={!url || loading}
                    className="w-full"
                >
                    {loading ? <Spinner size="sm" className="text-white mr-2" /> : ('✨ Raccourcir')}
                </Button>
            </form>

            {error && (
                <Alert variant="destructive" className="mt-4">
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