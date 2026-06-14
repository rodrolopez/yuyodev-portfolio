'use server'

import nodemailer from 'nodemailer';

export async function enviarMensajeContacto(formData: FormData) {
  const nombre = formData.get('name') as string;
  const email = formData.get('email') as string;
  const mensaje = formData.get('message') as string;

  if (!nombre || !email || !mensaje) {
    return { error: 'Todos los campos son obligatorios.' };
  }

  // Si no hay variables de entorno (porque todavía no te activaron Donweb), 
  // simulamos el envío para que puedas probar la UI.
  if (process.env.SMTP_PASS === 'tu_password_pendiente') {
    console.log("Simulando envío de correo (Faltan credenciales SMTP):", { nombre, email, mensaje });
    // Simulamos un delay de red
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return { success: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"YuyoDev" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // ACÁ PONÉ TU GMAIL REAL
      replyTo: email, // Para que puedas responder directamente al email del contacto
      subject: `Hola ${nombre}!, nos llegó tu mensaje a YuyoDev.`,
      text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
      html: `
        <h3>Nuevo contacto desde YuyoDev</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error enviando el correo:', error);
    return { error: 'Hubo un problema al enviar el mensaje. Intentá de nuevo.' };
  }
}