/**
 * API Route: Test Email
 * POST /api/test-email - Enviar correo de prueba
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendContactNotification, sendContactConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, subject, message, name, email } = body

    // Correo de prueba simple
    if (type === 'simple') {
      await sendEmail({
        to: to || 'test@example.com',
        subject: subject || 'Correo de Prueba',
        html: `
          <h2>Prueba de Resend</h2>
          <p>${message || 'Este es un correo de prueba desde el sistema del colegio.'}</p>
        `,
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Correo enviado correctamente' 
      })
    }

    // Notificación de contacto (al admin)
    if (type === 'contact') {
      await sendContactNotification({
        name: name || 'Usuario de Prueba',
        email: email || 'usuario@example.com',
        subject: subject || 'Mensaje de Prueba',
        message: message || 'Este es un mensaje de prueba.',
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Notificación enviada al administrador' 
      })
    }

    // Confirmación al usuario
    if (type === 'confirmation') {
      await sendContactConfirmation(
        email || 'usuario@example.com',
        name || 'Usuario'
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Confirmación enviada al usuario' 
      })
    }

    return NextResponse.json(
      { error: 'Tipo de correo no especificado' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error al enviar correo:', error)
    return NextResponse.json(
      { error: 'Error al enviar correo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
