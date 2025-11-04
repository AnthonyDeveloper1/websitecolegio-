/**
 * Prisma Client Singleton
 * Evita múltiples instancias de Prisma Client en desarrollo (hot reload)
 */

import { PrismaClient } from '@prisma/client'

// If DATABASE_URL is not set (for example during a preview deploy where
// we don't want to connect to the real DB), export a lightweight mock that
// returns safe defaults so the site can build and the UI can render.
// Also allow a fallback variable `DB_URL` in case Vercel blocks DATABASE_URL
const dbUrl = process.env.DATABASE_URL || process.env.DB_URL
const hasDatabase = Boolean(dbUrl)

// If DB_URL was provided but DATABASE_URL wasn't, set it so Prisma reads it normally
if (!process.env.DATABASE_URL && process.env.DB_URL) {
  process.env.DATABASE_URL = process.env.DB_URL
}

if (!hasDatabase) {
  console.warn('[prisma] DATABASE_URL not set — returning mock prisma for build/time without DB')

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

  // export as any so imports keep working
  export const prisma: any = proxy
  export default prisma

} else {
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  export default prisma
}
