/**
 * Prisma Client Singleton
 * Evita múltiples instancias de Prisma Client en desarrollo (hot reload)
 */

import { PrismaClient } from '@prisma/client'

// If DATABASE_URL is not set (for example during a preview deploy where
// we don't want to connect to the real DB), use a lightweight mock that
// returns safe defaults so the site can build and the UI can render.
// Also allow a fallback variable `DB_URL` in case Vercel blocks DATABASE_URL
// Additionally, handle the case where Vercel exposes a secret reference
// like `@database_url` as the value for DATABASE_URL — treat that as unset
// unless a literal DB string is provided in `DB_URL`.
function normalizeDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL ?? process.env.DB_URL
  if (!raw) return undefined

  // If the value looks like a Vercel secret reference (starts with '@'),
  // don't treat it as a usable URL. Prefer an explicit DB_URL if provided.
  if (raw.startsWith('@')) {
    const fallback = process.env.DB_URL
    if (fallback) {
      console.warn('[prisma] DATABASE_URL references a secret; using DB_URL fallback')
      return fallback
    }
    console.warn('[prisma] DATABASE_URL appears to reference a secret and no DB_URL fallback is set')
    return undefined
  }

  return raw
}

const dbUrl = normalizeDatabaseUrl()
const hasDatabase = Boolean(dbUrl)

// If we have a literal DB URL provided via DB_URL and DATABASE_URL wasn't set
// (or pointed to a secret), set DATABASE_URL so Prisma will read it normally.
if (!process.env.DATABASE_URL && process.env.DB_URL) {
  process.env.DATABASE_URL = process.env.DB_URL
}

// model-level proxy that returns safe defaults for common methods
const modelProxy = new Proxy({}, {
  get: (_target, method) => {
    const m = String(method)
    return async (..._args: any[]) => {
      if (m === 'findMany') return []
      if (m === 'findFirst' || m === 'findUnique') return null
      if (m === 'count') return 0
      if (m === 'create' || m === 'update' || m === 'delete' || m === 'upsert') return null
      // default fallback
      return null
    }
  }
})

const proxy = new Proxy({}, {
  get: (_target, _model) => modelProxy
})

// Declare `prisma` once and export at top level so TypeScript/ESM doesn't
// complain about conditional exports.
let prisma: any

if (!hasDatabase) {
  console.warn('[prisma] DATABASE_URL not set — returning mock prisma for build/time without DB')
  prisma = proxy
} else {
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
}

export { prisma }
export default prisma
