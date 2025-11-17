import {NextRequest, NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

type RouteContext = {
	params: Promise<{ shortCode: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
	const params = await context.params
	const shortCode = params.shortCode

	if (!shortCode) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	try {
		const link = await prisma.link.findUnique({
			where: {shortCode}
		})

		if (!link) {
			return NextResponse.redirect(new URL('/', request.url))
		}

		// Increment click counter
		await prisma.link.update({
			where: {id: link.id},
			data: {clicks: link.clicks + 1}
		})

		return NextResponse.redirect(link.originalUrl)
	} catch (error) {
		console.error('Redirect error:', error)
		return NextResponse.redirect(new URL('/', request.url))
	}
}
