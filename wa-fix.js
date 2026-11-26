/* =========================================================
   wa-fix.js — Universal WhatsApp Opener
   Deteksi: iOS / Android / WebView / Browser biasa
   Strategi:
   - Browser biasa → wa.me (Universal Link)
   - iOS WebView   → anchor target="_blank" ke wa.me
   - Android WebView → intent:// (buka app langsung)
   - Android browser → wa.me (sudah bekerja)
   ========================================================= */
(function () {
  'use strict';

  var PHONE = (window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '6285155070692';

  /* === DETEKSI PLATFORM === */
  var ua = navigator.userAgent || '';

  var isIOS = /iPad|iPhone|iPod/.test(ua) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  var isAndroid = /Android/i.test(ua);

  /* Deteksi WebView in-app (TikTok, IG, FB, dll) */
  var isWebView = /(TikTok|musical_ly|BytedanceWebview|FBAN|FBAV|Instagram|Twitter)/i.test(ua) ||
                  (isAndroid && /; wv\)/.test(ua));

  function buildWaMe(message) {
    var encoded = encodeURIComponent(message || '');
    return 'https://wa.me/' + PHONE + '?text=' + encoded;
  }

  function buildIntent(message) {
    var encoded = encodeURIComponent(message || '');
    /* Format intent:// untuk Android — buka WA app langsung */
    return 'intent://send?phone=' + PHONE + '&text=' + encoded +
           '#Intent;scheme=whatsapp;package=com.whatsapp;end';
  }

  function openWhatsApp(message) {
    var waMeUrl = buildWaMe(message);
    var intentUrl = buildIntent(message);

    /* ============================================
       SKENARIO 1: iOS (Safari atau WebView)
       Anchor target="_blank" = paling aman,
       tidak trigger error, tidak blank
       ============================================ */
    if (isIOS) {
      var a = document.createElement('a');
      a.href = waMeUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(a);
      try { a.click(); } catch (e) {
        window.open(waMeUrl, '_blank', 'noopener');
      }
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 300);
      return;
    }

    /* ============================================
       SKENARIO 2: Android di WebView (TikTok/IG/FB)
       intent:// = minta OS buka WA app langsung,
       tidak lewat browser, tidak minta download
       ============================================ */
    if (isAndroid && isWebView) {
      /* Fallback: kalau intent gagal, buka wa.me di _blank */
      var fallbackTimer = setTimeout(function () {
        /* Kalau setelah 800ms masih di sini, kemungkinan intent gagal */
        if (!document.hidden) {
          var a2 = document.createElement('a');
          a2.href = waMeUrl;
          a2.target = '_blank';
          a2.rel = 'noopener noreferrer';
          a2.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
          document.body.appendChild(a2);
          try { a2.click(); } catch (e) {}
          setTimeout(function () { if (a2.parentNode) a2.parentNode.removeChild(a2); }, 300);
        }
      }, 800);

      document.addEventListener('visibilitychange', function onVis() {
        if (document.hidden) clearTimeout(fallbackTimer);
      }, { once: true });

      /* Coba buka via intent */
      try {
        window.location.href = intentUrl;
      } catch (e) {
        clearTimeout(fallbackTimer);
        window.location.href = waMeUrl;
      }
      return;
    }

    /* ============================================
       SKENARIO 3: Android browser biasa / Desktop
       wa.me sudah bekerja sempurna
       ============================================ */
    var a3 = document.createElement('a');
    a3.href = waMeUrl;
    a3.target = '_blank';
    a3.rel = 'noopener noreferrer';
    a3.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(a3);
    try { a3.click(); } catch (e) {
      window.open(waMeUrl, '_blank', 'noopener');
    }
    setTimeout(function () { if (a3.parentNode) a3.parentNode.removeChild(a3); }, 300);
  }

  function bindAll() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-msg]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      openWhatsApp(el.getAttribute('data-msg'));
    }, true);

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

    console.log('%c[wa-fix] ✓ Universal opener aktif', 'color:#25d366;font-weight:bold;');
    console.log('  iOS:', isIOS, '| Android:', isAndroid, '| WebView:', isWebView);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
})();
