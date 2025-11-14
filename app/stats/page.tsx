import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function StatsPage() {
    const links = await prisma.link.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">📊 Statistiques</h1>
                    <Button asChild>
                        <Link href="/">← Retour</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total de liens</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-blue-600">{links.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Total de clics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-green-600">{totalClicks}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Moyenne par lien</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-purple-600">
                                {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tous les liens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code court</TableHead>
                                    <TableHead>URL originale</TableHead>
                                    <TableHead>Clics</TableHead>
                                    <TableHead>Créé le</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {links.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            <code className="text-sm font-mono text-blue-600">
                                                {link.shortCode}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={link.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-600 hover:text-blue-600 truncate max-w-md block"
                                            >
                                                {link.originalUrl}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                      <span className="text-sm font-semibold text-gray-900">
                        {link.clicks}
                      </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(link.createdAt).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {links.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                Aucun lien créé pour le moment
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
