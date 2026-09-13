// ============================================================
//  Techit LLC — app logic
//  i18n, smooth scroll, animations, hover interactions, contact
// ============================================================

// ---- Render Lucide icons ----
lucide.createIcons();

// ---- Year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Arabic / English translation toggle ----
const I18N = {
  en: {
    "meta-title": "Techit LLC — Powering Next-Generation Digital Ecosystems",
    "meta-desc": "Techit LLC is the holding enterprise backing leading regional platforms in e-commerce, business optimization, and enterprise gateways.",
    "nav-about": "About",
    "nav-platforms": "Platforms",
    "nav-pillars": "Pillars",
    "nav-contact": "Contact",
    "hero-badge": "Holding Enterprise · Regional Digital Platforms",
    "hero-title": `Powering <span class="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent shimmer">Next-Generation</span><br class="hidden sm:block" />Digital Ecosystems.`,
    "hero-paragraph": "Techit LLC is the holding enterprise backing leading regional platforms in e-commerce, business optimization, and enterprise gateways.",
    "hero-cta": "Explore the Ecosystem",
    "about-kicker": "Company Overview",
    "about-title": `One holding,<br />many platforms,<br /><span class="text-white/50">unified purpose.</span>`,
    "about-p1": "Techit LLC is a technology incubation and holding enterprise committed to operational reliability and sustained platform growth. We conceive, back, and scale specialized digital products that move real value across the region.",
    "about-p2": "From on-the-go coffee ordering to hourly hotel booking and secure enterprise gateways, each subsidiary operates with its own focus — while sharing the infrastructure, governance, and long-term vision of the Techit umbrella.",
    "wfrlee-name": "Wfrlee.com",
    "wfrlee-tagline": "Hotels, booked by the hours.",
    "wfrlee-desc": "Book short stays with flexible hourly rates. Pay only for the time you use — no need to pay for a full night.",
    "wfrlee-c1": "Flexible hourly-rate booking",
    "wfrlee-c2": "Pay-as-you-stay pricing",
    "wfrlee-c3": "Instant short-stay scheduling",
    "wfrlee-visit": "Visit wfrlee.com",
    "wfrlee-label": "Hourly Hotel Booking",
    "wfrlee-idea": "The idea: you rarely need a whole night. Wfrlee lets you book a hotel room for the exact hours you need and pay only for those hours — not the full day.",
    "wfrlee-step1": `<span class="text-white font-semibold">Search</span> — find a hotel and choose your hours (3–24h).`,
    "wfrlee-step2": `<span class="text-white font-semibold">Book hourly</span> — pay per hour, no full-night charge.`,
    "wfrlee-step3": `<span class="text-white font-semibold">Stay &amp; go</span> — check in instantly, check out on your time.`,
    "wfrlee-badge": "Currently available in Saudi Arabia",
    "oneegate-tagline": "One gateway for the enterprise.",
    "oneegate-desc": "Managing enterprise-level central gateways, institutional access systems, and secure infrastructure tools.",
    "oneegate-c1": "Central enterprise gateways",
    "oneegate-c2": "Institutional access systems",
    "oneegate-c3": "Secure infrastructure tools",
    "oneegate-visit": "Visit oneegate.com",
    "oneegate-label": "Enterprise Gateway",
    "oneegate-idea": "The idea: institutions shouldn't juggle a dozen logins and systems. OneEGate is a single, secure front door for enterprise access, teams, and infrastructure.",
    "oneegate-step1": `<span class="text-white font-semibold">Centralize</span> — one secure gateway for all institutional systems.`,
    "oneegate-step2": `<span class="text-white font-semibold">Control access</span> — define who reaches what, policy-driven.`,
    "oneegate-step3": `<span class="text-white font-semibold">Operate securely</span> — infrastructure protected at the core.`,
    "sabaah-tagline": "Coffee, ordered on the go.",
    "sabaah-desc": "Order your coffee from anywhere — browse nearby cafés, skip the queue, and have your brew ready the moment you arrive.",
    "sabaah-c1": "Order ahead from nearby cafés",
    "sabaah-c2": "Skip the queue with fast pickup",
    "sabaah-c3": "Streamlined mobile ordering pipeline",
    "sabaah-visit": "Visit sabaah.net",
    "sabaah-label": "On-the-Go Coffee",
    "sabaah-idea": "The idea: instead of queuing at a café, order before you're even there. Sabaah connects you to nearby cafés and has your drink ready on arrival.",
    "sabaah-step1": `<span class="text-white font-semibold">Discover</span> — browse cafés near you and pick a drink.`,
    "sabaah-step2": `<span class="text-white font-semibold">Order ahead</span> — pay in app and the café starts your brew.`,
    "sabaah-step3": `<span class="text-white font-semibold">Skip the queue</span> — walk in and grab your ready cup.`,
    "pillars-kicker": "Core Pillars",
    "pillars-title": "What we stand on.",
    "pillars-1-title": "Scalability",
    "pillars-1-desc": "Architectures engineered to grow from first user to full regional scale without breaking stride.",
    "pillars-2-title": "Unified Integration",
    "pillars-2-desc": "Platforms that connect cleanly — shared data, shared standards, and one cohesive ecosystem experience.",
    "pillars-3-title": "Enterprise Security",
    "pillars-3-desc": "Institutional-grade protection embedded at the core of every gateway and access system we operate.",
    "contact-kicker": "Contact Us",
    "contact-title": `Let's build <span class="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent shimmer">together.</span>`,
    "contact-desc": "Whether you're a partner, a business exploring our platforms, or a team looking to grow under the Techit umbrella — we'd love to hear from you.",
    "contact-email-label": "Email",
    "form-name": "Name",
    "form-email": "Email",
    "form-message": "Message",
    "form-submit": "Send Message",
    "form-name-ph": "Your name",
    "form-email-ph": "you@company.com",
    "form-message-ph": "How can we help?",
    "form-sending": "Sending…",
    "form-success": `Thanks {name} — your message has been sent.`,
    "form-mailto": `Thanks {name} — your message is ready. Opening your mail app…`,
    "form-error": "Something went wrong — please email us directly at info@techit-llc.com.",
    "footer-tagline": "Holding the platforms powering regional digital ecosystems.",
    "footer-company": "Company",
    "footer-platforms": "Platforms",
    "footer-contact": "Contact",
    "footer-rights": `© <span id="year"></span> Techit LLC. All rights reserved.`,
  },

  ar: {
    "meta-title": "تيكيت LLC — نقود النظم الرقمية للجيل القادم",
    "meta-desc": "تيكيت هي الشركة القابضة الداعمة لأبرز المنصات الإقليمية في التجارة الإلكترونية وتحسين الأعمال وبوابات المؤسسات.",
    "nav-about": "عن الشركة",
    "nav-platforms": "المنصات",
    "nav-pillars": "الركائز",
    "nav-contact": "تواصل معنا",
    "hero-badge": "شركة قابضة · منصات رقمية إقليمية",
    "hero-title": `نقود <span class="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent shimmer">الجيل القادم</span><br class="hidden sm:block" /> من النظم الرقمية.`,
    "hero-paragraph": "تيكيت هي الشركة القابضة التي تقف خلف أبرز المنصات الإقليمية في التجارة الإلكترونية وتحسين الأعمال وبوابات المؤسسات.",
    "hero-cta": "استكشف المنظومة",
    "about-kicker": "نبذة عامة",
    "about-title": `شركة واحدة،<br />منصات متعددة،<br /><span class="text-white/50">هدف موحّد.</span>`,
    "about-p1": "تيكيت هي مؤسسة احتضان تقني وشركة قابضة ملتزمة بالموثوقية التشغيلية والنمو المستدام للمنصات. نبتكر ونموّل ونوسّع منتجات رقمية متخصصة تنقل قيمة حقيقية في المنطقة.",
    "about-p2": "من طلب القهوة أثناء التنقّل إلى حجز الفنادق بالساعة وبوابات المؤسسات الآمنة، تعمل كل شركة تابعة بتركيزها الخاص — مع مشاركة البنية التحتية والحوكمة والرؤية طويلة الأجل لمظلة تيكيت.",
    "wfrlee-name": "Wfrlee.com",
    "wfrlee-tagline": "فنادق تُحجز بالساعة.",
    "wfrlee-desc": "احجز إقامات قصيرة بأسعار مرنة بالساعة. ادفع فقط مقابل الوقت الذي تستخدمه — دون الحاجة لدفع قيمة ليلة كاملة.",
    "wfrlee-c1": "حجز مرن بأسعار الساعة",
    "wfrlee-c2": "تسعير الدفع حسب الإقامة",
    "wfrlee-c3": "جدولة فورية للإقامات القصيرة",
    "wfrlee-visit": "زيارة wfrlee.com",
    "wfrlee-label": "حجز الفنادق بالساعة",
    "wfrlee-idea": "الفكرة: نادرًا ما تحتاج ليلة كاملة. يتيح لك وفرلي حجز غرفة فندقية للساعات التي تحتاجها بالضبط والدفع فقط لتلك الساعات — لا ليوم كامل.",
    "wfrlee-step1": `<span class="text-white font-semibold">ابحث</span> — اعثر على فندق واختر ساعاتك (3–24 ساعة).`,
    "wfrlee-step2": `<span class="text-white font-semibold">احجز بالساعة</span> — ادفع لكل ساعة دون رسوم الليلة الكاملة.`,
    "wfrlee-step3": `<span class="text-white font-semibold">تقم وانطلق</span> — تسجيل دخول فوري ومغادرة في وقتك.`,
    "wfrlee-badge": "متاح حاليًا في المملكة العربية السعودية",
    "oneegate-tagline": "بوابة واحدة للمؤسسة.",
    "oneegate-desc": "إدارة بوابات مركزية على مستوى المؤسسات، وأنظمة وصول مؤسسية، وأدوات بنية تحتية آمنة.",
    "oneegate-c1": "بوابات مركزيّة للمؤسسات",
    "oneegate-c2": "أنظمة وصول مؤسسية",
    "oneegate-c3": "أدوات بنية تحتية آمنة",
    "oneegate-visit": "زيارة oneegate.com",
    "oneegate-label": "بوابة المؤسسات",
    "oneegate-idea": "الفكرة: لا ينبغي أن تتخبّط المؤسسات بين عشرات الأنظمة وتسجيلات الدخول. ون إيغيت هي بوابة واحدة آمنة للوصول المؤسسي والفرق والبنية التحتية.",
    "oneegate-step1": `<span class="text-white font-semibold">وحّد</span> — بوابة آمنة واحدة لجميع الأنظمة المؤسسية.`,
    "oneegate-step2": `<span class="text-white font-semibold">تحكّم في الوصول</span> — حدّد من يصل إلى ماذا وفق السياسات.`,
    "oneegate-step3": `<span class="text-white font-semibold">شغّل بأمان</span> — بنية تحتية محمية من الجوهر.`,
    "sabaah-tagline": "قهوة تُطلب أثناء التنقّل.",
    "sabaah-desc": "اطلب قهوتك من أي مكان — تصفّح المقاهي القريبة، وتجاوز الطوابير، واجد مشروبك جاهزًا فور وصولك.",
    "sabaah-c1": "اطلب مسبقًا من المقاهي القريبة",
    "sabaah-c2": "تجاوز الطابور مع استلام سريع",
    "sabaah-c3": "مسار طلب جوال مبسّط",
    "sabaah-visit": "زيارة sabaah.net",
    "sabaah-label": "قهوة أثناء التنقّل",
    "sabaah-idea": "الفكرة: بدلًا من الانتظار في المقهى، اطلب قبل وصولك. يوصلك صباح بالمقاهي القريبة ويجهّز مشروبك عند وصولك.",
    "sabaah-step1": `<span class="text-white font-semibold">اكتشف</span> — تصفّح المقاهي القريبة واختر مشروبك.`,
    "sabaah-step2": `<span class="text-white font-semibold">اطلب مسبقًا</span> — ادفع من التطبيق ليبدأ المقهى بتحضير مشروبك.`,
    "sabaah-step3": `<span class="text-white font-semibold">تجاوز الطابور</span> — ادخل وخذ كوبك الجاهز.`,
    "pillars-kicker": "الركائز الأساسية",
    "pillars-title": "ما الذي نرتكز عليه.",
    "pillars-1-title": "قابلية التوسّع",
    "pillars-1-desc": "أبنية هندسية مصممة لتنمو من المستخدم الأول إلى النطاق الإقليمي الكامل دون كسر الخطوة.",
    "pillars-2-title": "تكامل موحّد",
    "pillars-2-desc": "منصات تتصل بسلاسة — بيانات مشتركة ومعايير موحدة وتجربة منظومة متكاملة واحدة.",
    "pillars-3-title": "أمن المؤسسات",
    "pillars-3-desc": "حماية بمستوى المؤسسات مدمجة في صميم كل بوابة ونظام وصول نديره.",
    "contact-kicker": "تواصل معنا",
    "contact-title": `لنبنِ <span class="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent shimmer">معًا.</span>`,
    "contact-desc": "سواء كنت شريكًا، أو نشاطًا تجاريًا يستكشف منصاتنا، أو فريقًا يتطلع للنمو تحت مظلة تيكيت — يسعدنا أن نسمع منك.",
    "contact-email-label": "البريد الإلكتروني",
    "form-name": "الاسم",
    "form-email": "البريد الإلكتروني",
    "form-message": "الرسالة",
    "form-submit": "إرسال الرسالة",
    "form-name-ph": "اسمك",
    "form-email-ph": "بريدك@p.com",
    "form-message-ph": "كيف يمكننا مساعدتك؟",
    "form-sending": "جارٍ الإرسال…",
    "form-success": `شكرًا {name} — تم إرسال رسالتك.`,
    "form-mailto": `شكرًا {name} — رسالتك جاهزة. نفتح تطبيق البريد…`,
    "form-error": "حدث خطأ ما — يرجى مراسلتنا مباشرة على info@techit-llc.com.",
    "footer-tagline": "نحمل المنصات التي تقوّي النظم الرقمية الإقليمية.",
    "footer-company": "الشركة",
    "footer-platforms": "المنصات",
    "footer-contact": "التواصل",
    "footer-rights": `© <span id="year"></span> تيكيت. جميع الحقوق محفوظة.`,
  },
};

// Allow `?lang=ar` to seed the language preference (e.g. from the server render).
try {
  const qLang = new URLSearchParams(window.location.search).get('lang');
  if (qLang === 'en' || qLang === 'ar') localStorage.setItem('techit-lang', qLang);
} catch (e) {}

let currentLang = 'en';
try { currentLang = localStorage.getItem('techit-lang') || 'en'; } catch (e) {}

const t = (key, vars) => {
  const dict = I18N[currentLang] || I18N.en;
  let str = dict[key] != null ? dict[key] : key;
  if (vars) Object.keys(vars).forEach(k => { str = str.split('{' + k + '}').join(vars[k]); });
  return str;
};

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  const isAr = lang === 'ar';
  document.documentElement.lang = isAr ? 'ar' : 'en';
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-ar', isAr);
  document.title = dict['meta-title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', dict['meta-desc']);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) el.placeholder = dict[key];
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = isAr ? 'EN' : 'عربي';
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('techit-lang', currentLang); } catch (e) {}
    applyLang(currentLang);
  });
}
applyLang(currentLang);

// ---- Contact form ----
// Posts to /api/contact; if the request fails (e.g. server unreachable) it
// falls back to the visitor's mail client via a mailto: link.
const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const showStatus = (msg, isError) => {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.classList.remove('hidden');
  statusEl.classList.toggle('text-red-400', !!isError);
  statusEl.classList.toggle('text-emerald-400', !isError);
};

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const payload = {
      name: contactForm.querySelector('[name="name"]').value.trim(),
      email: contactForm.querySelector('[name="email"]').value.trim(),
      message: contactForm.querySelector('[name="message"]').value.trim(),
    };
    if (!payload.name || !payload.email || !payload.message) return;

    showStatus(t('form-sending'), false);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json().catch(() => ({ ok: false })))
      .then(data => {
        if (data && data.ok) {
          showStatus(t('form-success', { name: payload.name }), false);
          contactForm.reset();
        } else {
          throw new Error(data && data.error ? data.error : 'contact failed');
        }
      })
      .catch(() => {
        // Fallback: open the visitor's mail client (original behavior).
        showStatus(t('form-mailto', { name: payload.name }), false);
        window.location.href = 'mailto:info@techit-llc.com?subject=' +
          encodeURIComponent('Contact from techit-llc.com') +
          '&body=' + encodeURIComponent(payload.message);
        contactForm.reset();
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        setTimeout(() => statusEl && statusEl.classList.add('hidden'), 9000);
      });
  });
}

// ============================================================
//  Smooth scroll + scroll-driven animation
// ============================================================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Lenis smooth scroll ----
if (!prefersReduced) {
  const lenis = new Lenis({
    duration: 0.8,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  lenis.stop();
  function raf(time) {
    lenis.raf(time);
    if (window.ScrollTrigger) ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  requestAnimationFrame(() => lenis.start());

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80, duration: 1.1 });
      }
    });
  });

  const navbar = document.getElementById('navbar');
  let lastY = 0;
  lenis.on('scroll', () => {
    const y = window.scrollY;
    if (y > 120 && y > lastY) navbar.classList.add('nav-hidden');
    else navbar.classList.remove('nav-hidden');
    lastY = y;
  });
}

if (!prefersReduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Soft fade-in: single trigger per element, fires once, freed immediately.
  // (Hero uses its own staggered entrance; tilt-cards get their own fade below.)
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el.closest('#hero')) return;
    if (el.classList.contains('tilt-card')) return;
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // ---------------------------------------------------------
  //  HERO ENTRANCE — staggered reveal with spring feel
  // ---------------------------------------------------------
  const heroReveal = (selector, y, delay) => {
    gsap.fromTo(selector,
      { y, opacity: 0, transformPerspective: 800, rotateX: 4 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'power3.out', delay }
    );
  };
  heroReveal('#hero span[data-reveal]', 20, 0.1);
  heroReveal('#hero h1[data-reveal]', 40, 0.3);
  heroReveal('#hero p[data-reveal]', 30, 0.55);
  heroReveal('#hero .mt-10', 35, 0.8);
  gsap.fromTo('#hologram-wrap',
    { y: 30, opacity: 0, transformPerspective: 800, rotateX: 4 },
    { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'power3.out', delay: 0.9, clearProps: 'transform' }
  );

  // Scroll-cue fades in after hero loads
  gsap.fromTo('.scroll-cue',
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'power2.out' }
  );
}

// ============================================================
//  Reveal-on-scroll animations (simple, smooth fades only)
// ============================================================
if (!prefersReduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance handled above; this block handles scroll-driven reveals

  // ============================================================
  //  SCROLL-DRIVEN 3D REVEALS (perspective flips + rise)
  // ============================================================
  const noTransition = el => {
    const prev = el.style.transition;
    el.style.transition = 'none';
    return () => { el.style.transition = prev || ''; };
  };

  // Content panels tilt in from their stored angle (data-3d-rx / data-3d-ry)
  document.querySelectorAll('[data-3d-reveal]').forEach(el => {
    const restore = noTransition(el);
    const rx = parseFloat(el.dataset['3dRx'] || '16');
    const ry = parseFloat(el.dataset['3dRy'] || '0');
    gsap.fromTo(el,
      { opacity: 0, transformPerspective: 1100, rotateX: rx, rotateY: ry, y: 44 },
      {
        opacity: 1, rotateX: 0, rotateY: 0, y: 0,
        duration: 1.1,
        ease: 'power3.out',
        onComplete: restore,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Platform header logos — 3D flip open on scroll
  document.querySelectorAll('#platforms img.logo-hover').forEach(img => {
    const restore = noTransition(img);
    gsap.fromTo(img,
      { opacity: 0, transformPerspective: 600, rotateY: 90, scale: 0.9 },
      {
        opacity: 1, rotateY: 0, scale: 1,
        duration: 0.9,
        ease: 'back.out(1.6)',
        onComplete: restore,
        scrollTrigger: { trigger: img, start: 'top 90%', once: true }
      }
    );
  });

  // Platform intro columns — content lifts in with a 3D stagger
  document.querySelectorAll('#platforms [data-reveal]:not(.tilt-card)').forEach(col => {
    gsap.fromTo(col.children,
      { opacity: 0, transformPerspective: 1000, rotateX: 22, y: 30 },
      {
        opacity: 1, rotateX: 0, y: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: col, start: 'top 88%', once: true }
      }
    );
  });

  // Numbered step rows fade in (no tilt — numbers stay flat)
  document.querySelectorAll('.step-item').forEach(item => {
    const restore = noTransition(item);
    const card = item.closest('.tilt-card');
    gsap.fromTo(item,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.35,
        onComplete: () => {
          restore();
          gsap.set(item, { clearProps: 'transform,opacity' });
        },
        scrollTrigger: { trigger: card, start: 'top 60%', once: true }
      }
    );
  });

  // Pillar cards — 3D flip stagger
  document.querySelectorAll('[data-stagger-parent]').forEach(parent => {
    const kids = parent.querySelectorAll('[data-3d-reveal-child]');
    gsap.fromTo(kids,
      { opacity: 0, transformPerspective: 900, rotateX: 38, y: 26 },
      {
        opacity: 1, rotateX: 0, y: 0,
        stagger: 0.13,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: parent, start: 'top 88%', once: true }
      }
    );
  });

  // Feature lists — 3D rise stagger
  document.querySelectorAll('ul:has(.check-item)').forEach(ul => {
    const items = ul.querySelectorAll('.check-item');
    gsap.fromTo(items,
      { opacity: 0, transformPerspective: 900, rotateX: 26, y: 16 },
      {
        opacity: 1, rotateX: 0, y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: ul, start: 'top 90%', once: true }
      }
    );
  });

  // Gentle parallax on background glow layers for 3D depth
  gsap.utils.toArray('[data-depth]').forEach(el => {
    const depth = parseFloat(el.dataset.depth || '0.2');
    gsap.fromTo(el,
      { yPercent: -depth * 22 },
      {
        yPercent: depth * 22,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      }
    );
  });

  // ---------------------------------------------------------
  //  FULL-PAGE SCROLL PROGRESS BAR.
  // ---------------------------------------------------------
  gsap.fromTo('#scroll-progress',
    { scaleX: 0 },
    {
      scaleX: 1, scaleY: 1.2,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    }
  );

  // ---------------------------------------------------------
  //  SELF-DRAWING SVG LINES
  // ---------------------------------------------------------
  document.querySelectorAll('.draw-svg').forEach(path => {
    const len = path.getTotalLength ? path.getTotalLength() : 1000;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: path.closest('section'), start: 'top 80%', once: true }
    });
  });

  // ---------------------------------------------------------
  //  ANIMATED COUNTER NUMBERS
  // ---------------------------------------------------------
  document.querySelectorAll('[data-count-to]').forEach(el => {
    const target = parseFloat(el.dataset.countTo);
    const isFloat = target % 1 !== 0;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const start = performance.now();
        const duration = 2000;
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          const val = eased * target;
          el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  });
}

// ============================================================
//  Interactive hover effects (tilt, magnetic, cursor glow)
// ============================================================
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {

  // ---- Cursor-follow glow on CTA buttons ----
  document.querySelectorAll('.cta-glow').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  // ---- Magnetic links (navbar + footer + visit links) ----
  document.querySelectorAll('.magnetic-link').forEach(link => {
    const strength = 18;
    link.addEventListener('mousemove', e => {
      const rect = link.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      link.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });

  // ---- Subtle 3D tilt on platform cards (perspective depth on hover) ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    const inner = card.querySelector('.tilt-inner');
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 9;
      card.style.transform =
        `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (inner) inner.style.transform = 'translateZ(40px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.willChange = '';
      if (inner) inner.style.transform = '';
    });
  });
}