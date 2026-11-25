/* =========================================================
   filter-models.js
   Hide model tanpa edit data.js — bisa dikembalikan kapan saja
   
   CARA PAKAI:
   - Tambah nama model ke array HIDDEN → model disembunyikan
   - Hapus nama dari array HIDDEN → model muncul lagi
   - Nama harus PERSIS sama dengan key di data.js (case-sensitive)
   ========================================================= */
(function () {
  'use strict';

  /* ============================================
     DAFTAR MODEL YANG DI-HIDE
     Tinggal edit array ini untuk hide/show
     ============================================ */
  var HIDDEN = [
    'All New Vario 160 CBS',
    'All New Vario 160 CBS ISS SP',
    'All New Vario 160 ABS'

    /* Contoh tambah model lain — hapus komentar untuk aktifkan:
    'New BeAT CBS ISS DELUXE SMARTKEY',
    'CBR 150 R STD - MH - RD',
    'CRF 250 L'
    */
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
    console.warn(
      '[filter-models] ❌ DATA_MOTOR tidak ditemukan.\n' +
      'Pastikan file ini di-load SETELAH data.js dan SEBELUM script utama app.'
    );
    return;
  }

  var total = Object.keys(data).length;
  var removed = 0;
  var notFound = [];

  for (var i = 0; i < HIDDEN.length; i++) {
    var name = HIDDEN[i];
    if (data[name]) {
      delete data[name];
      removed++;
    } else {
      notFound.push(name);
    }
  }

  console.log(
    '[filter-models] ✓ ' + removed + '/' + HIDDEN.length + ' model di-hide. ' +
    'Sisa ' + Object.keys(data).length + ' model dari ' + total + '.'
  );

  if (notFound.length) {
    console.warn(
      '[filter-models] ⚠️ Nama berikut tidak ditemukan di data.js (cek ejaan):\n' +
      notFound.join('\n')
    );
  }
})();
