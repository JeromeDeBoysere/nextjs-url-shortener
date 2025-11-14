'use server'

import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sanitizeSlug, validateSlug } from '@/lib/slug'

export async function shortenUrl(originalUrl: string, customSlug?: string) {

    console.log('aaa');
    if (!originalUrl || !originalUrl.startsWith('http')) {
        throw new Error('URL invalide')
    }

    console.log('bbb');
    let shortCode: string

    if (customSlug) {
        console.log('ccc');
        shortCode = sanitizeSlug(customSlug)

        // Validation partagée
        const validation = validateSlug(shortCode)
        if (!validation.valid) {
            console.log('ddd');
            throw new Error(validation.error)
        }
    } else {
        console.log('eee');
        shortCode = nanoid(6)
    }

    const existing = await prisma.link.findUnique({
        where: { shortCode }
    })
    console.log('fff');

    console.log('existing', existing)
    if (existing) {
        console.log('ggg');

        throw new Error(`Le slug "${shortCode}" est déjà utilisé`)
    }

    await prisma.link.create({
        data: {
            originalUrl,
            shortCode
        }
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return { shortUrl: `${baseUrl}/${shortCode}` }
}