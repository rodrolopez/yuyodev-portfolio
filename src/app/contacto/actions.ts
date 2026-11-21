'use server';

import nodemailer from 'nodemailer';
import { createContactHandler } from './contact-service';

const handleContact = createContactHandler({
  env: () => process.env,
  fetch: (...args) => fetch(...args),
  createTransport: options => nodemailer.createTransport(options),
});

export async function enviarMensajeContacto(formData: FormData) {
  return handleContact(formData);
}
