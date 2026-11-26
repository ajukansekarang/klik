/* =========================================================
   wa-fix.js — Versi Final: Selalu pakai wa.me (Direct, no error)
   
   Perbaikan:
   - Hapus total whatsapp:// (penyebab error di iOS)
   - Gunakan https://wa.me/... untuk semua perangkat
   - Hasil: iOS & Android sama-sama langsung buka app, tanpa dialog
   ========================================================= */
(function () {
  'use strict';

  // Ambil nomor dari config global, fallback ke nomor default
  var PHONE = (window.CONFIG && window.CONFIG.phone) ? window.CONFIG.phone : '6285155070692';

  /**
   * Buka WhatsApp dengan pesan tertentu.
   * Selalu pakai wa.me — tidak ada whatsapp://
   */
  function openWhatsApp(message) {
    var encodedMsg = encodeURIComponent(message || '');
    // Selalu pakai wa.me. Ini akan "direct" di iOS karena WhatsApp
    // sudah mendaftarkan domain ini sebagai Universal Link.
    var url = 'https://wa.me/' + PHONE + '?text=' + encodedMsg;
    
    // Gunakan location.href untuk navigasi langsung.
    // Ini biasanya tidak memicu popup blocker karena terjadi
    // di dalam event handler klik.
    window.location.href = url;
  }

  function bindAll() {
    /* 1. Semua elemen dengan data-msg (tombol hero, detail, dll) */
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-msg]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation(); // hentikan handler lama
      var msg = el.getAttribute('data-msg');
      openWhatsApp(msg);
    }, true); // capture phase

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
      
      // Tutup sheet manual
      var backdrop = document.getElementById('sheetBackdrop');
      var sheet = document.getElementById('actionSheet');
      if (backdrop) backdrop.classList.remove('is-open');
      if (sheet) sheet.classList.remove('is-open');
      document.body.style.overflow = '';
    }, true);

    console.log('[wa-fix] ✓ Aktif — Mode direct via wa.me (tanpa error dialog)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll);
  } else {
    bindAll();
  }
})();
