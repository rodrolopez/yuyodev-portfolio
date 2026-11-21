import { connection } from 'next/server';
import ContactForm from './contact-form';

export default async function ContactoPage() {
  // Public widget configuration is read at runtime, so Docker builds need no env files.
  await connection();
  return <ContactForm siteKey={process.env.TURNSTILE_SITE_KEY ?? ''} action={process.env.TURNSTILE_EXPECTED_ACTION ?? ''} />;
}
