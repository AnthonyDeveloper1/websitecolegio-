/**
 * Schemas de validación con Zod
 */

import { z } from 'zod'

// ==================== AUTH ====================

export const loginSchema = z.object({
  correo: z.string().email('Email inválido'),
  clave: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  fullName: z.string().min(2, 'Mínimo 2 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// ==================== PUBLICATIONS ====================

export const createPublicationSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  content: z.string().min(10),
  mainImage: z.string().url().optional(),
  status: z.string().default('borrador'),
  tagIds: z.array(z.number()).optional(),
})

export const updatePublicationSchema = createPublicationSchema.partial()

// ==================== COMMENTS ====================

export const createCommentSchema = z.object({
  content: z.string().min(3),
  publicationId: z.number().int().positive(),
  name: z.string().optional(),
})

// ==================== TAGS ====================

export const createTagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
})

// ==================== DIRECTORS ====================

export const createDirectorSchema = z.object({
  fullName: z.string().min(2),
  position: z.string().optional(),
  photo: z.string().url().optional(),
  description: z.string().optional(),
  status: z.string().default('activo'),
})

export const updateDirectorSchema = createDirectorSchema.partial()

// ==================== CONTACT ====================

export const contactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subjectId: z.number().int().positive().optional(),
  message: z.string().min(10),
})

// ==================== TIPOS ====================

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreatePublicationInput = z.infer<typeof createPublicationSchema>
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type CreateDirectorInput = z.infer<typeof createDirectorSchema>
export type UpdateDirectorInput = z.infer<typeof updateDirectorSchema>
export type ContactMessageInput = z.infer<typeof contactMessageSchema>
