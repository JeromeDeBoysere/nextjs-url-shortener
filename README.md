# URL Shortener

> **Personal training project** - Learning Next.js 16, React 19 and modern web development.
>
> **Status:** ✅ Complete | [See features →](#features)
>
> **Author:** Jérôme de Boysère ([LinkedIn](https://www.linkedin.com/in/jeromedeboysere/))

A URL shortening application built with Next.js 16 and Prisma. Transform long URLs into short, shareable links with click tracking and custom slug support.

**[View Live Demo on Vercel →](https://nextjs-url-shortener-gamma.vercel.app/)**

## Features

### Implemented

- ✅ URL shortening form with validation
- ✅ Auto-generated unique slugs (6 characters)
- ✅ Custom slug support (optional)
- ✅ Modal dialog for shortened URL display
- ✅ Copy to clipboard functionality
- ✅ Prisma ORM with PostgreSQL
- ✅ Server Actions for form handling
- ✅ Automatic redirection via Route Handler
- ✅ Click tracking
- ✅ Responsive design with Tailwind CSS
- ✅ shadcn/ui components (Button, Dialog, Input, Switch, Label, Card, Table, Tooltip)

### Roadmap

- ✅ Stats page with click tracking and sorting
- ✅ Global error boundary for database errors
- ✅ Deployment on Vercel

## Tech Stack

| Category         | Technologies                           |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 16.1, React 19.2, TypeScript 5 |
| Database         | Prisma 6.19, PostgreSQL (Supabase)     |
| UI Components    | shadcn/ui (Radix UI), Lucide React     |
| Styling          | Tailwind CSS v4, CVA                   |
| Utilities        | clsx, tailwind-merge                   |
| Code Quality     | ESLint 9                               |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database (or [Supabase](https://supabase.com/) free tier)

### Installation

```bash
git clone https://github.com/jeromedeboysere/nextjs-url-shortener.git
cd nextjs-url-shortener
pnpm install
```

### Configuration

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener"
```

### Database Setup

```bash
pnpm prisma generate
pnpm prisma db push
```

### Development

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
app/              Next.js App Router pages
components/       React components
  ui/             shadcn/ui base components
lib/              Utilities and helpers
prisma/           Database schema and migrations
```

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `pnpm dev`         | Start development server     |
| `pnpm build`       | Build for production         |
| `pnpm start`       | Start production server      |
| `pnpm lint`        | Run ESLint                   |
| `pnpm prisma studio` | Open Prisma database GUI   |

## How It Works

1. User enters a long URL in the form
2. Optionally toggle custom slug mode to create a personalized short link
3. Server generates a unique 6-character slug (or validates custom slug)
4. Short URL is stored in PostgreSQL via Prisma
5. User receives the shortened URL in a modal dialog
6. When someone visits the short URL, they are redirected to the original

## License

MIT
