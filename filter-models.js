/* =========================================================
   filter-models.js — versi fuzzy match (lebih tahan typo)
   Hide model berdasarkan KEYWORD, bukan exact name
   ========================================================= */
(function () {
  'use strict';

  /* ============================================
     HIDE BY KEYWORD (case-insensitive, contains)
     Model di-hide kalau namanya MENGANDUNG keyword ini
     ============================================ */
  var HIDE_KEYWORDS = [
    'All New Vario 160'   // ← hide semua yang ada ini KECUALI yang ada di EXCLUDE
  ];

  /* ============================================
     PENGECUALIAN (model dengan keyword di atas
     TAPI tetap mau ditampilkan — misal yang baru)
     ============================================ */
  var EXCLUDE_KEYWORDS = [
    'EVO'                  // ← "Vario EVO 160" tetap tampil meski mengandung "Vario 160"
  ];

  /* ============================================
     JANGAN EDIT DI BAWAH INI
     ============================================ */

  var data = null;
  try {
    if (window.DATA_MOTOR && typeof window.DATA_MOTOR === 'object') data = window.DATA_MOTOR;
    else if (typeof DATA_MOTOR !== 'undefined' && DATA_MOTOR) data = DATA_MOTOR;
  } catch (e) {}

  if (!data) {
    console.error(
      '[filter-models] ❌ DATA_MOTOR tidak ditemukan.\n' +
      'Pastikan file ini di-load SETELAH data.js dan SEBELUM script utama app.'
    );
    return;
  }

  var total = Object.keys(data).length;
  var hidden = [];

  Object.keys(data).forEach(function (name) {
    var lower = name.toLowerCase();

    /* Cek apakah ada keyword yang cocok */
    var matchesHide = HIDE_KEYWORDS.some(function (kw) {
      return lower.indexOf(kw.toLowerCase()) !== -1;
    });
    if (!matchesHide) return;

    /* Cek apakah masuk pengecualian */
    var matchesExclude = EXCLUDE_KEYWORDS.some(function (kw) {
      return lower.indexOf(kw.toLowerCase()) !== -1;
    });
    if (matchesExclude) return;

    /* Hapus */
    delete data[name];
    hidden.push(name);
  });

  /* Log hasil */
  console.log(
    '%c[filter-models] ✓ ' + hidden.length + ' model di-hide',
    'color:#25d366;font-weight:bold;'
  );
  if (hidden.length) {
    hidden.forEach(function (n) { console.log('   ✂️', n); });
  } else {
    console.warn(
      '%c[filter-models] ⚠️ TIDAK ADA yang ke-hide!\n' +
      'Keyword tidak match. Cek daftar model yang ada:',
      'color:#ff9f0a;font-weight:bold;'
    );
    Object.keys(data).forEach(function (n) { console.log('   -', n); });
  }
  console.log('[filter-models] Sisa ' + Object.keys(data).length + ' dari ' + total + ' model');
})();
