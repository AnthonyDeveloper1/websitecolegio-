/**
 * Servicio de Upload de archivos a S3/MinIO
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.NODE_ENV === 'development' 
    ? `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`
    : process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NODE_ENV === 'development'
      ? process.env.MINIO_ROOT_USER!
      : process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.NODE_ENV === 'development'
      ? process.env.MINIO_ROOT_PASSWORD!
      : process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: process.env.NODE_ENV === 'development', // Necesario para MinIO
})

const BUCKET_NAME = process.env.NODE_ENV === 'development'
  ? process.env.MINIO_BUCKET!
  : process.env.S3_BUCKET!

/**
 * Sube un archivo a S3/MinIO
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    const buffer = file instanceof File 
      ? Buffer.from(await file.arrayBuffer())
      : file

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    })

    await s3Client.send(command)

    // Retornar URL pública
    if (process.env.NODE_ENV === 'development') {
      return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${filename}`
    } else {
      return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${filename}`
    }
  } catch (error) {
    console.error('Error al subir archivo:', error)
    throw new Error('Error al subir archivo')
  }
}

/**
 * Elimina un archivo de S3/MinIO
 */
export async function deleteFile(filename: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    return false
  }
}

/**
 * Genera una URL firmada para descarga temporal
 */
export async function getSignedDownloadUrl(
  filename: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Error al generar URL firmada:', error)
    throw new Error('Error al generar URL de descarga')
  }
}

/**
 * Valida el tipo de archivo
 */
export function isValidFileType(mimetype: string): boolean {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',')
  return allowedTypes.includes(mimetype)
}

/**
 * Valida el tamaño del archivo
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  return size <= maxSize
}

/**
 * Genera un nombre único para el archivo
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}
