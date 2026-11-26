/* =========================================================
   wa-fix.js — Simple & Universal WhatsApp Opener
   
   Prinsip:
   - Anchor <a> native dengan target="_blank" (bukan JS navigation)
   - https://wa.me/... = Universal Link resmi WA
   - Override window.open (dipakai openWa() di file asli)
   - Return fake object → hindari fallback location.href (anti-blank)
   - Tidak ada UA detection, intent://, timer, atau fallback rumit
   ========================================================= */
(function () {
  'use strict';

  var origOpen = window.open;

  window.open = function (url, name, features) {
    /* Handle WhatsApp URLs dengan anchor bersih */
    if (url && typeof url === 'string' && (url.indexOf('wa.me') !== -1 || url.indexOf('whatsapp.com') !== -1)) {
      try {
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          if (a.parentNode) a.parentNode.removeChild(a);
        }, 100);
        console.log('%c[wa-fix] ✓ anchor click → ' + url.substring(0, 60) + '...', 'color:#25d366');
      } catch (e) {
        console.error('[wa-fix] gagal:', e);
      }
      /* Return fake object supaya file asli TIDAK fallback ke location.href (blank) */
      return { closed: false, focus: function () {} };
    }
    /* URL non-WA → teruskan ke window.open asli */
    return origOpen.apply(this, arguments);
  };

  console.log('%c[wa-fix] ✓ Aktif — metode: anchor _blank (paling universal)', 'color:#25d366;font-weight:bold;');
})();
