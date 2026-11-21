import { createHash } from 'node:crypto';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type Mail from 'nodemailer/lib/mailer';

export const CONTACT_ERROR = 'No pudimos enviar el mensaje. Intentá nuevamente más tarde.';
export type ContactResult = { success: true } | { error: string };
type Environment = Record<string, string | undefined>;
type Dependencies = {
  env: () => Environment;
  fetch: typeof fetch;
  createTransport: (options: SMTPTransport.Options) => {
    sendMail: (message: Mail.Options) => Promise<{ accepted: unknown[]; rejected: unknown[] }>;
    close: () => void;
  };
  now?: () => number;
};

const emailPattern = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
const hostnamePattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const isEmail = (value: string) => value.length <= 254 && value.split('@')[0].length <= 64 && emailPattern.test(value);
const escapeHTML = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

function configuration(env: Environment) {
  const keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'CONTACT_TO', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_EXPECTED_HOSTNAME', 'TURNSTILE_EXPECTED_ACTION'] as const;
  for (const key of keys) {
    const value = env[key];
    if (!value || !value.trim() || value.length > 1024 || /[\u0000-\u001f\u007f]/.test(value)) throw new Error('Invalid configuration');
  }
  if (env.SMTP_HOST!.length > 253 || !hostnamePattern.test(env.SMTP_HOST!) || !['465', '587'].includes(env.SMTP_PORT!) ||
      !isEmail(env.SMTP_FROM!) || !isEmail(env.CONTACT_TO!) ||
      env.TURNSTILE_EXPECTED_HOSTNAME!.length > 253 || !hostnamePattern.test(env.TURNSTILE_EXPECTED_HOSTNAME!) ||
      !/^[a-zA-Z0-9_-]{1,32}$/.test(env.TURNSTILE_EXPECTED_ACTION!)) throw new Error('Invalid configuration');
  // Never permit Cloudflare's public test secret in production.
  if (env.NODE_ENV === 'production' && /^([123])x0{8}/.test(env.TURNSTILE_SECRET_KEY!)) throw new Error('Test key');
  return {
    smtp: {
      host: env.SMTP_HOST!, port: Number(env.SMTP_PORT),
      secure: env.SMTP_PORT === '465', requireTLS: env.SMTP_PORT === '587',
      auth: { user: env.SMTP_USER!, pass: env.SMTP_PASS! },
      tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
      dnsTimeout: 5_000, logger: false, debug: false,
      disableFileAccess: true, disableUrlAccess: true,
    } satisfies SMTPTransport.Options,
    from: env.SMTP_FROM!, to: env.CONTACT_TO!, secret: env.TURNSTILE_SECRET_KEY!,
    hostname: env.TURNSTILE_EXPECTED_HOSTNAME!, action: env.TURNSTILE_EXPECTED_ACTION!,
  };
}

function validate(input: unknown) {
  if (!(input instanceof FormData)) throw new Error('Invalid form');
  const limits = { name: 100, email: 254, message: 5000, website: 200, 'cf-turnstile-response': 2048 };
  // Require exactly one string per field, disallow files and unexpected fields.
  for (const [key] of input) if (!Object.hasOwn(limits, key)) throw new Error('Invalid field');
  const values: Record<string, string> = {};
  let bytes = 0;
  for (const [key, limit] of Object.entries(limits)) {
    const entries = input.getAll(key);
    if (entries.length !== 1 || typeof entries[0] !== 'string' || entries[0].length > limit) throw new Error('Invalid field');
    bytes += Buffer.byteLength(entries[0], 'utf8');
    values[key] = entries[0];
  }
  if (bytes > 24_000 || values.website !== '') throw new Error('Invalid form');
  // Names permit Unicode letters, accents, spaces, apostrophes, periods and hyphens.
  if (/[\r\n]/.test(values.name) || !/^[\p{L}\p{M} .’'\-]+$/u.test(values.name) || !/\p{L}/u.test(values.name) || values.name.trim().length < 2) throw new Error('Invalid name');
  if (!isEmail(values.email)) throw new Error('Invalid email');
  const message = values.message.replace(/\r\n?/g, '\n').trim();
  if (message.length < 10 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) throw new Error('Invalid message');
  if (!/^[A-Za-z0-9_.-]{1,2048}$/.test(values['cf-turnstile-response'])) throw new Error('Invalid token');
  return { name: values.name.trim(), email: values.email, message, token: values['cf-turnstile-response'] };
}

export function createContactHandler(dependencies: Dependencies) {
  // Bounded, process-local safeguards. No IP, personal data or raw tokens retained.
  const tokens = new Map<string, number>();
  let windowStart = 0;
  let attempts = 0;
  let verificationsInFlight = 0;
  return async (input: unknown): Promise<ContactResult> => {
    try {
      const values = validate(input);
      const config = configuration(dependencies.env());
      const now = (dependencies.now ?? Date.now)();
      if (now - windowStart >= 60_000) { windowStart = now; attempts = 0; }
      if (attempts >= 10) return { error: CONTACT_ERROR };
      for (const [hash, expiry] of tokens) if (expiry <= now) tokens.delete(hash);
      const hash = createHash('sha256').update(values.token).digest('hex');
      if (tokens.has(hash) || tokens.size >= 1000) return { error: CONTACT_ERROR };
      // Invalid tokens must not exhaust the shared SMTP budget. Bound Siteverify work separately.
      if (verificationsInFlight >= 4) return { error: CONTACT_ERROR };
      tokens.set(hash, now + 300_000); // Claim before awaiting Siteverify; reject local concurrent reuse.
      verificationsInFlight++;
      let verified = false;
      try {
        const response = await dependencies.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST', body: new URLSearchParams({ secret: config.secret, response: values.token }),
          signal: AbortSignal.timeout(5000), cache: 'no-store', redirect: 'error',
        });
        if (!response.ok) return { error: CONTACT_ERROR };
        const verification: unknown = await response.json();
        if (!verification || typeof verification !== 'object' || !('success' in verification) || verification.success !== true ||
            !('hostname' in verification) || verification.hostname !== config.hostname ||
            !('action' in verification) || verification.action !== config.action) return { error: CONTACT_ERROR };
        verified = true;
      } finally {
        verificationsInFlight--;
        if (!verified) tokens.delete(hash); // Do not retain forged tokens in the bounded replay cache.
      }
      // Recheck after await: several verified requests may race for the last SMTP slot.
      if (attempts >= 10) return { error: CONTACT_ERROR };
      attempts++;
      const transport = dependencies.createTransport(config.smtp);
      try {
        const info = await transport.sendMail({
          from: { name: 'YuyoDev', address: config.from }, to: config.to, replyTo: values.email,
          subject: 'Nuevo contacto desde YuyoDev',
          text: `Nombre: ${values.name}\nEmail: ${values.email}\n\nMensaje:\n${values.message}`,
          html: `<h3>Nuevo contacto desde YuyoDev</h3><p><strong>Nombre:</strong> ${escapeHTML(values.name)}</p><p><strong>Email:</strong> ${escapeHTML(values.email)}</p><p><strong>Mensaje:</strong><br>${escapeHTML(values.message).replace(/\n/g, '<br>')}</p>`,
          disableFileAccess: true, disableUrlAccess: true,
        });
        if (info.accepted.length !== 1 || info.rejected.length !== 0) return { error: CONTACT_ERROR };
        return { success: true };
      } finally { transport.close(); }
    } catch {
      // Never log provider exceptions: they can contain credentials or personal data.
      return { error: CONTACT_ERROR };
    }
  };
}
