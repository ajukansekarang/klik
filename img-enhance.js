/* =========================================================
   img-enhance.js
   Addon: gambar fleksibel + thumbnail di menu Stok & Kredit
   Tidak mengubah kode asli. Cukup load setelah script utama.
   ========================================================= */
(function () {
  'use strict';

  function run() {

    /* === 1. INJECT CSS === */
    if (!document.getElementById('img-enhance-style')) {
      var style = document.createElement('style');
      style.id = 'img-enhance-style';
      style.textContent = [
        '/* Home card: frame lebih tinggi biar crop minimal */',
        '.model-img{height:180px !important}',
        '',
        '/* Detail hero: motor utuh, tidak kepotong */',
        '.model-hero img{object-fit:contain !important;padding:16px !important}',
        '.model-hero{background:linear-gradient(135deg,#fafafa,#f0f0f2) !important}',
        '',
        '/* Thumbnail di menu Stok & Kredit */',
        '.stok-item-emoji.stok-item-thumb,.kredit-emoji.stok-item-thumb{position:relative !important;overflow:hidden !important;padding:0 !important}',
        '.stok-item-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}'
      ].join('\n');
      document.head.appendChild(style);
    }

    /* === 2. TAMBAH THUMBNAIL KE CONTAINER === */
    function addThumb(container, name) {
      if (!container || !name || container.querySelector('img')) return;
      var slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (!slug) return;
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function () { img.remove(); };
      img.src = 'img/' + slug + '.jpg';
      container.insertBefore(img, container.firstChild);
      container.classList.add('stok-item-thumb');
    }

    /* === 3. ENHANCE ELEMEN === */
    function enhance(el) {
      if (!el || el.nodeType !== 1) return;

      /* Stok list item */
      if (el.classList && el.classList.contains('stok-item')) {
        var emoji = el.querySelector('.stok-item-emoji');
        var name = el.getAttribute('data-model');
        if (emoji && name) addThumb(emoji, name);
      }

      /* Kredit card */
      if (el.classList && el.classList.contains('kredit-card')) {
        var kem = el.querySelector('.kredit-emoji');
        var kname = el.getAttribute('data-kredit-card');
        if (kem && kname) addThumb(kem, kname);
      }

      /* Rekursif untuk container yang ditambah sekaligus */
      var children = el.querySelectorAll('.stok-item, .kredit-card');
      for (var i = 0; i < children.length; i++) enhance(children[i]);
    }

    /* === 4. INITIAL SCAN === */
    var app = document.getElementById('app');
    if (!app) return;
    enhance(app);

    /* === 5. WATCH: setiap kali render baru (search, filter, pindah menu) === */
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) enhance(node);
        });
      });
    });
    mo.observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
