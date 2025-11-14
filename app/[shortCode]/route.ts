import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = {
    params: Promise<{ shortCode: string }>
}

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    console.log('Context:', context)

    const params = await context.params
    console.log('Params après await:', params)

    const shortCode = params.shortCode
    console.log('ShortCode extrait:', shortCode)
    console.log('Type de shortCode:', typeof shortCode)
    console.log('=== DEBUG END ===')

    if (!shortCode) {
        console.log('ShortCode vide, redirection vers /')
        return NextResponse.redirect(new URL('/', request.url))
    }

    try {
        console.log('Recherche dans DB avec shortCode:', shortCode)
        const link = await prisma.link.findUnique({
            where: { shortCode }
        })

        console.log('Résultat DB:', link)

        if (!link) {
            console.log('Lien non trouvé, redirection vers /')
            return NextResponse.redirect(new URL('/', request.url))
        }

        await prisma.link.update({
            where: { id: link.id },
            data: { clicks: link.clicks + 1 }
        })

        console.log('Redirection vers:', link.originalUrl)
        return NextResponse.redirect(link.originalUrl)
    } catch (error) {
        console.error('Redirect error:', error)
        return NextResponse.redirect(new URL('/', request.url))
    }
}