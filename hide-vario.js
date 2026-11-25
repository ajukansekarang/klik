/* =========================================================
   hide-vario.js — sembunyikan model via DOM (force hide)
   100% jalan tanpa butuh match nama persis
   
   Hide: semua yang ada "vario 160" TAPI tidak ada "evo"
   Toggle: ubah HIDE_ACTIVE = false untuk mematikan
   ========================================================= */
(function () {
  'use strict';

  /* ============ TOGGLE ON/OFF ============ */
  var HIDE_ACTIVE = true;   // ← ubah ke false kalau mau semua muncul lagi

  /* ============ ATURAN HIDE ============ */
  /* Format: [keyword harus ada, keyword harus TIDAK ada] */
  var RULES = [
    ['vario 160', 'evo']    // ← hide "Vario 160" yang bukan "EVO"
    /* Tambah baris baru untuk hide model lain:
       ['cbr 150', 'abs'],      ← hide CBR 150 yang bukan ABS
       ['crf 250'],             ← hide semua CRF 250
       ['smartkey'],            ← hide semua Smartkey
    */
  ];

  if (!HIDE_ACTIVE) {
    console.log('[hide-vario] ⏸️ Dinonaktifkan (HIDE_ACTIVE = false)');
    return;
  }

  /* ============================================
     JANGAN EDIT DI BAWAH INI
     ============================================ */

  function shouldHide(text) {
    if (!text) return false;
    var lower = String(text).toLowerCase();
    for (var i = 0; i < RULES.length; i++) {
      var rule = RULES[i];
      var mustHave = rule[0];
      var mustNotHave = rule[1]; // bisa undefined
      if (lower.indexOf(mustHave) === -1) continue;
      if (mustNotHave && lower.indexOf(mustNotHave) !== -1) continue;
      return true;
    }
    return false;
  }

  /* Cek container: stok-item, kredit-card, atau model card */
  function checkEl(el) {
    if (!el || el.nodeType !== 1 || el.dataset.hideChecked === '1') return;

    var target = null;
    var text = '';

    if (el.classList.contains('stok-item')) {
      target = el;
      text = el.textContent;
    } else if (el.classList.contains('kredit-card')) {
      target = el;
      text = el.textContent;
    } else if (el.classList.contains('model')) {
      target = el;
      text = el.textContent;
    } else {
      return;
    }

    el.dataset.hideChecked = '1';

    if (shouldHide(text)) {
      target.style.display = 'none';
      target.dataset.hidden = '1';
      // Ambil nama model untuk log
      var nameEl = el.querySelector('strong, h3');
      var name = nameEl ? nameEl.textContent.trim() : '(tidak diketahui)';
      console.log('%c[hide-vario] ✂️ Dihide: ' + name, 'color:#ff8500');
    }
  }

  /* Scan semua elemen di root + turunannya */
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    checkEl(root);
    var items = root.querySelectorAll('.stok-item, .kredit-card, .model');
    for (var i = 0; i < items.length; i++) checkEl(items[i]);
  }

  /* Init */
  var app = document.getElementById('app');
  if (!app) {
    console.error('[hide-vario] ❌ #app tidak ditemukan');
    return;
  }

  scan(app);
  console.log('[hide-vario] ✓ Aktif — memantau semua card');

  /* Watch setiap perubahan DOM (screen baru, search, filter, dll) */
  var mo = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type !== 'childList') return;
      m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        scan(node);
        /* Kadang card muncul sebagai text node dulu, cek parent juga */
        if (node.parentElement) scan(node.parentElement);
      });
    });
  });
  mo.observe(app, { childList: true, subtree: true });

  /* Redirect kalau user akses detail via URL langsung */
  function checkRoute() {
    var hash = location.hash || '';
    if (hash.indexOf('/model/') !== 0) return;
    var raw = hash.slice(7);
    var name = '';
    try { name = decodeURIComponent(raw); } catch (e) { name = raw; }
    if (shouldHide(name)) {
      console.log('%c[hide-vario] 🚫 Detail "' + name + '" di-hide, kembali ke home', 'color:#ff8500');
      location.hash = '#/';
    }
  }
  checkRoute();
  window.addEventListener('hashchange', checkRoute);
})();
