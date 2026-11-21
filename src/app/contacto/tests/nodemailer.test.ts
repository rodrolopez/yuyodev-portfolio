import { test } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';

// Exercise the upgraded library's real rendering/envelope contract without sockets or delivery.
test('Nodemailer 10 renders a safe MIME message in memory, preserving independent addresses', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix', disableFileAccess: true, disableUrlAccess: true });
  try {
    const info = await transport.sendMail({
      from: { name: 'YuyoDev', address: 'sender@example.com' }, to: 'recipient@example.com',
      replyTo: "visitor'o@example.com", subject: 'Nuevo contacto desde YuyoDev',
      text: 'Texto de prueba\nSegunda línea', html: '<p>&lt;script&gt;alert(1)&lt;/script&gt;<br>Segunda línea</p>',
    });
    assert.deepEqual(info.envelope, { from: 'sender@example.com', to: ['recipient@example.com'] });
    const mime = info.message.toString();
    assert.match(mime, /From: YuyoDev <sender@example.com>/);
    assert.match(mime, /To: recipient@example.com/);
    assert.match(mime, /Reply-To: visitor'o@example.com/);
    assert.match(mime, /Content-Type: multipart\/alternative/);
    assert.ok(!mime.includes('<script>'));
  } finally { transport.close(); }
});
