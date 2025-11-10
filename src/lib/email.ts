/**
 * Resend Email Service
 * Servicio para envío de correos electrónicos
 */

import { Resend } from 'resend'

/**
 * Create a Resend client lazily to avoid executing network-related
 * or API-key-dependent logic at module import time (this prevents
 * build-time failures when the secret isn't set).
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Enviar correo electrónico
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const fromEmail = from || process.env.EMAIL_FROM || 'Colegio <onboarding@resend.dev>'

    const client = getResendClient()
    if (!client) {
      console.warn('Resend API key not set; skipping sendEmail (dev/test mode)')
      return null
    }

    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('Error enviando correo:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error en sendEmail:', error)
    throw error
  }
}

/**
 * Enviar notificación de contacto al admin
 */
export async function sendContactNotification(
  contactData: {
    name: string
    email: string
    subject: string
    message: string
  },
  toEmails?: string[]
) {
  // Si no se proporcionan emails, usar el email por defecto de las variables de entorno
  const recipients = toEmails && toEmails.length > 0 
    ? toEmails 
    : [process.env.ADMIN_EMAIL || 'admin@colegio.edu']
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 Nuevo Mensaje de Contacto</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">De:</div>
              <div class="value">${contactData.name} (${contactData.email})</div>
            </div>
            <div class="field">
              <div class="label">Asunto:</div>
              <div class="value">${contactData.subject}</div>
            </div>
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${contactData.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            Este correo fue enviado desde el formulario de contacto del sitio web del colegio.
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: recipients,
    subject: `Nuevo contacto: ${contactData.subject}`,
    html,
  })
}

/**
 * Enviar correo de bienvenida
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 ¡Bienvenido!</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente en el sistema del colegio.</p>
            <p>Ahora puedes acceder con tu correo electrónico y contraseña.</p>
            <p><strong>Equipo del Colegio</strong></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Bienvenido al Sistema del Colegio',
    html,
  })
}

/**
 * Enviar confirmación al usuario
 */
export async function sendContactConfirmation(userEmail: string, userName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✅ Mensaje Recibido</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
            <p>Gracias por ponerte en contacto con nosotros.</p>
            <p><strong>Equipo del Colegio</strong></p>
          </div>
          <div class="footer">
            Este es un correo automático, por favor no respondas a este mensaje.
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Hemos recibido tu mensaje - Colegio',
    html,
  })
}
