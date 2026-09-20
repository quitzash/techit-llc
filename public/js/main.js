/* Techit LLC — front-end enhancements.
   All content is visible by default; this script only enhances:
   reveal-on-scroll, counters, wordmark rotation, mobile menu,
   scroll progress, language toggle, and the contact form. */

(function () {
  'use strict';

  var I18N = window.I18N || {};
  var LANG = window.LANG || 'en';
  var ICONS = window.LUCIDE_ICONS || {};
  var OTHER_LANG = LANG === 'ar' ? 'en' : 'ar';
  var YEAR = String(new Date().getFullYear());
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  var transitionMs = 260;
  var toastTimer = null;

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------------- Icons (inline SVGs generated at build time) ------------- */
  function swapIcon(el, name) {
    var svg = ICONS[name];
    if (!svg) return;
    var wrap = document.createElement('span');
    wrap.innerHTML = svg;
    var node = wrap.firstElementChild;
    var i;
    for (i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === 'data-lucide') continue;
      node.setAttribute(a.name, a.value);
    }
    node.setAttribute('aria-hidden', 'true');
    el.parentNode.replaceChild(node, el);
    return node;
  }

  function initIcons() {
    $$('[data-lucide]').forEach(function (el) {
      swapIcon(el, el.getAttribute('data-lucide'));
    });
  }

  /* ---------------- Language toggle ---------------- */
  function fill(html) {
    return html.replace(/\{year\}/g, YEAR);
  }

  function getDict() {
    return I18N[LANG] || I18N.en || {};
  }

  function applyLang() {
    var dict = getDict();
    document.documentElement.lang = LANG;
    document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';

    $$('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = fill(dict[key]);
    });
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = fill(dict[key]);
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    $$('[data-i18n-var-year]').forEach(function (el) {
      el.setAttribute('data-i18n-var-year', YEAR);
    });

    var toggle = $('#lang-toggle');
    if (toggle) toggle.textContent = LANG === 'ar' ? 'EN' : 'عربي';
  }

  function setLang(next) {
    if (next === LANG) return;
    LANG = next;
    OTHER_LANG = LANG === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem('techit-lang', LANG);
    } catch (e) {}
    applyLang();
    var url = new URL(window.location.href);
    if (LANG === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', 'ar');
    window.history.replaceState(null, '', url.toString());
  }

  function initLangToggle() {
    var toggle = $('#lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      setLang(OTHER_LANG);
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function revealAll() {
    $$('[data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  function initReveal() {
    var els = $$('[data-reveal]');
    if (!els.length) return;
    if (REDUCED.matches || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------- Counters ---------------- */
  function initCounters() {
    var els = $$('[data-count-to]');
    if (!els.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      if (REDUCED.matches) {
        el.textContent = String(target);
        return;
      }
      var start = null;
      var dur = 1300;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------- Hero wordmark rotation ---------------- */
  var ROTATION_MS = 4400;

  function initWordmark() {
    var rotator = $('.hero-word-rotator');
    if (!rotator) return;
    var words = $$('.hero-word', rotator);
    if (words.length < 2) return;
    var idx = 0;
    var paused = false;

    function activate(i) {
      words.forEach(function (w, n) {
        w.classList.toggle('is-active', n === i);
      });
      var color = words[i].getAttribute('data-word-color') || '';
      rotator.setAttribute('data-active', color);
    }

    activate(0); // every (re)entry into view starts on Sabaah,
    if (REDUCED.matches) return; // never rotates for reduced-motion users.

    function tick() {
      if (paused) return;
      idx = (idx + 1) % words.length;
      activate(idx);
    }

    // Pause while the card is off-screen; on re-entry always begin on Sabaah.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              paused = false;
              if (idx !== 0) {
                idx = 0;
                activate(0);
              }
            } else {
              paused = true;
            }
          });
        },
        { threshold: 0.4 }
      );
      io.observe(rotator);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) paused = true;
      else if (idx === 0) paused = false;
    });

    setInterval(tick, ROTATION_MS);
  }

  /* ---------------- Mobile menu ---------------- */
  function initMobileMenu() {
    var toggle = $('#menu-toggle');
    var menu = $('#mobile-menu');
    var iconWrap = $('#menu-icon');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      if (ICONS.menu) swapIcon($('#menu-icon') || iconWrap, 'menu');
      else if (iconWrap) iconWrap.removeAttribute('data-lucide');
    }

    toggle.addEventListener('click', function (ev) {
      ev.preventDefault();
      var open = menu.classList.contains('hidden');
      if (open) {
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        if (ICONS.x) {
          var i = $('#menu-icon');
          if (i) swapIcon(i, 'x');
        }
      } else {
        close();
      }
    });

    $$('.mobile-link', menu).forEach(function (link) {
      link.addEventListener('click', close);
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target === menu) close();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !menu.classList.contains('hidden')) close();
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = $('#scroll-progress');
    if (!bar) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------- Form toast ---------------- */
  function showToast(mode, message) {
    var existing = $('#form-toast');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var dict = getDict();
    var icon = mode === 'success' ? ICONS['circle-check'] : ICONS['circle-alert'];
    var toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'toast-' + mode;
    var inner = document.createElement('div');
    inner.className = 'flex items-start gap-3';
    if (icon) {
      var wrap = document.createElement('span');
      wrap.innerHTML = icon;
      var svg = wrap.firstElementChild;
      svg.setAttribute('class', 'w-5 h-5 shrink-0');
      svg.setAttribute('aria-hidden', 'true');
      inner.appendChild(svg);
    }
    var label = document.createElement('span');
    label.textContent = message || dict[message] || dict['form-toast-' + (mode === 'success' ? 'success' : 'error')] || '';
    inner.appendChild(label);
    toast.appendChild(inner);
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, transitionMs);
    }, 6000);

    toast.addEventListener('click', function () {
      toast.classList.remove('is-visible');
      if (toastTimer) clearTimeout(toastTimer);
    });
  }

  function initToast() {
    var serverToast = $('#form-toast');
    if (!serverToast) return;
    setTimeout(function () {
      serverToast.classList.add('is-visible');
      setTimeout(function () {
        if (serverToast.parentNode) serverToast.parentNode.removeChild(serverToast);
      }, 6000);
    }, 150);
    serverToast.addEventListener('click', function () {
      serverToast.classList.remove('is-visible');
    });
  }

  /* ---------------- Contact form ---------------- */
  function openMailto() {
    var form = $('#contact-form');
    if (!form) return;
    var name = $('#cf-name') ? $('#cf-name').value : '';
    var email = $('#cf-email') ? $('#cf-email').value : '';
    var message = $('#cf-message') ? $('#cf-message').value : '';
    var subject = 'Techit LLC contact inquiry' + (name ? ' — ' + name : '');
    var body =
      'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    window.location.href =
      'mailto:' + 'info@techit-llc.com' + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var submit = $('#cf-submit');
    var label = $('#cf-submit-label');
    var t = getDict();

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var payload = new URLSearchParams();
      [['cf-name', 'name'], ['cf-email', 'email'], ['cf-message', 'message']].forEach(function (pair) {
        var input = document.getElementById(pair[0]);
        if (input && input.value) payload.append(pair[1], input.value);
      });
      if (submit) {
        submit.disabled = true;
        if (label) label.textContent = t['form-sending'] || 'Sending…';
      }

      fetch('/api/contact', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' } })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok && data.ok, data: data };
          });
        })
        .then(function (result) {
          var name = ($('#cf-name') && $('#cf-name').value.trim()) || '';
          if (result.ok) {
            form.reset();
            showToast('success', t['form-toast-success']);
          } else {
            openMailto();
            showToast('success', ('' + t['form-mailto']).replace('{name}', name));
          }
        })
        .catch(function () {
          var name = ($('#cf-name') && $('#cf-name').value.trim()) || '';
          openMailto();
          showToast('success', ('' + t['form-mailto']).replace('{name}', name));
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            if (label) label.textContent = t['form-submit'];
          }
        });
    });
  }

  /* ---------------- Platforms pinned scroller ---------------- */
  /* SkillLoop-inspired pinned section: on capable, motion-friendly displays
     the platforms section becomes a sticky full-screen stage on a tall
     track. Each card holds in place for a scroll window, then steps out to
     reveal the next — scrub-linked through requestAnimationFrame, with a
     progress bar and step counter. Everything is a progressive enhancement:
     without this script, or for reduced-motion users, the cards remain a
     plain, fully-visible vertical stack (tilt-in + brand glow on reveal). */
  function initPlatformScroller() {
    var section = $('[data-platform-scroll]');
    if (!section) return;
    var stage = $('.platforms-stage', section);
    var track = $('.platforms-track', section);
    var bar = $('.platforms-progress', section);
    var badge = $('[data-platform-badge]', section);
    var num = $('[data-platform-num]', section);
    var head = $('.platforms-head', section);
    var slides = $$('.platforms-slide', section);
    var cards = $$('.platform', section);
    if (!stage || !track || !slides.length) return;

    var pinned = false;
    var slideH = 0;
    var startY = 0;
    var range = 1;
    var current = 0;
    var smoothP = 0; // one scrubbed master progress drives bar + badge + track
    var rawP = 0;
    var ticking = false;
    var EARLY = 0.15; // share of the pin each card holds before stepping out
    var SNAP = 0.03;  // share of the pin spent stepping between cards
    var MIN_SLIDE = 600; // px of card window below which pinning is not worth it
    var TRACK = 8;    // scroll budget of the pin, in viewport-heights. The
    // section becomes TRACK+1 = 9 screens tall and the pin walks its cards
    // over TRACK = 8 screens of scroll — the SkillLoop system, where each
    // early panel is planted ~120vh then snaps out in ~24vh, and the final
    // card keeps the whole tail (~500vh) so it stays easy to read.

    /* Fallback for anyone who cannot pin: gentle tilt-in + brand glow. */
    function fallbackReveal() {
      if (!('IntersectionObserver' in window)) {
        cards.forEach(function (c) { c.classList.add('is-inview'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-inview');
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
      cards.forEach(function (c) { io.observe(c); });
    }

    if (REDUCED.matches || !('IntersectionObserver' in window)) {
      fallbackReveal();
      return;
    }

    /* --- Pinned mode --- */
    function measure() {
      var headH = head ? head.offsetHeight : 0;
      var stageH = stage.offsetHeight || window.innerHeight;
      slideH = Math.max(stageH - headH, window.innerHeight * 0.5);
      slides.forEach(function (s) { s.style.height = slideH + 'px'; });
      section.style.height = stageH + TRACK * stageH + 'px';
      if (stage.style) stage.style.setProperty('--head-h', headH + 'px');
      startY = section.getBoundingClientRect().top + window.scrollY;
      range = section.offsetHeight - stageH;
      if (range < 1) range = 1;
    }

    function readP() {
      var p = (window.scrollY - startY) / range;
      return Math.max(0, Math.min(1, p));
    }

    /* Map raw progress (0..1) to a slide offset (0..n-1). Each card holds
       for its own scroll window, then steps out quickly (linear, SkillLoop
       eases snaps with "none"); the last card keeps the whole tail of the
       track so it stays readable. */
    function offsetFor(p) {
      var n = slides.length;
      for (var i = 0; i < n - 1; i++) {
        var s = EARLY + i * (EARLY + SNAP);
        if (p < s) return i;
        if (p < s + SNAP) return i + (p - s) / SNAP;
      }
      return n - 1;
    }

    /* Per-frame card states: each card fades out as the next is scrolled
       in, and fades back in when you scroll the other way — opacity and
       saturation are purely a function of distance from the current slide. */
    function paint() {
      var o = current;
      for (var i = 0; i < cards.length; i++) {
        var a = 1 - Math.abs(i - o) * 1.4;
        if (a < 0) a = 0;
        if (a > 1) a = 1;
        var card = cards[i];
        card.style.opacity = a.toFixed(3);
        card.style.filter = 'saturate(' + (0.45 + 0.55 * a).toFixed(2) + ')';
      }
    }

    function apply() {
      track.style.transform = 'translate3d(0, ' + (-(current * slideH)).toFixed(1) + 'px, 0)';
      var idx = Math.max(0, Math.min(slides.length - 1, Math.round(current)));
      slides.forEach(function (s, i) {
        s.classList.toggle('is-current', i === idx);
      });
      if (num) num.textContent = String(idx + 1);
      paint();
    }

    /* One lerped master progress feeds the track offset, the progress bar,
       and the rotating loop badge — exactly the shared-scrub feel of
       SkillLoop's timeline (its scrub: 0.2 ≈ lerp k 0.14). */
    function frame() {
      smoothP += (rawP - smoothP) * 0.14;
      if (Math.abs(rawP - smoothP) < 0.0004) {
        smoothP = rawP;
        ticking = false;
      }
      current = offsetFor(smoothP);
      if (bar) bar.style.transform = 'scaleX(' + smoothP.toFixed(4) + ')';
      if (badge) badge.style.transform = 'translateX(-50%) rotate(' + (smoothP * 360).toFixed(2) + 'deg)';
      apply();
      if (ticking) requestAnimationFrame(frame);
    }

    function onScroll() {
      if (!pinned) return;
      rawP = readP();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    }

    function onResize() {
      measure();
      onScroll();
    }

    /* The pinned deck must always show a full card at natural height — a
       card that needs its own scrollbar would swallow the mouse wheel and
       trap the section on its first slide. If the viewport cannot give each
       card a tall-enough window, drop straight to the plain stack instead.
       The decision waits for the webfonts: fonts change the heading height,
       which is exactly what the window size is computed from. */
    function decide() {
      pinned = true;
      section.classList.add('is-pinned');
      measure();
      if (slideH < MIN_SLIDE) {
        pinned = false;
        section.classList.remove('is-pinned');
        section.style.height = '';
        slides.forEach(function (s) { s.style.height = ''; });
        fallbackReveal();
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      onScroll();
      apply();
    }

    var decided = false;

    function enable() {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (!decided) { decided = true; decide(); }
          else { measure(); onScroll(); }
        });
        /* Safety: if the webfont promise stalls, decide after a beat anyway
           (the deck simply re-measures once fonts finally settle). */
        setTimeout(function () {
          if (!decided) { decided = true; decide(); }
        }, 1200);
      } else {
        decided = true;
        decide();
      }
    }

    enable();
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initIcons();
    applyLang();
    initLangToggle();
    initReveal();
    initPlatformScroller();
    initCounters();
    initWordmark();
    initMobileMenu();
    initScrollProgress();
    initToast();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();