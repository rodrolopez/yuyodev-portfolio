import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_ERROR, createContactHandler } from '../contact-service';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type Mail from 'nodemailer/lib/mailer';

const environment = {
  SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'smtp-account', SMTP_PASS: 'mock-password',
  SMTP_FROM: 'sender@example.com', CONTACT_TO: 'recipient@example.com', TURNSTILE_SECRET_KEY: 'mock-secret',
  TURNSTILE_EXPECTED_HOSTNAME: 'portfolio.example.com', TURNSTILE_EXPECTED_ACTION: 'contact', NODE_ENV: 'production',
};
function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: "María O'Connor", email: 'visitor@example.com', message: 'Necesito desarrollar un proyecto.\nGracias.', website: '', 'cf-turnstile-response': 'mock-token' })) data.set(key, value);
  return data;
}
function fixture(options: {
  env?: Record<string, string | undefined>; verification?: unknown; httpStatus?: number;
  fetchError?: boolean; smtpError?: boolean; accepted?: string[]; rejected?: string[];
} = {}) {
  const messages: Mail.Options[] = [];
  const transports: SMTPTransport.Options[] = [];
  const requests: RequestInit[] = [];
  let closed = 0;
  let now = 1_000_000;
  const handler = createContactHandler({
    env: () => ({ ...environment, ...options.env }), now: () => now,
    fetch: async (url, init) => {
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      requests.push(init!);
      assert.ok(init?.signal instanceof AbortSignal);
      if (options.fetchError) throw new Error('sensitive provider failure');
      return new Response(JSON.stringify(options.verification ?? { success: true, hostname: environment.TURNSTILE_EXPECTED_HOSTNAME, action: 'contact' }), { status: options.httpStatus ?? 200 });
    },
    createTransport: smtp => {
      transports.push(smtp);
      return {
        sendMail: async message => {
          messages.push(message);
          if (options.smtpError) throw new Error('sensitive SMTP failure');
          return { accepted: options.accepted ?? [environment.CONTACT_TO], rejected: options.rejected ?? [] };
        }, close: () => { closed++; },
      };
    },
  });
  return { handler, messages, transports, requests, closed: () => closed, advance: () => { now += 60_001; } };
}
const failure = { error: CONTACT_ERROR };

test('rejects malformed types and missing/duplicate/file/unknown fields before network access', async () => {
  const f = fixture();
  for (const value of [null, {}, 'bad', 1]) assert.deepEqual(await f.handler(value), failure);
  for (const key of ['name', 'email', 'message', 'website', 'cf-turnstile-response']) {
    const missing = form(); missing.delete(key);
    assert.deepEqual(await f.handler(missing), failure);
    const duplicate = form(); duplicate.append(key, 'duplicate');
    assert.deepEqual(await f.handler(duplicate), failure);
    const file = form(); file.set(key, new Blob(['file']), 'file.txt');
    assert.deepEqual(await f.handler(file), failure);
  }
  const unknown = form(); unknown.set('extra', 'value');
  assert.deepEqual(await f.handler(unknown), failure);
  assert.equal(f.requests.length, 0); assert.equal(f.messages.length, 0);
});

test('validates lengths, controls, headers, email, names, honeypot and token', async () => {
  const f = fixture();
  for (const [key, value] of [
    ['name', 'A'], ['name', ' '], ['name', '123'], ['name', '<script>'], ['name', 'a'.repeat(101)],
    ['name', 'Ana\r\nBcc: victim@example.com'], ['email', 'x@example.com\r\nBcc: x@example.com'],
    ['email', 'Name <x@example.com>'], ['email', 'a..b@example.com'], ['email', 'x@-example.com'],
    ['email', `${'x'.repeat(65)}@example.com`], ['message', 'short'], ['message', 'a'.repeat(5001)],
    ['message', 'invalid\0message'], ['website', 'https://spam.example.com'],
    ['cf-turnstile-response', ''], ['cf-turnstile-response', 't'.repeat(2049)], ['cf-turnstile-response', '\nforged'],
  ]) {
    const data = form(); data.set(key, value);
    assert.deepEqual(await f.handler(data), failure, key);
  }
  assert.equal(f.requests.length, 0);
});

test('escapes malicious HTML and keeps safe plain text and line breaks', async () => {
  const f = fixture(); const data = form();
  const malicious = '<img src=x onerror="alert(1)">\r\n<script>bad & dangerous</script>\'text';
  data.set('message', malicious);
  assert.deepEqual(await f.handler(data), { success: true });
  const mail = f.messages[0];
  assert.ok(String(mail.text).includes(malicious.replace(/\r\n/g, '\n')));
  assert.ok(String(mail.html).includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;<br>&lt;script&gt;'));
  assert.ok(String(mail.html).includes('&amp; dangerous&lt;/script&gt;&#39;'));
  assert.ok(!String(mail.html).includes('<img'));
  assert.equal(mail.subject, 'Nuevo contacto desde YuyoDev');
  assert.equal(mail.replyTo, 'visitor@example.com');
  assert.equal(mail.to, 'recipient@example.com');
  assert.deepEqual(mail.from, { name: 'YuyoDev', address: 'sender@example.com' });
});

test('missing or malformed config always fails closed without contacting providers', async () => {
  for (const key of Object.keys(environment).filter(key => key !== 'NODE_ENV')) {
    const f = fixture({ env: { [key]: '' } });
    assert.deepEqual(await f.handler(form()), failure); assert.equal(f.requests.length, 0);
  }
  for (const env of [
    { SMTP_PORT: '25' }, { SMTP_PORT: '587oops' }, { SMTP_HOST: 'smtp://bad' },
    { SMTP_FROM: 'x@example.com\r\nBcc: y@example.com' }, { CONTACT_TO: 'a@example.com,b@example.com' },
    { TURNSTILE_EXPECTED_HOSTNAME: 'https://example.com' }, { TURNSTILE_EXPECTED_ACTION: 'bad action' },
    { TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' },
  ]) {
    const f = fixture({ env }); assert.deepEqual(await f.handler(form()), failure); assert.equal(f.requests.length, 0);
  }
});

test('TLS is mandatory on both allowed ports and SMTP failures never succeed', async () => {
  for (const port of ['465', '587']) {
    const f = fixture({ env: { SMTP_PORT: port } });
    assert.deepEqual(await f.handler(form()), { success: true });
    const config = f.transports[0];
    assert.equal(config.secure, port === '465'); assert.equal(config.requireTLS, port === '587');
    assert.equal(config.tls?.rejectUnauthorized, true); assert.equal(config.tls?.minVersion, 'TLSv1.2');
    assert.equal(config.logger, false); assert.equal(config.debug, false);
    assert.equal(config.connectionTimeout, 10_000); assert.equal(config.socketTimeout, 20_000);
    assert.equal(f.closed(), 1);
  }
  for (const options of [{ smtpError: true }, { accepted: [] }, { rejected: ['recipient@example.com'] }]) {
    const f = fixture(options); assert.deepEqual(await f.handler(form()), failure); assert.equal(f.closed(), 1);
  }
});

test('Turnstile rejects invalid tokens, hostname/action mismatch, HTTP errors and exceptions/timeouts', async () => {
  for (const options of [
    { verification: { success: false, 'error-codes': ['invalid-input-response'] } },
    { verification: { success: true, hostname: 'attacker.example.com', action: 'contact' } },
    { verification: { success: true, hostname: environment.TURNSTILE_EXPECTED_HOSTNAME, action: 'login' } },
    { verification: { success: 'true' } }, { verification: [] }, { httpStatus: 503 }, { fetchError: true },
  ]) {
    const f = fixture(options); assert.deepEqual(await f.handler(form()), failure); assert.equal(f.messages.length, 0);
  }
});

test('Siteverify receives only secret/token and an enforced timeout', async () => {
  const f = fixture(); await f.handler(form()); const init = f.requests[0];
  assert.equal(init.method, 'POST'); assert.equal(init.cache, 'no-store'); assert.equal(init.redirect, 'error');
  assert.deepEqual([...new URLSearchParams(init.body as URLSearchParams)], [['secret', 'mock-secret'], ['response', 'mock-token']]);
});

test('concurrent and sequential token reuse are rejected locally', async () => {
  const f = fixture(); const results = await Promise.all([f.handler(form()), f.handler(form())]);
  assert.equal(results.filter(result => 'success' in result).length, 1);
  assert.deepEqual(await f.handler(form()), failure); assert.equal(f.messages.length, 1);
});

test('bounded process rate budget rejects request 11 and recovers after a minute', async () => {
  const f = fixture();
  for (let i = 0; i < 11; i++) {
    const data = form(); data.set('cf-turnstile-response', `token-${i}`);
    assert.deepEqual(await f.handler(data), i < 10 ? { success: true } : failure);
  }
  assert.equal(f.requests.length, 10); f.advance();
  const data = form(); data.set('cf-turnstile-response', 'fresh-token');
  assert.deepEqual(await f.handler(data), { success: true });
});

test('Siteverify aborts at the configured timeout and malformed JSON fails closed', async t => {
  t.mock.method(AbortSignal, 'timeout', (milliseconds: number) => {
    assert.equal(milliseconds, 5000);
    return AbortSignal.abort(new DOMException('Timed out', 'TimeoutError'));
  });
  for (const malformed of [false, true]) {
    let smtpCalls = 0;
    const handler = createContactHandler({
      env: () => environment,
      fetch: async (_url, init) => {
        if (!malformed) init!.signal!.throwIfAborted();
        return new Response('not JSON');
      },
      createTransport: () => { smtpCalls++; throw new Error('SMTP must not be reached'); },
    });
    assert.deepEqual(await handler(form()), failure);
    assert.equal(smtpCalls, 0);
  }
});

test('forged tokens do not exhaust the shared SMTP budget', async () => {
  let checks = 0;
  let sends = 0;
  const handler = createContactHandler({
    env: () => environment,
    fetch: async () => new Response(JSON.stringify({ success: ++checks > 20, hostname: environment.TURNSTILE_EXPECTED_HOSTNAME, action: 'contact' })),
    createTransport: () => ({ sendMail: async () => { sends++; return { accepted: [environment.CONTACT_TO], rejected: [] }; }, close: () => {} }),
  });
  for (let i = 0; i < 21; i++) {
    const data = form(); data.set('cf-turnstile-response', `token-${i}`);
    assert.deepEqual(await handler(data), i < 20 ? failure : { success: true });
  }
  assert.equal(sends, 1);
});

test('Siteverify concurrency is bounded and slots are released after failures', async () => {
  const rejectors: Array<(error: Error) => void> = [];
  let requests = 0;
  const handler = createContactHandler({
    env: () => environment,
    fetch: async () => { requests++; return new Promise<Response>((_resolve, reject) => rejectors.push(reject)); },
    createTransport: () => { throw new Error('SMTP must not be reached'); },
  });
  const submit = (i: number) => { const data = form(); data.set('cf-turnstile-response', `token-${i}`); return handler(data); };
  const pending = [0, 1, 2, 3].map(submit);
  assert.equal(requests, 4);
  assert.deepEqual(await submit(4), failure);
  assert.equal(requests, 4);
  rejectors.forEach(reject => reject(new Error('mock timeout')));
  assert.deepEqual(await Promise.all(pending), [failure, failure, failure, failure]);
  const retry = submit(5); assert.equal(requests, 5);
  rejectors[4](new Error('mock timeout'));
  assert.deepEqual(await retry, failure);
});

test('concurrent verified tokens cannot oversubscribe the SMTP budget', async () => {
  let sends = 0;
  const handler = createContactHandler({
    env: () => environment,
    fetch: async () => new Response(JSON.stringify({ success: true, hostname: environment.TURNSTILE_EXPECTED_HOSTNAME, action: 'contact' })),
    createTransport: () => ({ sendMail: async () => { sends++; return { accepted: [environment.CONTACT_TO], rejected: [] }; }, close: () => {} }),
  });
  const submit = (i: number) => { const data = form(); data.set('cf-turnstile-response', `token-${i}`); return handler(data); };
  for (let i = 0; i < 9; i++) assert.deepEqual(await submit(i), { success: true });
  const results = await Promise.all([submit(9), submit(10), submit(11), submit(12)]);
  assert.equal(results.filter(result => 'success' in result).length, 1);
  assert.equal(sends, 10);
});

test('failed verifications do not retain attacker-controlled replay entries', async () => {
  const f = fixture({ verification: { success: false } });
  assert.deepEqual(await f.handler(form()), failure);
  assert.deepEqual(await f.handler(form()), failure);
  assert.equal(f.requests.length, 2);
  assert.equal(f.messages.length, 0);
});
