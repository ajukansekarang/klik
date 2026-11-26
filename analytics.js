/* =========================================================
   analytics.js — GA4 tracking (kunjungan + klik WhatsApp)
   
   CARA PAKAI:
   1. Ganti GA_ID di bawah dengan Measurement ID kamu (G-XXXXXXXXXX)
   2. Tambahkan <script src="analytics.js"></script> sebelum </body>
   3. Buka analytics.google.com untuk lihat data
   ========================================================= */
(function () {
  'use strict';

  /* ============ ISI DI SINI ============ */
  var GA_ID = 'G-XXXXXXXXXX';   // ← GANTI dengan ID GA4 kamu
  /* ==================================== */

  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') {
    console.warn('[analytics] ⚠️ GA_ID belum diisi. Tracking dimatikan.');
    return;
  }

  /* === LOAD GTAG === */
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, {
    send_page_view: false,  // ← manual pageview (SPA route)
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('%c[analytics] ✓ GA4 aktif — ' + GA_ID, 'color:#25d366;font-weight:bold;');

  /* === TRACK PAGEVIEW (SPA hash routing) === */
  var lastPath = '';
  function trackPageview() {
    var path = location.hash || '#/';
    if (path === lastPath) return;
    lastPath = path;

    // Ambil judul dari halaman
    var title = document.title;
    if (path.indexOf('/model/') === 0) {
      try { title = decodeURIComponent(path.slice(7)) + ' — Detail Motor'; } catch (e) { title = 'Detail Motor'; }
    } else if (path === '/stok') { title = 'Stok & Harga'; }
    else if (path === '/kredit') { title = 'Simulasi Kredit'; }
    else { title = 'Home — Sales Honda Bandung'; }

    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: location.href
    });
  }

  trackPageview();
  window.addEventListener('hashchange', trackPageview);

  /* === TRACK KLIK WHATSAPP === */
  /* Strategi: intercept window.open karena semua link WA dibuka via openWa() */
  var origOpen = window.open;
  window.open = function (url) {
    if (url && typeof url === 'string' && (url.indexOf('wa.me') !== -1 || url.indexOf('whatsapp.com') !== -1)) {
      try {
        // Extract model dari text parameter
        var msgMatch = url.match(/text=([^&]+)/);
        var msg = msgMatch ? decodeURIComponent(msgMatch[1]) : '';
        var model = '';
        
        // Coba match nama model dari pesan
        // Contoh pesan: "Halo Dion, saya dari TikTok. Mau tanya harga cash & stok New BeAT CBS."
        //              "Mau kredit PCX 160 CBS dengan DP Rp 3.000.000"
        //              "Mau ambil PROMO New BeAT CBS: DP ..."
        var patterns = [
          /harga cash & stok (.+?)\./i,
          /harga (.+?)\./i,
          /kredit (.+?) dengan DP/i,
          /konsultasi kredit (.+?)\./i,
          /PROMO (.+?):/i,
          /tanya stok & harga (.+?)\./i
        ];
        for (var i = 0; i < patterns.length; i++) {
          var m = msg.match(patterns[i]);
          if (m && m[1]) { model = m[1].trim(); break; }
        }

        // Klasifikasi source
        var source = 'unknown';
        if (msg.indexOf('cash') !== -1) source = 'cash';
        else if (msg.indexOf('kredit') !== -1 || msg.indexOf('Kredit') !== -1) source = 'kredit';
        else if (msg.indexOf('PROMO') !== -1) source = 'promo';
        else if (msg.indexOf('tanya-tanya') !== -1) source = 'hero_default';

        gtag('event', 'wa_click', {
          model: model || '(tidak terdeteksi)',
          source: source,
          page: location.hash || '#/',
          message_preview: msg.substring(0, 120)
        });

        console.log('%c[analytics] 📱 WA click → ' + source + ' | ' + (model || 'generic'), 'color:#25d366');
      } catch (e) {
        console.warn('[analytics] error tracking WA:', e);
      }
    }
    return origOpen.apply(this, arguments);
  };

  /* === TRACK KLIK TOMBOL WA YANG PAKAI location.href FALLBACK === */
  /* Kalau popup diblokir, openWa() fallback ke location.href = url */
  /* Kita track via click listener sebagai backup */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-msg], .wa-btn, .float-wa, [data-sheet-action="cash"]');
    if (!el) return;
    // Cuma track kalau bukan dari openWa() (window.open sudah track duluan)
    // Delay kecil supaya window.open selesai dulu
    setTimeout(function () {
      if (window.__waClicked) {
        window.__waClicked = false;
        return;
      }
      // Fallback path (popup blocked)
      gtag('event', 'wa_click_fallback', {
        page: location.hash || '#/'
      });
    }, 100);
  }, true);

  /* Set flag ketika window.open dipanggil */
  var origOpen2 = window.open;
  window.open = function () {
    window.__waClicked = true;
    return origOpen2.apply(this, arguments);
  };

  /* === TRACK PAGE EXIT (opsional, bagus untuk analisis) === */
  window.addEventListener('beforeunload', function () {
    gtag('event', 'page_exit', {
      page: location.hash || '#/'
    });
  });
})();
