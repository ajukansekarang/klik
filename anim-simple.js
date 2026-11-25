/* =========================================================
   anim-simple.js
   Animasi HERO saja — 100% aman, tidak sentuh elemen lain
   Load setelah GSAP. Kalau GSAP gagal → tidak melakukan apa-apa.
   ========================================================= */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function animateHero(screen) {
    if (!screen || screen.dataset.animDone) return;
    var hero = screen.querySelector('.hero');
    if (!hero) return;
    screen.dataset.animDone = '1';

    var targets = [
      hero.querySelector('.profile-avatar'),
      hero.querySelector('.profile-info'),
      hero.querySelector('.badge'),
      hero.querySelector('h1'),
      hero.querySelector('p'),
      hero.querySelector('.hero-cta')
    ].filter(Boolean);

    if (!targets.length) return;

    /* from() = mulai dari state ini, animate ke kondisi natural (CSS asli).
       Kalau animasi selesai/gagal → elemen otomatis kembali ke posisi asli.
       TIDAK ADA set(opacity:0) permanen → tidak mungkin elemen hilang. */
    gsap.from(targets, {
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.07,
      ease: 'power2.out',
      clearProps: 'all' // ← penting: hapus inline style setelah selesai
    });

    /* Avatar scale-in — terpisah biar efeknya lebih "pop" */
    var av = hero.querySelector('.profile-avatar');
    if (av) {
      gsap.from(av, {
        scale: 0.6,
        duration: 0.5,
        ease: 'back.out(2)',
        clearProps: 'transform'
      });
    }
  }

  function animateModelHero(screen) {
    if (!screen || screen.dataset.animHeroDone) return;
    var mh = screen.querySelector('.model-hero');
    if (!mh) return;
    screen.dataset.animHeroDone = '1';

    gsap.from(mh, {
      opacity: 0,
      scale: 1.03,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  function scan() {
    var app = document.getElementById('app');
    if (!app) return;
    app.querySelectorAll('.screen').forEach(function (s) {
      animateHero(s);
      animateModelHero(s);
    });
  }

  /* Bootstrap */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
  setTimeout(scan, 60); // safety net untuk screen pertama

  /* Watch screen baru */
  var app = document.getElementById('app');
  if (app) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains('screen')) {
            /* Tunggu screen slide-in selesai (380ms) baru animate hero */
            setTimeout(function () {
              animateHero(n);
              animateModelHero(n);
            }, 380);
          }
        });
      });
    }).observe(app, { childList: true });
  }
})();
