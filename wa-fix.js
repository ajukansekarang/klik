/* =========================================================
   wa-fix.js — Fix iPhone: buka WhatsApp tanpa error dialog
   
   Perbaikan:
   - Pakai anchor.click() bukan location.href (hindari error Safari)
   - Fallback pakai visibility detection (bukan setTimeout)
   - Tidak ada dialog "Tindakan tidak dapat diselesaikan"
   ========================================================= */
(function () {
  'use strict';

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  var PHONE = (window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '6285155070692';

  /* Deteksi berhasil-tidak via visibility */
  var pendingFallback = null;

  function cleanupFallback() {
    if (pendingFallback) {
      clearTimeout(pendingFallback);
      pendingFallback = null;
    }
  }

  /* Deteksi kalau user balik dari WhatsApp — berarti berhasil */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      /* User pindah ke WhatsApp → cancel fallback */
      cleanupFallback();
    }
  });

  window.addEventListener('pagehide', cleanupFallback);
  window.addEventListener('blur', function () {
    /* Browser hilang fokus biasanya berarti app terbuka */
    setTimeout(function () {
      if (document.hidden) cleanupFallback();
    }, 100);
  });

  function openWhatsApp(message) {
    var encodedMsg = encodeURIComponent(message || '');

    if (isIOS) {
      /* === iOS: pakai anchor.click() — paling aman, tanpa error === */
      var iosUrl = 'whatsapp://send?phone=' + PHONE + '&text=' + encodedMsg;
      var fallbackUrl = 'https://wa.me/' + PHONE + '?text=' + encodedMsg;

      var a = document.createElement('a');
      a.href = iosUrl;
      a.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
      document.body.appendChild(a);

      try {
        a.click();
      } catch (e) {
        /* Fallback langsung kalau click gagal */
        window.location.replace(fallbackUrl);
        document.body.removeChild(a);
        return;
      }

      document.body.removeChild(a);

      /* Cek apakah WhatsApp berhasil terbuka.
         Kalau setelah 1.5s halaman masih visible & focused
         → berarti WhatsApp tidak terpasang, buka wa.me */
      cleanupFallback();
      pendingFallback = setTimeout(function () {
        if (!document.hidden && document.hasFocus()) {
          window.location.replace(fallbackUrl);
        }
        pendingFallback = null;
      }, 1500);

    } else {
      /* === Android / desktop: pakai wa.me biasa === */
      window.open('https://wa.me/' + PHONE + '?text=' + encodedMsg, '_blank', 'noopener');
    }
  }

  function bindAll() {
    /* 1. Semua elemen dengan data-msg */
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-msg]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      openWhatsApp(el.getAttribute('data-msg'));
    }, true);

    /* 2. Float WA button */
    var floatWa = document.getElementById('floatWa');
    if (floatWa) {
      floatWa.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var defaultMsg = (window.CONFIG && window.CONFIG.defaultMessage)
          ? window.CONFIG.defaultMessage
          : 'Halo Dion, saya dari TikTok. Mau tanya-tanya soal motor Honda.';
        openWhatsApp(defaultMsg);
      }, true);
    }

    /* 3. Tombol "Bayar Cash" di bottom sheet */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-sheet-action="cash"]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var titleEl = document.getElementById('sheetTitle');
      var modelName = titleEl ? titleEl.textContent : '';
      var msg = 'Halo Dion, saya dari TikTok. Mau tanya harga cash & stok ' + (modelName || 'motor Honda') + '.';
      openWhatsApp(msg);
      /* Tutup sheet */
      var backdrop = document.getElementById('sheetBackdrop');
      var sheet = document.getElementById('actionSheet');
      if (backdrop) backdrop.classList.remove('is-open');
      if (sheet) sheet.classList.remove('is-open');
      document.body.style.overflow = '';
    }, true);

    console.log('[wa-fix] ✓ Aktif — iOS: anchor click (no error dialog)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
})();
