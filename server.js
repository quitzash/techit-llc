const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const SITE = {
  title: 'Techit LLC — Powering Next-Generation Digital Ecosystems',
  description:
    'Techit LLC is the holding enterprise backing leading regional platforms in e-commerce, business optimization, and enterprise gateways.',
  email: 'info@techit-llc.com',
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Security + performance ----
// Hardened headers (helmet), gzip (compression).
// Content-Security-Policy is disabled here because the page deliberately uses
// inline styles/scripts and loads remote images + Google Fonts. Tighten it in
// production by replacing the external sources with self-hosted equivalents.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// ---- Library assets, served from node_modules so nothing hits a CDN ----
app.use('/vendor/gsap', express.static(path.join(__dirname, 'node_modules/gsap/dist')));
app.use('/vendor/lenis', express.static(path.join(__dirname, 'node_modules/lenis/dist')));
app.use('/vendor/lucide', express.static(path.join(__dirname, 'node_modules/lucide/dist')));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// ---- Home page (server-rendered) ----
app.get('/', (req, res) => {
  const lang = typeof req.query.lang === 'string' && req.query.lang === 'ar' ? 'ar' : 'en';
  res.render('index', {
    ...SITE,
    lang,
    year: new Date().getFullYear(),
  });
});

// ---- Contact form API ----
// Validates and (when SMTP is configured via .env) emails the message.
// Without SMTP credentials it simply logs the submission server-side, so the
// app is fully functional out of the box. The frontend falls back to the
// visitor's mail client if this endpoint ever fails.
app.post('/api/contact', (req, res) => {
  const name = String((req.body && req.body.name) || '').trim().slice(0, 120);
  const email = String((req.body && req.body.email) || '').trim().slice(0, 200);
  const message = String((req.body && req.body.message) || '').trim().slice(0, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' });
  }

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
      .then(() => res.json({ ok: true, mode: 'email' }))
      .catch((err) => {
        console.error('[contact] email send failed:', err.message);
        res.status(500).json({ ok: false, error: 'Email could not be sent.' });
      });
  }

  // No SMTP configured -> log the submission.
  console.log(`[contact] from=${email} name=${name} msg=${message.replace(/\s+/g, ' ')}`);
  res.json({ ok: true, mode: 'logged' });
});

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render('404', { ...SITE, year: new Date().getFullYear() });
});

app.listen(PORT, () => {
  console.log(`Techit LLC running  →  http://localhost:${PORT}`);
});