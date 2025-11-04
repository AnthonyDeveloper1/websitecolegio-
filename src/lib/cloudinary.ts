/**
 * Cloudinary Configuration
 * Servicio de almacenamiento de imágenes en la nube
 */

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export default cloudinary

/**
 * Subir imagen a Cloudinary
 * @param file - Archivo en base64 o buffer
 * @param folder - Carpeta en Cloudinary (ej: 'publications', 'gallery')
 */
export async function uploadImage(file: string, folder: string = 'colegio') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto', // Detecta automáticamente imagen/video
      transformation: [
        { quality: 'auto', fetch_format: 'auto' } // Optimización automática
      ]
    })
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }
  } catch (error) {
    console.error('Error subiendo a Cloudinary:', error)
    throw new Error('Error al subir imagen')
  }
}

/**
 * Eliminar imagen de Cloudinary
 * @param publicId - ID público de la imagen en Cloudinary
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error eliminando de Cloudinary:', error)
    throw new Error('Error al eliminar imagen')
  }
}
