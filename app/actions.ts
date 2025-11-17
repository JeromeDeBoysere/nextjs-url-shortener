'use server'

import {prisma} from '@/lib/prisma'
import {nanoid} from 'nanoid'
import {sanitizeSlug, validateSlug} from '@/lib/slug'

/**
 * Check if a slug is available in the database
 * @param {string} slug - The slug to check
 * @returns {Promise<{available: boolean, sanitized: string, error?: string}>} Availability status
 */
export async function checkSlugAvailability(slug: string) {
	// Sanitize the slug (removes trailing hyphens, etc.)
	const sanitized = sanitizeSlug(slug)

	// Validate the sanitized slug
	const validation = validateSlug(sanitized)

	if (!validation.valid) {
		return {
			available: false,
			sanitized,
			error: validation.error
		}
	}

	// Check if slug exists in database
	const existing = await prisma.link.findUnique({
		where: {shortCode: sanitized}
	})

	return {
		available: !existing,
		sanitized
	}
}

export async function shortenUrl(originalUrl: string, customSlug?: string) {
	if (!originalUrl || !originalUrl.startsWith('http')) {
		throw new Error('URL invalide')
	}

	let shortCode: string

	if (customSlug && customSlug != '') {
		shortCode = sanitizeSlug(customSlug)

		// Validate slug
		const validation = validateSlug(shortCode)
		if (!validation.valid) {
			throw new Error(validation.error)
		}
	} else {
		shortCode = nanoid(6)
	}

	const existing = await prisma.link.findUnique({
		where: {shortCode}
	})

	if (existing) {
		throw new Error(`Mince, ce n'est pas disponible...`)
	}

	await prisma.link.create({
		data: {
			originalUrl,
			shortCode
		}
	})

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

	return {shortUrl: `${baseUrl}${shortCode}`}
}
