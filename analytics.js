/* =========================================================
   analytics.js — GA4 tracking (kunjungan + klik WhatsApp)
   GA ID: G-MSFQRYTMQ8
   ========================================================= */
(function () {
  'use strict';

  var GA_ID = 'G-MSFQRYTMQ8';

  if (window.__ga4_loaded) {
    console.log('%c[analytics] sudah aktif sebelumnya', 'color:#86868b');
    return;
  }
  window.__ga4_loaded = true;

  /* === LOAD GTAG SCRIPT === */
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  script.onerror = function () {
    console.error('%c[analytics] ❌ Gagal load gtag.js. Cek koneksi / adblock.', 'color:#ff3b30;font-weight:bold;');
  };
  document.head.appendChild(script);

  /* === INIT DATA LAYER === */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, {
    send_page_view: false,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('%c[analytics] ✓ GA4 aktif — ' + GA_ID, 'color:#25d366;font-weight:bold;font-size:13px');

  /* === TRACK PAGEVIEW (SPA hash routing) === */
  var lastPath = '';
  function trackPageview() {
    var path = location.hash || '#/';
    if (path === lastPath) return;
    lastPath = path;

    var title = 'Home — Sales Honda Bandung';
    if (path.indexOf('/model/') === 0) {
      try { title = decodeURIComponent(path.slice(7)) + ' — Detail Motor'; }
      catch (e) { title = 'Detail Motor'; }
    } else if (path === '/stok') { title = 'Stok & Harga'; }
    else if (path === '/kredit') { title = 'Simulasi Kredit'; }

    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: location.href
    });
    console.log('%c[analytics] 📄 pageview → ' + path, 'color:#007aff');
  }

  /* Delay sedikit supaya gtag sudah siap */
  setTimeout(trackPageview, 100);
  window.addEventListener('hashchange', trackPageview);

  /* === TRACK KLIK WHATSAPP === */
  function extractModel(msg) {
    var patterns = [
      /harga cash & stok (.+?)\./i,
      /tanya stok & harga (.+?)\./i,
      /kredit (.+?) dengan DP/i,
      /konsultasi kredit (.+?)\./i,
      /PROMO (.+?):/i,
      /harga (.+?)\./i
    ];
    for (var i = 0; i < patterns.length; i++) {
      var m = msg.match(patterns[i]);
      if (m && m[1]) return m[1].trim();
    }
    return '';
  }

  function classifySource(msg) {
    if (msg.indexOf('PROMO') !== -1) return 'promo';
    if (msg.indexOf('kredit') !== -1 || msg.indexOf('Kredit') !== -1) return 'kredit';
    if (msg.indexOf('cash') !== -1) return 'cash';
    if (msg.indexOf('tanya-tanya') !== -1) return 'hero_default';
    return 'other';
  }

  var origOpen = window.open;
  window.open = function (url) {
    try {
      if (url && typeof url === 'string' && (url.indexOf('wa.me') !== -1 || url.indexOf('whatsapp.com') !== -1)) {
        var msgMatch = url.match(/[?&]text=([^&]+)/);
        var msg = msgMatch ? decodeURIComponent(msgMatch[1]) : '';
        var model = extractModel(msg);
        var source = classifySource(msg);

        gtag('event', 'wa_click', {
          model: model || '(tidak terdeteksi)',
          source: source,
          page: location.hash || '#/',
          message_preview: msg.substring(0, 120)
        });

        console.log('%c[analytics] 📱 WA click → ' + source + ' | ' + (model || 'generic'), 'color:#25d366;font-weight:bold;');
      }
    } catch (e) {
      console.warn('[analytics] error tracking WA:', e);
    }
    return origOpen.apply(this, arguments);
  };

  /* === TRACK ERROR GA4 kalau gagal load === */
  window.addEventListener('error', function (e) {
    if (e.target && e.target.src && e.target.src.indexOf('googletagmanager') !== -1) {
      console.error('%c[analytics] ❌ GTM/GA4 script diblokir (adblock?). Tracking tidak jalan.', 'color:#ff3b30;font-weight:bold;');
    }
  }, true);
})();
