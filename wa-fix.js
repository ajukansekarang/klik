/* =========================================================
   wa-fix.js — Perbaikan buka WhatsApp di iPhone
   Menangani: iOS Safari & WebView (aplikasi/APK)
   ========================================================= */
(function () {
  'use strict';

  /* Deteksi iOS (termasuk iPadOS yang kadang menyamar jadi Mac) */
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /* Ambil nomor dari config global, fallback ke nomor default */
  var PHONE = (window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '6285155070692';

  /**
   * Buka WhatsApp dengan pesan tertentu.
   * Di iOS pakai whatsapp:// scheme, di Android tetap wa.me.
   */
  function openWhatsApp(message) {
    var encodedMsg = encodeURIComponent(message || '');

    if (isIOS) {
      /* whatsapp://send?phone=...&text=... */
      var iosUrl = 'whatsapp://send?phone=' + PHONE + '&text=' + encodedMsg;
      /* Fallback ke wa.me kalau WhatsApp tidak terpasang (iOS akan buka App Store) */
      var fallbackUrl = 'https://wa.me/' + PHONE + '?text=' + encodedMsg;
      var now = Date.now();
      var timer = setTimeout(function () {
        /* Jika setelah 1.2 detik masih di halaman ini, berarti app tidak terbuka */
        if (Date.now() - now < 1500) {
          window.location.href = fallbackUrl;
        }
      }, 1200);

      /* Coba buka aplikasi WhatsApp via scheme */
      window.location.href = iosUrl;
      /* Kalau berhasil, timer dibatalkan saat halaman kehilangan fokus */
      window.addEventListener('pagehide', function () { clearTimeout(timer); }, { once: true });
    } else {
      /* Android / desktop: pakai wa.me biasa */
      window.open('https://wa.me/' + PHONE + '?text=' + encodedMsg, '_blank', 'noopener');
    }
  }

  /**
   * Pasang event listener pada semua elemen yang memicu WhatsApp.
   * Ini menggantikan handler lama yang mungkin memakai window.open setelah async.
   */
  function bindAll() {
    /* 1. Tangani elemen dengan atribut data-msg (tombol hero, detail, dll) */
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-msg]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation(); // hentikan handler lama
      var msg = el.getAttribute('data-msg');
      openWhatsApp(msg);
    }, true); // capture phase, jalankan sebelum handler lama

    /* 2. Tangani float WA (tidak punya data-msg, pakai pesan default) */
    var floatWa = document.getElementById('floatWa');
    if (floatWa) {
      floatWa.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var defaultMsg = (window.CONFIG && window.CONFIG.defaultMessage) ? window.CONFIG.defaultMessage : 'Halo Dion, saya dari TikTok. Mau tanya-tanya soal motor Honda.';
        openWhatsApp(defaultMsg);
      }, true);
    }

    /* 3. Tangani tombol "Bayar Cash" di bottom sheet */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-sheet-action="cash"]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      /* Ambil nama model dari sheet title */
      var titleEl = document.getElementById('sheetTitle');
      var modelName = titleEl ? titleEl.textContent : '';
      var msg = 'Halo Dion, saya dari TikTok. Mau tanya harga cash & stok ' + (modelName || 'motor Honda') + '.';
      openWhatsApp(msg);
      /* Tutup sheet manual */
      var backdrop = document.getElementById('sheetBackdrop');
      var sheet = document.getElementById('actionSheet');
      if (backdrop) backdrop.classList.remove('is-open');
      if (sheet) sheet.classList.remove('is-open');
      document.body.style.overflow = '';
    }, true);

    /* 4. Tangani tombol "Konsultasi Kredit" di halaman kredit */
    /* (Tombol ini memakai data-konsultasi, bukan data-msg) */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-konsultasi]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      /* Ambil pesan dari card terdekat; kita biarkan logika lama tetap jalan, 
         tapi kita hentikan event agar tidak dobel. 
         Sebaiknya tombol konsultasi di-render ulang dengan data-msg. 
         Untuk sementara, kita biarkan handler lama yang menangani karena pesannya dinamis. */
      // Tidak di-intercept di sini untuk menghindari konflik.
    }, true);

    console.log('[wa-fix] ✓ Handler WhatsApp iOS aktif');
  }

  /* Bootstrap: pasang setelah DOM siap */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
})();
