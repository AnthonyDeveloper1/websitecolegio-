/**
 * Utilidades de autenticación JWT
 */

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: number
  email: string
  username: string
  roleId: number | null
  roleName: string | null
}

/**
 * Genera un hash bcrypt de una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verifica una contraseña contra su hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Genera un token JWT
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Extrae el token del header Authorization
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

/**
 * Verifica si un usuario tiene un rol específico (por nombre de rol)
 */
export function hasRole(userRoleName: string | null, requiredRole: string): boolean {
  if (!userRoleName) return false
  
  const roleHierarchy: { [key: string]: number } = {
    'Administrador': 3,
    'Editor': 2,
    'Usuario': 1,
  }
  
  const userLevel = roleHierarchy[userRoleName] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0
  
  return userLevel >= requiredLevel
}

/**
 * Verifica si el usuario es administrador
 */
export function isAdmin(roleName: string | null): boolean {
  return roleName === 'Administrador'
}

/**
 * Verifica si el usuario es editor o superior
 */
export function canEdit(roleName: string | null): boolean {
  return hasRole(roleName, 'Editor')
}
