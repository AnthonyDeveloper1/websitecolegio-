/**
 * API Route: Test endpoint
 * GET /api/test
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    
    const [
      userCount,
      roleCount,
      publicationCount,
      tagCount,
      publicationTagCount,
      commentCount,
      reactionCount,
      directorCount,
      contactMessageCount,
      contactSubjectCount,
      destinationEmailCount,
      auditLogCount,
      visitCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.role.count(),
      prisma.publication.count(),
      prisma.tag.count(),
      prisma.publicationTag.count(),
      prisma.comment.count(),
      prisma.reaction.count(),
      prisma.director.count(),
      prisma.contactMessage.count(),
      prisma.contactSubject.count(),
      prisma.destinationEmail.count(),
      prisma.auditLog.count(),
      prisma.visit.count(),
    ])
    
    return NextResponse.json({
      status: 'OK',
      message: 'Sistema funcionando - 13 tablas activas',
      database: 'Connected',
      stats: {
        users: userCount,
        roles: roleCount,
        publications: publicationCount,
        tags: tagCount,
        publicationTags: publicationTagCount,
        comments: commentCount,
        reactions: reactionCount,
        directors: directorCount,
        contactMessages: contactMessageCount,
        contactSubjects: contactSubjectCount,
        destinationEmails: destinationEmailCount,
        auditLogs: auditLogCount,
        visits: visitCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error en test:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Error de conexión',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
