/* =========================================================
   anim-enhance.js
   Addon: animasi entrance hero + scroll reveal
   Tidak mengubah kode asli. Load setelah script utama.
   Requires: GSAP (CDN)
   ========================================================= */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var REVEAL = '.social, .action, .model, .trust, .terms, .harga-card, .detail-h2, .detail-tagline, .detail-desc, .detail-h3, .highlights, .cta-block, .filter-bar, .stok-item, .kredit-card';

  var seen = new WeakSet();
  var observers = new WeakMap();

  function initScreen(screen) {
    if (!screen || seen.has(screen)) return;
    seen.add(screen);

    /* Delay menyesuaikan: kalau screen baru slide-in, tunggu 350ms
       biar tidak tabrakan dengan animasi transisi layar. */
    var multi = document.querySelectorAll('.screen').length > 1;
    var baseDelay = multi ? 0.35 : 0.05;

    /* === HERO ENTRANCE === */
    var hero = screen.querySelector('.hero');
    if (hero) {
      var tl = gsap.timeline({ delay: baseDelay, defaults: { ease: 'power3.out' } });
      var av = hero.querySelector('.profile-avatar');
      var info = hero.querySelector('.profile-info');
      var bd = hero.querySelector('.badge');
      var h1 = hero.querySelector('h1');
      var p = hero.querySelector('p');
      var cta = hero.querySelector('.hero-cta');
      if (av) tl.from(av, { scale: 0.5, opacity: 0, duration: 0.55, ease: 'back.out(2)' }, 0);
      if (info) tl.from(info, { x: -16, opacity: 0, duration: 0.45 }, 0.08);
      if (bd) tl.from(bd, { x: 16, opacity: 0, duration: 0.45 }, 0.08);
      if (h1) tl.from(h1, { y: 20, opacity: 0, duration: 0.6 }, 0.18);
      if (p) tl.from(p, { y: 14, opacity: 0, duration: 0.5 }, 0.32);
      if (cta) tl.from(cta, { y: 14, opacity: 0, duration: 0.5 }, 0.45);
    }

    /* === MODEL HERO ZOOM-IN === */
    var mh = screen.querySelector('.model-hero');
    if (mh) gsap.from(mh, { opacity: 0, scale: 1.03, duration: 0.7, ease: 'power2.out', delay: baseDelay });

    /* === SCROLL REVEAL === */
    var els = screen.querySelectorAll(REVEAL);
    if (!els.length) return;

    var vh = window.innerHeight;
    var inView = [], below = [];

    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) inView.push(els[i]);
      else below.push(els[i]);
    }

    /* Elemen di bawah lipatan → animasi saat di-scroll */
    if (below.length) {
      gsap.set(below, { opacity: 0, y: 24 });
      var io = new IntersectionObserver(function (entries) {
        var batch = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          gsap.to(el, {
            opacity: 1, y: 0,
            duration: 0.6,
            delay: batch * 0.05,
            ease: 'power3.out',
            overwrite: true
          });
          batch++;
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      below.forEach(function (el) { io.observe(el); });
      observers.set(screen, io);
    }

    /* Elemen sudah terlihat → animasi masuk dengan stagger */
    if (inView.length) {
      gsap.set(inView, { opacity: 0, y: 16 });
      gsap.to(inView, {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        delay: baseDelay + 0.15
      });
    }
  }

  function destroyScreen(screen) {
    var io = observers.get(screen);
    if (io) { io.disconnect(); observers.delete(screen); }
  }

  function scan() {
    var app = document.getElementById('app');
    if (!app) return;
    app.querySelectorAll('.screen').forEach(initScreen);
  }

  /* Bootstrap */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
  setTimeout(scan, 50); // safety net

  /* Watch screen baru */
  var app = document.getElementById('app');
  if (app) {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains('screen')) {
            setTimeout(function () { initScreen(n); }, 0);
          }
        });
        m.removedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains('screen')) {
            destroyScreen(n);
          }
        });
      });
    });
    mo.observe(app, { childList: true });
  }
})();
