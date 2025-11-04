'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Publication {
  id: number
  titulo: string
  slug: string
  descripcion: string | null
  contenido: string
  imagenUrl: string | null
  createdAt: string
  usuario: {
    fullName: string
  }
  tags: {
    tag: {
      nombre: string
      slug: string
    }
  }[]
}

interface Reaction {
  tipo: string
  _count: number
}

interface Comment {
  id: number
  contenido: string
  createdAt: string
  usuario: {
    fullName: string
  } | null
  usuarioAnonimo: string | null
}

const REACTION_TYPES = [
  { tipo: 'like', emoji: '👍', label: 'Me gusta' },
  { tipo: 'love', emoji: '❤️', label: 'Me encanta' },
  { tipo: 'wow', emoji: '😮', label: 'Me sorprende' },
  { tipo: 'sad', emoji: '😢', label: 'Me entristece' },
  { tipo: 'angry', emoji: '😡', label: 'Me enoja' },
]

export default function PublicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [publication, setPublication] = useState<Publication | null>(null)
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    nombre: '',
    correo: '',
    contenido: ''
  })

  useEffect(() => {
    if (slug) {
      loadPublication()
      loadReactions()
      loadComments()
    }
  }, [slug])

  const loadPublication = async () => {
    try {
      const response = await fetch(`/api/publications?slug=${slug}&status=published`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setPublication(data[0])
        } else {
          router.push('/publicaciones')
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReactions = async () => {
    try {
      const response = await fetch(`/api/publications?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const pubId = data[0].id
          const reactResponse = await fetch(`/api/reactions?publicationId=${pubId}`)
          if (reactResponse.ok) {
            const reactData = await reactResponse.json()
            setReactions(Array.isArray(reactData) ? reactData : [])
          }
        }
      }
    } catch (error) {
      console.error('Error loading reactions:', error)
      setReactions([])
    }
  }

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/publications?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const pubId = data[0].id
          const commentsResponse = await fetch(`/api/comments?publicationId=${pubId}&approved=true`)
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json()
            setComments(Array.isArray(commentsData) ? commentsData : [])
          }
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      setComments([])
    }
  }

  const handleReaction = async (tipo: string) => {
    if (!publication) return
    
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicacionId: publication.id,
          tipo
        })
      })
      loadReactions()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publication) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicacionId: publication.id,
          usuarioAnonimo: commentForm.nombre,
          correoAnonimo: commentForm.correo,
          contenido: commentForm.contenido
        })
      })

      if (response.ok) {
        alert('Comentario enviado. Será visible una vez aprobado.')
        setCommentForm({ nombre: '', correo: '', contenido: '' })
      }
    } catch (error) {
      alert('Error al enviar comentario')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!publication) {
    return null
  }

  return (
    <div className="bg-gray-50">
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/publicaciones"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Publicaciones
          </Link>
        </div>
      </div>

      {/* CONTENIDO */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {publication.titulo}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(publication.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {publication.usuario.fullName}
            </span>
          </div>

          {publication.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {publication.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full"
                >
                  {t.tag.nombre}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Imagen destacada */}
        {publication.imagenUrl && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden bg-gray-200">
            <Image
              src={publication.imagenUrl}
              alt={publication.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Contenido */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: publication.contenido }}
        />

        {/* Reacciones */}
        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="flex items-center gap-6 mb-4">
            {reactions.map((reaction) => (
              <span key={reaction.tipo} className="text-gray-600">
                {REACTION_TYPES.find(r => r.tipo === reaction.tipo)?.emoji} {reaction._count}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {REACTION_TYPES.map((reaction) => (
              <button
                key={reaction.tipo}
                onClick={() => handleReaction(reaction.tipo)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="text-xl">{reaction.emoji}</span>
                <span className="text-sm">{reaction.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comentarios */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comentarios ({comments.length})
          </h2>

          <div className="space-y-4 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {comment.usuario?.fullName || comment.usuarioAnonimo}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{comment.contenido}</p>
              </div>
            ))}
          </div>

          {/* Formulario de comentario */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Deja tu comentario</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={commentForm.nombre}
                  onChange={(e) => setCommentForm({ ...commentForm, nombre: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  required
                  value={commentForm.correo}
                  onChange={(e) => setCommentForm({ ...commentForm, correo: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Tu comentario"
                required
                rows={4}
                value={commentForm.contenido}
                onChange={(e) => setCommentForm({ ...commentForm, contenido: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Enviar comentario
              </button>
              <p className="text-sm text-gray-500">
                Tu comentario será revisado antes de ser publicado.
              </p>
            </form>
          </div>
        </div>
      </article>
    </div>
  )
}
