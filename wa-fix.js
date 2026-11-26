/* =========================================================
   wa-fix.js — Final: anti-blank + anti-error iOS
   
   Strategi:
   - Anchor click + target="_blank" → page asli tidak blank
   - wa.me (Universal Link) → iOS langsung buka app, tanpa dialog
   - Fallback multiple → kalau satu gagal, coba cara lain
   ========================================================= */
(function () {
  'use strict';

  var PHONE = (window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '6285155070692';

  function openWhatsApp(message) {
    var encodedMsg = encodeURIComponent(message || '');
    var url = 'https://wa.me/' + PHONE + '?text=' + encodedMsg;

    /* === CARA 1: Anchor click dengan target="_blank" ===
       Paling kompatibel di semua environment:
       - Browser biasa: buka tab baru → redirect ke WA
       - iOS Safari: Universal Link → app WA langsung buka
       - WebView TikTok/IG: trigger external browser atau app WA
       - Kalau gagal → halaman asli TETAP ADA (tidak blank) */
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;';
    document.body.appendChild(a);

    var clickSuccess = false;
    try {
      a.click();
      clickSuccess = true;
    } catch (e) {
      console.warn('[wa-fix] anchor click gagal:', e);
    }

    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 300);

    /* === FALLBACK: kalau anchor click throw error (sangat jarang) === */
    if (!clickSuccess) {
      try {
        window.open(url, '_blank', 'noopener');
      } catch (e2) {
        /* Last resort: navigate langsung (bisa blank, tapi minimal attempt) */
        window.location.href = url;
      }
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

      var backdrop = document.getElementById('sheetBackdrop');
      var sheet = document.getElementById('actionSheet');
      if (backdrop) backdrop.classList.remove('is-open');
      if (sheet) sheet.classList.remove('is-open');
      document.body.style.overflow = '';
    }, true);

    console.log('%c[wa-fix] ✓ Aktif — anchor click target=_blank (anti-blank)', 'color:#25d366;font-weight:bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
})();
