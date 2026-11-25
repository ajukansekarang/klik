/* =========================================================
   gallery.js — swipe foto model (multi-warna)
   Foto: img/nama.jpg, img/nama-2.jpg, img/nama-3.jpg, ... maks 6
   Kalau cuma 1 foto → gallery tidak aktif (tampil normal)
   ========================================================= */
(function () {
  'use strict';

  var MAX_PHOTOS = 6;
  var IMG_BASE = 'img/';
  var IMG_EXT = '.jpg';
  var STYLE_ID = 'gallery-style';

  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function tryLoad(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = url;
    });
  }

  async function findPhotos(slug) {
    var photos = [];
    if (await tryLoad(IMG_BASE + slug + IMG_EXT)) photos.push(slug + IMG_EXT);
    else return photos;
    for (var i = 2; i <= MAX_PHOTOS; i++) {
      var f = slug + '-' + i + IMG_EXT;
      if (await tryLoad(IMG_BASE + f)) photos.push(f);
      else break;
    }
    return photos;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.model-hero.gallery-active{overflow:hidden;cursor:grab}',
      '.model-hero.gallery-active:active{cursor:grabbing}',
      '.gallery-track{display:flex;height:100%;width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;scroll-behavior:smooth;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}',
      '.gallery-track::-webkit-scrollbar{display:none}',
      '.gallery-slide{position:relative;flex:0 0 100%;height:100%;scroll-snap-align:start}',
      '.gallery-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:16px;pointer-events:none}',
      '.gallery-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;padding:6px 10px;background:rgba(0,0,0,0.42);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:999px;z-index:3}',
      '.gallery-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.5);transition:all .25s ease;cursor:pointer}',
      '.gallery-dot.is-active{background:#fff;width:18px;border-radius:4px}',
      '.gallery-counter{position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.5);color:#fff;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:3;letter-spacing:0.02em;pointer-events:none}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function buildGallery(heroEl, photos, modelName) {
    var tag = heroEl.querySelector('.tag');
    var tagClone = tag ? tag.cloneNode(true) : null;

    heroEl.innerHTML = '';
    heroEl.classList.add('gallery-active');

    var track = document.createElement('div');
    track.className = 'gallery-track';
    photos.forEach(function (file, idx) {
      var slide = document.createElement('div');
      slide.className = 'gallery-slide';
      var img = document.createElement('img');
      img.src = IMG_BASE + file;
      img.alt = modelName + ' foto ' + (idx + 1);
      img.loading = idx === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });
    heroEl.appendChild(track);

    if (tagClone) heroEl.appendChild(tagClone);

    var counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.textContent = '1 / ' + photos.length;
    heroEl.appendChild(counter);

    var dots = document.createElement('div');
    dots.className = 'gallery-dots';
    photos.forEach(function (_, idx) {
      var dot = document.createElement('div');
      dot.className = 'gallery-dot' + (idx === 0 ? ' is-active' : '');
      dot.addEventListener('click', function () {
        track.scrollTo({ left: track.offsetWidth * idx, behavior: 'smooth' });
      });
      dots.appendChild(dot);
    });
    heroEl.appendChild(dots);

    var lastIdx = 0;
    track.addEventListener('scroll', function () {
      var w = track.offsetWidth;
      if (!w) return;
      var idx = Math.round(track.scrollLeft / w);
      if (idx === lastIdx || idx < 0 || idx >= photos.length) return;
      lastIdx = idx;
      counter.textContent = (idx + 1) + ' / ' + photos.length;
      var dotEls = dots.querySelectorAll('.gallery-dot');
      for (var i = 0; i < dotEls.length; i++) dotEls[i].classList.toggle('is-active', i === idx);
    }, { passive: true });

    console.log('%c[gallery] ✓ ' + photos.length + ' foto → ' + modelName, 'color:#25d366;font-weight:bold;');
  }

  function initGallery(heroEl) {
    if (!heroEl || heroEl.dataset.galleryInit === '1') return;
    if (heroEl.querySelector('.gallery-track')) return;
    heroEl.dataset.galleryInit = '1';

    var mainImg = heroEl.querySelector('img');
    if (!mainImg) return;
    var modelName = mainImg.getAttribute('alt') || '';
    if (!modelName) return;

    var slug = slugify(modelName);
    if (!slug) return;

    findPhotos(slug).then(function (photos) {
      if (photos.length <= 1) return;
      buildGallery(heroEl, photos, modelName);
    }).catch(function (e) {
      console.warn('[gallery] error:', e);
    });
  }

  function scan(root) {
    if (!root) return;
    if (root.classList && root.classList.contains('model-hero')) initGallery(root);
    if (root.querySelectorAll) {
      var heroes = root.querySelectorAll('.model-hero');
      for (var i = 0; i < heroes.length; i++) initGallery(heroes[i]);
    }
  }

  injectStyle();

  function boot() {
    var app = document.getElementById('app');
    if (!app) { setTimeout(boot, 100); return; }
    scan(app);
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type !== 'childList') return;
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) scan(n);
        });
      });
    }).observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
