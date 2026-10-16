import site from '../../site.js';

// On-demand endpoint — runs as a Vercel Serverless Function.
export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// Validates and (when SMTP is configured via env) emails the message.
// Without SMTP credentials it simply logs the submission server-side, so the
// app is fully functional out of the box. The frontend falls back to the
// visitor's mail client if this endpoint ever fails.
//
// Two response modes:
//   • JSON utilities (fetch/XHR requests) get a JSON payload.
//   • Plain form posts (no-JS visitors) are redirected back to the homepage
//     with ?sent=success|error so the page can relay the outcome.
export async function POST({ request }) {
  const accept = request.headers.get('accept') || '';
  const contentType = request.headers.get('content-type') || '';
  const wantsJson =
    contentType.includes('application/json') || /application\/json/.test(accept);

  const finish = (ok) => {
    if (!wantsJson) {
      return new Response(null, {
        status: 303,
        headers: { Location: `/?sent=${ok ? 'success' : 'error'}#contact` },
      });
    }
    return ok
      ? json({ ok: true, mode: 'logged' })
      : json({ ok: false, error: 'Could not send the message.' }, 400);
  };

  let name = '';
  let email = '';
  let message = '';
  try {
    const raw = await request.text();
    if (contentType.includes('application/json')) {
      const body = JSON.parse(raw || '{}');
      name = body.name;
      email = body.email;
      message = body.message;
    } else {
      const params = new URLSearchParams(raw);
      name = params.get('name');
      email = params.get('email');
      message = params.get('message');
    }
  } catch {
    return finish(false);
  }

  name = String(name || '').trim().slice(0, 120);
  email = String(email || '').trim().slice(0, 200);
  message = String(message || '').trim().slice(0, 4000);

  if (!name || !email || !message) return finish(false);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return finish(false);

  // SMTP configured -> send a real email.
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = (await import('nodemailer')).default;
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_TO || site.email,
        replyTo: email,
        subject: `[techit-llc.com] Contact form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
      return finish(true);
    } catch (err) {
      console.error('[contact] email send failed:', err && err.message);
      return finish(false);
    }
  }

  // No SMTP configured -> log the submission.
  console.log(`[contact] from=${email} name=${name} msg=${message.replace(/\s+/g, ' ')}`);
  return finish(true);
}
