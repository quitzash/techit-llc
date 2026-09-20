// ============================================================
//  Techit LLC — shared i18n dictionary (EN / AR)
//  Single source of truth, used by both the server (EJS render)
//  and the client (lang toggle). Keys may contain HTML for the
//  `*-title` / `*-html` variants.
// ============================================================

const en = {
  'meta-title': 'Techit LLC — Powering Next-Generation Digital Ecosystems',
  'meta-desc':
    'Techit LLC is the holding enterprise backing leading regional platforms in e-commerce, business optimization, and enterprise gateways.',

  'nav-about': 'About',
  'nav-journey': 'How we work',
  'nav-platforms': 'Platforms',
  'nav-pillars': 'Pillars',
  'nav-contact': 'Contact',
  'platforms-title': `Our <span class="text-white/40">platforms.</span>`,
  'scroller-hint': 'Scroll to explore',
  'scroller-prev': 'Previous platform',
  'scroller-next': 'Next platform',

  'hero-badge': 'Holding Enterprise · Regional Digital Platforms',
  'hero-word-label': 'The Holding',
  'hero-word-caption': 'Three platforms, one intent.',
  'hero-title': `Powering <span class="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent shimmer">Next-Generation</span><br class="hidden sm:block" />Digital Ecosystems.`,
  'hero-paragraph':
    'Techit LLC is the holding enterprise backing leading regional platforms in e-commerce, business optimization, and enterprise gateways.',
  'hero-cta': 'Explore the Ecosystem',
  'hero-why': 'Why Techit',

  'about-kicker': 'Company Overview',
  'about-title': `One holding,<br />many platforms,<br /><span class="text-white/50">unified purpose.</span>`,
  'about-p1':
    'Techit LLC is a technology incubation and holding enterprise committed to operational reliability and sustained platform growth. We conceive, back, and scale specialized digital products that move real value across the region.',
  'about-p2':
    'From on-the-go coffee ordering to hourly hotel booking and secure enterprise gateways, each subsidiary operates with its own focus — while sharing the infrastructure, governance, and long-term vision of the Techit umbrella.',

  'stat-platforms': 'Platforms',
  'stat-holding': 'Holding Co.',
  'stat-inhouse': 'In-house',

  'journey-kicker': 'How We Work',
  'journey-title': `From friction to<br />full operation, <span class="text-white/40">clearly.</span>`,
  'journey-desc':
    'Every platform moves through the same four stages under the Techit umbrella — no shortcuts, no surprises.',
  'journey-1-num': '01',
  'journey-1-kicker': 'Conceive',
  'journey-1-title': 'It starts with a real friction.',
  'journey-1-body':
    'Every Techit platform begins in the same place: a moment in regional life where the old way takes too long. We name the friction, then engineer it away.',
  'journey-2-num': '02',
  'journey-2-kicker': 'Back',
  'journey-2-title': 'Funded through the hard years.',
  'journey-2-body':
    'As a holding company, Techit supplies the capital, operations, and governance that let founder teams focus on shipping — not fundraising.',
  'journey-3-num': '03',
  'journey-3-kicker': 'Support',
  'journey-3-title': 'One backbone for every platform.',
  'journey-3-body':
    'Shared infrastructure, shared standards, and one governance model. Each subsidiary keeps its own focus while standing on the Techit umbrella.',
  'journey-4-num': '04',
  'journey-4-kicker': 'Operate',
  'journey-4-title': 'Purpose, running across the region.',
  'journey-4-body':
    'From a coffee to a hotel room to an enterprise door — the intent is one: digital ecosystems that move real value.',

  'wfrlee-name': 'Wfrlee.com',
  'wfrlee-domain': 'wfrlee.com',
  'wfrlee-tagline': 'Hotels, booked by the hour.',
  'wfrlee-desc':
    'Book short stays with flexible hourly rates. Pay only for the time you use — no need to pay for a full night.',
  'wfrlee-c1': 'Flexible hourly-rate booking',
  'wfrlee-c2': 'Pay-as-you-stay pricing',
  'wfrlee-c3': 'Instant short-stay scheduling',
  'wfrlee-visit': 'Visit wfrlee.com',
  'wfrlee-label': 'Hourly Hotel Booking',
  'wfrlee-idea':
    'The idea: you rarely need a whole night. Wfrlee lets you book a hotel room for the exact hours you need and pay only for those hours — not the full day.',
  'wfrlee-step1': `<span class="text-white font-semibold">Search</span> — find a hotel and choose your hours (3–24h).`,
  'wfrlee-step2': `<span class="text-white font-semibold">Book hourly</span> — pay per hour, no full-night charge.`,
  'wfrlee-step3': `<span class="text-white font-semibold">Stay &amp; go</span> — check in instantly, check out on your time.`,
  'wfrlee-badge': 'Currently available in Saudi Arabia',

  'oneegate-name': 'OneEGate',
  'oneegate-domain': 'oneegate.com',
  'oneegate-tagline': 'One gateway for the enterprise.',
  'oneegate-desc':
    'Managing enterprise-level central gateways, institutional access systems, and secure infrastructure tools.',
  'oneegate-c1': 'Central enterprise gateways',
  'oneegate-c2': 'Institutional access systems',
  'oneegate-c3': 'Secure infrastructure tools',
  'oneegate-visit': 'Visit oneegate.com',
  'oneegate-label': 'Enterprise Gateway',
  'oneegate-idea':
    'The idea: institutions shouldn\'t juggle a dozen logins and systems. OneEGate is a single, secure front door for enterprise access, teams, and infrastructure.',
  'oneegate-step1': `<span class="text-white font-semibold">Centralize</span> — one secure gateway for all institutional systems.`,
  'oneegate-step2': `<span class="text-white font-semibold">Control access</span> — define who reaches what, policy-driven.`,
  'oneegate-step3': `<span class="text-white font-semibold">Operate securely</span> — infrastructure protected at the core.`,

  'sabaah-name': 'Sabaah',
  'sabaah-domain': 'sabaah.net',
  'sabaah-tagline': 'Coffee, ordered on the go.',
  'sabaah-desc':
    'Order your coffee from anywhere — browse nearby cafés, skip the queue, and have your brew ready the moment you arrive.',
  'sabaah-c1': 'Order ahead from nearby cafés',
  'sabaah-c2': 'Skip the queue with fast pickup',
  'sabaah-c3': 'Streamlined mobile ordering pipeline',
  'sabaah-visit': 'Visit sabaah.net',
  'sabaah-label': 'On-the-Go Coffee',
  'sabaah-idea':
    'The idea: instead of queuing at a café, order before you\'re even there. Sabaah connects you to nearby cafés and has your drink ready on arrival.',
  'sabaah-step1': `<span class="text-white font-semibold">Discover</span> — browse cafés near you and pick a drink.`,
  'sabaah-step2': `<span class="text-white font-semibold">Order ahead</span> — pay in app and the café starts your brew.`,
  'sabaah-step3': `<span class="text-white font-semibold">Skip the queue</span> — walk in and grab your ready cup.`,

  'pillars-kicker': 'Core Pillars',
  'pillars-title': 'What we stand on.',
  'pillars-1-title': 'Scalability',
  'pillars-1-desc':
    'Architectures engineered to grow from first user to full regional scale without breaking stride.',
  'pillars-2-title': 'Unified Integration',
  'pillars-2-desc':
    'Platforms that connect cleanly — shared data, shared standards, and one cohesive ecosystem experience.',
  'pillars-3-title': 'Enterprise Security',
  'pillars-3-desc':
    'Institutional-grade protection embedded at the core of every gateway and access system we operate.',

  'contact-kicker': 'Contact Us',
  'contact-title': `Let's build <span class="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent shimmer">together.</span>`,
  'contact-desc':
    'Whether you\'re a partner, a business exploring our platforms, or a team looking to grow under the Techit umbrella — we\'d love to hear from you.',
  'contact-email-label': 'Email',
  'contact-email': 'info@techit-llc.com',

  'form-name': 'Name',
  'form-email': 'Email',
  'form-message': 'Message',
  'form-submit': 'Send Message',
  'form-name-ph': 'Your name',
  'form-email-ph': 'you@company.com',
  'form-message-ph': 'How can we help?',
  'form-sending': 'Sending…',
  'form-success': 'Thanks {name} — your message has been sent.',
  'form-mailto': 'Thanks {name} — your message is ready. Opening your mail app…',
  'form-error': 'Something went wrong — please email us directly at info@techit-llc.com.',
  'form-toast-success': 'Thanks — your message has been sent.',
  'form-toast-error': 'Something went wrong — please try again or email us directly.',

  'footer-tagline': 'Holding the platforms powering regional digital ecosystems.',
  'footer-company': 'Company',
  'footer-platforms': 'Platforms',
  'footer-contact': 'Contact',
  'footer-rights': '© {year} Techit LLC. All rights reserved.',
};

const ar = {
  'meta-title': 'تيكيت LLC — نقود النظم الرقمية للجيل القادم',
  'meta-desc':
    'تيكيت هي الشركة القابضة الداعمة لأبرز المنصات الإقليمية في التجارة الإلكترونية وتحسين الأعمال وبوابات المؤسسات.',

  'nav-about': 'عن الشركة',
  'nav-journey': 'كيف نعمل',
  'nav-platforms': 'المنصات',
  'nav-pillars': 'الركائز',
  'nav-contact': 'تواصل معنا',
  'platforms-title': `منصات<span class="text-white/40">نا.</span>`,
  'scroller-hint': 'مرّر للاستكشاف',
  'scroller-prev': 'المنصة السابقة',
  'scroller-next': 'المنصة التالية',

  'hero-badge': 'شركة قابضة · منصات رقمية إقليمية',
  'hero-word-label': 'الشركة القابضة',
  'hero-word-caption': 'ثلاث منصات، هدف واحد.',
  'hero-title': `نقود <span class="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent shimmer">الجيل القادم</span><br class="hidden sm:block" /> من النظم الرقمية.`,
  'hero-paragraph':
    'تيكيت هي الشركة القابضة التي تقف خلف أبرز المنصات الإقليمية في التجارة الإلكترونية وتحسين الأعمال وبوابات المؤسسات.',
  'hero-cta': 'استكشف المنظومة',
  'hero-why': 'لماذا تيكيت',

  'about-kicker': 'نبذة عامة',
  'about-title': `شركة واحدة،<br />منصات متعددة،<br /><span class="text-white/50">هدف موحّد.</span>`,
  'about-p1':
    'تيكيت هي مؤسسة احتضان تقني وشركة قابضة ملتزمة بالموثوقية التشغيلية والنمو المستدام للمنصات. نبتكر ونموّل ونوسّع منتجات رقمية متخصصة تنقل قيمة حقيقية في المنطقة.',
  'about-p2':
    'من طلب القهوة أثناء التنقّل إلى حجز الفنادق بالساعة وبوابات المؤسسات الآمنة، تعمل كل شركة تابعة بتركيزها الخاص — مع مشاركة البنية التحتية والحوكمة والرؤية طويلة الأجل لمظلة تيكيت.',

  'stat-platforms': 'منصات',
  'stat-holding': 'شركة قابضة',
  'stat-inhouse': 'داخلي 100%',

  'journey-kicker': 'كيف نعمل',
  'journey-title': `من الخلل إلى<br />التشغيل الكامل، <span class="text-white/40">بوضوح.</span>`,
  'journey-desc':
    'تمر كل منصة بنفس المراحل الأربع تحت مظلة تيكيت — دون اختصارات أو مفاجآت.',
  'journey-1-num': '٠١',
  'journey-1-kicker': 'الفكرة',
  'journey-1-title': 'يبدأ كل شيء بخلل حقيقي.',
  'journey-1-body':
    'تبدأ كل منصة تيكيت من المكان نفسه: لحظة في الحياة الإقليمية يستغرق فيها الأسلوب القديم وقتًا أطول من اللازم. نحدّد موضع الخلل، ثم نهندس إزالته.',
  'journey-2-num': '٠٢',
  'journey-2-kicker': 'التمويل',
  'journey-2-title': 'نمول عبر السنوات الصعبة.',
  'journey-2-body':
    'بوصفنا شركة قابضة، نوفّر رأس المال والتشغيل والحوكمة، لنمنح فرق المؤسسين حرية التركيز على الإطلاق — لا على جمع التمويل.',
  'journey-3-num': '٠٣',
  'journey-3-kicker': 'البنية',
  'journey-3-title': 'عمود فقري واحد لكل منصة.',
  'journey-3-body':
    'بنية تحتية مشتركة ومعايير موحّدة ونموذج حوكمة واحد. تحتفظ كل شركة تابعة بتركيزها الخاص وهي تقف على مظلة تيكيت.',
  'journey-4-num': '٠٤',
  'journey-4-kicker': 'التشغيل',
  'journey-4-title': 'غاية واحدة تعمل عبر المنطقة.',
  'journey-4-body':
    'من كوب قهوة إلى غرفة فندق وباب مؤسسة — الهدف واحد: نظم رقمية تنقل قيمة حقيقية.',

  'wfrlee-name': 'Wfrlee.com',
  'wfrlee-domain': 'wfrlee.com',
  'wfrlee-tagline': 'فنادق تُحجز بالساعة.',
  'wfrlee-desc':
    'احجز إقامات قصيرة بأسعار مرنة بالساعة. ادفع فقط مقابل الوقت الذي تستخدمه — دون الحاجة لدفع قيمة ليلة كاملة.',
  'wfrlee-c1': 'حجز مرن بأسعار الساعة',
  'wfrlee-c2': 'تسعير الدفع حسب الإقامة',
  'wfrlee-c3': 'جدولة فورية للإقامات القصيرة',
  'wfrlee-visit': 'زيارة wfrlee.com',
  'wfrlee-label': 'حجز الفنادق بالساعة',
  'wfrlee-idea':
    'الفكرة: نادرًا ما تحتاج ليلة كاملة. يتيح لك وفرلي حجز غرفة فندقية للساعات التي تحتاجها بالضبط والدفع فقط لتلك الساعات — لا ليوم كامل.',
  'wfrlee-step1': `<span class="text-white font-semibold">ابحث</span> — اعثر على فندق واختر ساعاتك (3–24 ساعة).`,
  'wfrlee-step2': `<span class="text-white font-semibold">احجز بالساعة</span> — ادفع لكل ساعة دون رسوم الليلة الكاملة.`,
  'wfrlee-step3': `<span class="text-white font-semibold">تقم وانطلق</span> — تسجيل دخول فوري ومغادرة في وقتك.`,
  'wfrlee-badge': 'متاح حاليًا في المملكة العربية السعودية',

  'oneegate-name': 'ون إيغيت',
  'oneegate-domain': 'oneegate.com',
  'oneegate-tagline': 'بوابة واحدة للمؤسسة.',
  'oneegate-desc':
    'إدارة بوابات مركزية على مستوى المؤسسات، وأنظمة وصول مؤسسية، وأدوات بنية تحتية آمنة.',
  'oneegate-c1': 'بوابات مركزيّة للمؤسسات',
  'oneegate-c2': 'أنظمة وصول مؤسسية',
  'oneegate-c3': 'أدوات بنية تحتية آمنة',
  'oneegate-visit': 'زيارة oneegate.com',
  'oneegate-label': 'بوابة المؤسسات',
  'oneegate-idea':
    'الفكرة: لا ينبغي أن تتخبّط المؤسسات بين عشرات الأنظمة وتسجيلات الدخول. ون إيغيت هي بوابة واحدة آمنة للوصول المؤسسي والفرق والبنية التحتية.',
  'oneegate-step1': `<span class="text-white font-semibold">وحّد</span> — بوابة آمنة واحدة لجميع الأنظمة المؤسسية.`,
  'oneegate-step2': `<span class="text-white font-semibold">تحكّم في الوصول</span> — حدّد من يصل إلى ماذا وفق السياسات.`,
  'oneegate-step3': `<span class="text-white font-semibold">شغّل بأمان</span> — بنية تحتية محمية من الجوهر.`,

  'sabaah-name': 'صباح',
  'sabaah-domain': 'sabaah.net',
  'sabaah-tagline': 'قهوة تُطلب أثناء التنقّل.',
  'sabaah-desc':
    'اطلب قهوتك من أي مكان — تصفّح المقاهي القريبة، وتجاوز الطوابير، واجد مشروبك جاهزًا فور وصولك.',
  'sabaah-c1': 'اطلب مسبقًا من المقاهي القريبة',
  'sabaah-c2': 'تجاوز الطابور مع استلام سريع',
  'sabaah-c3': 'مسار طلب جوال مبسّط',
  'sabaah-visit': 'زيارة sabaah.net',
  'sabaah-label': 'قهوة أثناء التنقّل',
  'sabaah-idea':
    'الفكرة: بدلًا من الانتظار في المقهى، اطلب قبل وصولك. يوصلك صباح بالمقاهي القريبة ويجهّز مشروبك عند وصولك.',
  'sabaah-step1': `<span class="text-white font-semibold">اكتشف</span> — تصفّح المقاهي القريبة واختر مشروبك.`,
  'sabaah-step2': `<span class="text-white font-semibold">اطلب مسبقًا</span> — ادفع من التطبيق ليبدأ المقهى بتحضير مشروبك.`,
  'sabaah-step3': `<span class="text-white font-semibold">تجاوز الطابور</span> — ادخل وخذ كوبك الجاهز.`,

  'pillars-kicker': 'الركائز الأساسية',
  'pillars-title': 'ما الذي نرتكز عليه.',
  'pillars-1-title': 'قابلية التوسّع',
  'pillars-1-desc':
    'أبنية هندسية مصممة لتنمو من المستخدم الأول إلى النطاق الإقليمي الكامل دون كسر الخطوة.',
  'pillars-2-title': 'تكامل موحّد',
  'pillars-2-desc':
    'منصات تتصل بسلاسة — بيانات مشتركة ومعايير موحدة وتجربة منظومة متكاملة واحدة.',
  'pillars-3-title': 'أمن المؤسسات',
  'pillars-3-desc':
    'حماية بمستوى المؤسسات مدمجة في صميم كل بوابة ونظام وصول نديره.',

  'contact-kicker': 'تواصل معنا',
  'contact-title': `لنبنِ <span class="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent shimmer">معًا.</span>`,
  'contact-desc':
    'سواء كنت شريكًا، أو نشاطًا تجاريًا يستكشف منصاتنا، أو فريقًا يتطلع للنمو تحت مظلة تيكيت — يسعدنا أن نسمع منك.',
  'contact-email-label': 'البريد الإلكتروني',
  'contact-email': 'info@techit-llc.com',

  'form-name': 'الاسم',
  'form-email': 'البريد الإلكتروني',
  'form-message': 'الرسالة',
  'form-submit': 'إرسال الرسالة',
  'form-name-ph': 'اسمك',
  'form-email-ph': 'بريدك@p.com',
  'form-message-ph': 'كيف يمكننا مساعدتك؟',
  'form-sending': 'جارٍ الإرسال…',
  'form-success': 'شكرًا {name} — تم إرسال رسالتك.',
  'form-mailto': 'شكرًا {name} — رسالتك جاهزة. نفتح تطبيق البريد…',
  'form-error': 'حدث خطأ ما — يرجى مراسلتنا مباشرة على info@techit-llc.com.',
  'form-toast-success': 'شكرًا — تم إرسال رسالتك.',
  'form-toast-error': 'حدث خطأ ما — يرجى المحاولة مجددًا أو مراسلتنا مباشرة.',

  'footer-tagline': 'نحمل المنصات التي تقوّي النظم الرقمية الإقليمية.',
  'footer-company': 'الشركة',
  'footer-platforms': 'المنصات',
  'footer-contact': 'التواصل',
  'footer-rights': '© {year} تيكيت. جميع الحقوق محفوظة.',
};

module.exports = { en, ar };