const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const I18N = require('./src/i18n');
const SITE = require('./src/site');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Security + performance ----
// Hardened headers (helmet), gzip (compression).
// Content-Security-Policy is disabled here because the page deliberately uses
// inline styles/scripts and loads remote Google Fonts. Tighten it in
// production by replacing the external sources with self-hosted equivalents.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// ---- Static assets (icons are pre-rendered inline SVGs by scripts/generate-icons.js) ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- Home page (server-rendered, fully localized) ----
app.get('/', (req, res) => {
  const lang = typeof req.query.lang === 'string' && req.query.lang === 'ar' ? 'ar' : 'en';
  const dict = I18N[lang] || I18N.en;
  const sent = req.query.sent === 'success' || req.query.sent === 'error' ? req.query.sent : null;
  res.render('index', {
    ...SITE,
    lang,
    dict,
    sent,
    year: new Date().getFullYear(),
    // Translate helper for EJS templates.
    t: (key) => (dict[key] != null ? dict[key] : key),
    // Full dictionary for the client-side language toggle (both languages).
    i18nJson: JSON.stringify(I18N).replace(/</g, '\\u003c'),
  });
});

// ---- Contact form API ----
// Validates and (when SMTP is configured via .env) emails the message.
// Without SMTP credentials it simply logs the submission server-side, so the
// app is fully functional out of the box. The frontend falls back to the
// visitor's mail client if this endpoint ever fails.
//
// Two response modes:
//   • JSON utilities (fetch/XHR requests) get a JSON payload.
//   • Plain form posts (no-JS visitors) are redirected back to the homepage
//     with ?sent=success|error so the page can relay the outcome.
app.post('/api/contact', (req, res) => {
  // The frontend sends an explicit `Accept: application/json` fetch.
  // Plain browser form posts (no-JS) get a 303 redirect instead.
  const accept = req.get('accept') || '';
  const wantsJson = req.is('application/json') || /application\/json/.test(accept);
  const isHtml = !wantsJson;

  const finish = (ok) => {
    if (!isHtml) return res.json(ok ? { ok: true, mode: 'logged' } : { ok: false, error: 'Could not send the message.' });
    return res.redirect(303, `/?sent=${ok ? 'success' : 'error'}#contact`);
  };

  const name = String((req.body && req.body.name) || '').trim().slice(0, 120);
  const email = String((req.body && req.body.email) || '').trim().slice(0, 200);
  const message = String((req.body && req.body.message) || '').trim().slice(0, 4000);

  if (!name || !email || !message) return finish(false);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return finish(false);

  // SMTP configured -> send a real email.
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    return transport
      .sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_TO || SITE.email,
        replyTo: email,
        subject: `[techit-llc.com] Contact form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      })
      .then(() => finish(true))
      .catch((err) => {
        console.error('[contact] email send failed:', err.message);
        finish(false);
      });
  }

  // No SMTP configured -> log the submission.
  console.log(`[contact] from=${email} name=${name} msg=${message.replace(/\s+/g, ' ')}`);
  return finish(true);
});

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render('404', { ...SITE, year: new Date().getFullYear() });
});

app.listen(PORT, () => {
  console.log(`Techit LLC running  →  http://localhost:${PORT}`);
});