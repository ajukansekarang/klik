(function () {
  'use strict';

  function boot() {
    var CONFIG = {
      phone: "6285155070692",
      brand: "Daya Motor Cibiru, Bandung",
      salesName: "Dion Prayoga",
      salesRole: "Sales Resmi Daya Motor Cibiru",
      socials: { tiktok: "bandung_honda", ig: "bandunghonda_", youtube: "bandung_honda" },
      defaultMessage: "Halo Dion, saya dari TikTok. Mau tanya-tanya soal motor Honda.",
      dpDefaultPct: 15,
      promo: {
        beatSeries: {
          dp: 700000,
          tenor: 35,
          perModel: {
            "New BeAT CBS": { triggerDp: 3000000, cicilan: 893000 },
            "New BeAT CBS ISS DELUXE": { triggerDp: 3200000, cicilan: 933000 },
            "New BeAT CBS ISS DELUXE SMARTKEY": { triggerDp: 3200000, cicilan: 960000 },
            "New BeAT Street": { triggerDp: 3200000, cicilan: 938000 }
          }
        }
      },
      images: { profil: "img/profil.jpg" },
      imageBase: "img/",
      imageExt: "jpg"
    };

    function readMotorData() {
      try { if (window.DATA_MOTOR && typeof window.DATA_MOTOR === 'object') return window.DATA_MOTOR; } catch (e) {}
      try { if (typeof DATA_MOTOR !== 'undefined' && DATA_MOTOR && typeof DATA_MOTOR === 'object') return DATA_MOTOR; } catch (e) {}
      return {};
    }
    var MOTOR_DATA = readMotorData();

    var FEATURED_KEYS = ["New BeAT CBS","SCOOPY Energetic & Fashion","All New Vario 125 CBS","PCX 160 CBS","ADV 160 CBS"];

    var MODEL_OVERRIDES = {
      "New BeAT CBS":{tag:"TERLARIS",tagline:"Paling irit untuk harian, cocok pemula",highlights:["Konsumsi BBM sangat irit","Ringan & mudah dikendarai","Biaya perawatan terjangkau","Cocok untuk pemula"]},
      "SCOOPY Energetic & Fashion":{tag:"RETRO",tagline:"Gaya retro unik, cocok untuk gaya hidup",highlights:["Desain retro stylish","Irit bahan bakar","Ringan & mudah dikendarai","Cocok untuk gaya hidup"]},
      "All New Vario 125 CBS":{tagline:"Nyaman untuk harian & jarak menengah",highlights:["Bagasi luas","Posisi berkendara nyaman","Mesin bertenaga","Desain premium"]},
      "PCX 160 CBS":{tag:"PREMIUM",tagline:"Premium untuk jarak jauh",highlights:["Fitur lengkap & modern","Nyaman untuk touring","Desain elegan","Performa bertenaga"]},
      "ADV 160 CBS":{tagline:"Gaya adventure, tangguh di segala medan",highlights:["Desain adventure","Tangguh di segala medan","Posisi berkendara tegak","Performa bertenaga"]}
    };

    var CATEGORIES = [
      { key:"matic", label:"Skutik", icon:"🛵", models:["New BeAT CBS","New BeAT CBS ISS DELUXE","New BeAT CBS ISS DELUXE SMARTKEY","New BeAT Street","GENIO CBS","GENIO CBS White & White Red Blue","GENIO CBS ISS","SCOOPY Energetic & Fashion","SCOOPY Prestige & Stylish","All New Vario 125 CBS","All New Vario 125 CBS ISS","New Vario 125 Street","All New Vario 160 CBS","All New Vario 160 CBS ISS SP","All New Vario 160 ABS","VARIO EVO 160 CBS","VARIO EVO 160 CBS NITRO","VARIO EVO 160 ABS","PCX 160 CBS","PCX 160 ABS","PCX 160 ABS ROADSYNC","ADV 160 CBS","ADV 160 ABS","ADV 160 ABS ROADSYNC","New Stylo 160 CBS","New Stylo 160 ABS","New Stylo 160 ABS SE","FORZA"]},
      { key:"bebek", label:"Bebek", icon:"🏍️", models:["NEW REVO FIT FI MMC","NEW REVO X","New Supra X 125 FI SW","New Supra X 125 FI CW","New Supra GTR 150 Sporty","New Supra GTR 150 Exclusive","NEW SONIC 150 Standar MMC","SONIC 150 R SE Racing Red & Matte Black"]},
      { key:"sport", label:"Sport", icon:"🏁", models:["CB 150 X SE","CB 150 X STD","ALL NEW CB 150 R STREETFIRE STD","ALL NEW CB 150 R STREETFIRE SE","CBR 150 R STD - BK","CBR 150 R STD - MH - RD","CBR 150 R ABS - BK","CBR 150 R ABS - RD","NEW CBR 250 RR STANDAR BLACK FREEDOM","NEW CBR 250 RR STANDAR MAT GUNPOWDER BLACK METALIC","NEW CBR 250 RR ABS MYSTIQUE BLUE","NEW CBR 250 RR ABS QS BRAVERY RED BLACK","NEW CBR 250 RR QS RACING RED & TRI-COLOR","CRF 250 RALLY","CRF 250 L","CB150 VERZA STD","CB150 VERZA CW"]},
      { key:"lifestyle", label:"Lifestyle", icon:"✨", models:["MONKEY 125","ST 125 DAX","SUPERCUB C125","CT 125"]},
      { key:"ev", label:"EV", icon:"⚡", models:["EM1 e: + Charger","EM1 e Plus: + Charger","CUV eplus: + Charger","ICON E"]}
    ];

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
      });
    }
    function formatRp(n) {
      if (n === null || n === undefined || isNaN(n)) return '—';
      return 'Rp ' + Number(n).toLocaleString('id-ID');
    }
    function imgTag(src, alt) {
      if (!src) return '';
      return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" onerror="this.remove()">';
    }

    function getAllModelNames(){ return Object.keys(MOTOR_DATA); }
    function getModelData(name){ return MOTOR_DATA[name] || null; }
    function getCategoryOf(name){
      for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].models.indexOf(name) !== -1) return CATEGORIES[i];
      return null;
    }
    function getEmojiFor(name){ var c = getCategoryOf(name); return c ? c.icon : '🏍️'; }
    function isBeatSeries(name){ return /beat/i.test(name); }
    function getPromoConfig(name){ var map = CONFIG.promo.beatSeries.perModel || {}; return map[name] || null; }
    function getPromoTriggerDp(name){ var c = getPromoConfig(name); return c ? c.triggerDp : null; }
    function getPromoCicilan(name){ var c = getPromoConfig(name); return c ? c.cicilan : null; }
    function isPromoAvailable(name){
      var p = CONFIG.promo.beatSeries;
      if (!p || p.dp <= 0 || p.tenor <= 0) return false;
      var c = getPromoConfig(name);
      if (!c) return false;
      var model = getModelData(name);
      if (!model) return false;
      var opts = getAllDpOptions(model);
      return opts.indexOf(c.triggerDp) !== -1 && c.cicilan > 0;
    }

    function getModelMeta(name){
      var ov = MODEL_OVERRIDES[name] || {};
      var cat = getCategoryOf(name);
      return {
        key: name, name: name, emoji: getEmojiFor(name),
        category: cat ? cat.key : '',
        tag: ov.tag || null,
        tagline: ov.tagline || (cat ? 'Honda ' + name : 'Cek harga OTR & simulasi kredit'),
        description: ov.description || ('Motor Honda ' + name + '. Harga OTR terbaru dan simulasi kredit FIFGROUP tersedia.'),
        highlights: ov.highlights || ['Harga OTR terbaru','Simulasi kredit tersedia','Konsultasi via WhatsApp','Sales resmi Honda']
      };
    }

    function getAllDpOptions(model){
      if (!model || !model.tabel) return [];
      return Object.keys(model.tabel).map(Number).sort(function(a,b){ return a-b; });
    }
    function getSliderDpOptions(model){ return getAllDpOptions(model); }

    function getDefaultDp(name){
      var model = getModelData(name);
      if (!model) return null;
      var opts = getSliderDpOptions(model);
      if (!opts.length) return null;
      var triggerDp = getPromoTriggerDp(name);
      if (triggerDp !== null && opts.indexOf(triggerDp) !== -1) return triggerDp;
      var target = (model.harga || 0) * (CONFIG.dpDefaultPct / 100);
      return opts.reduce(function(best, cur){ return Math.abs(cur - target) < Math.abs(best - target) ? cur : best; }, opts[0]);
    }

    function getCicilanHeader(name){
      var model = getModelData(name);
      if (!model) return null;
      var opts = getSliderDpOptions(model);
      if (!opts.length) return null;
      var triggerDp = getPromoTriggerDp(name);
      if (triggerDp !== null && opts.indexOf(triggerDp) !== -1) {
        var tbl0 = model.tabel[String(triggerDp)];
        var t35 = tbl0 && tbl0[35];
        if (t35) return { dp: triggerDp, tenor: 35, cicilan: t35 };
      }
      var target = (model.harga || 0) * (CONFIG.dpDefaultPct / 100);
      var dpClose = opts.reduce(function(best, cur){ return Math.abs(cur - target) < Math.abs(best - target) ? cur : best; }, opts[0]);
      var tbl = model.tabel[String(dpClose)];
      if (!tbl) return null;
      var tenors = Object.keys(tbl).map(Number).sort(function(a,b){ return b-a; });
      if (!tenors.length) return null;
      var t = tbl[35] ? 35 : tenors[0];
      return { dp: dpClose, tenor: t, cicilan: tbl[String(t)] };
    }

    function getTenors(model, dp){
      if (!model || !model.tabel) return [];
      var t = model.tabel[String(dp)];
      if (!t) return [];
      return Object.keys(t).map(Number).sort(function(a,b){ return a-b; });
    }

    function slugify(s) {
      return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function getImageForModel(name) {
      if (CONFIG.images[name]) return CONFIG.images[name];
      if (!CONFIG.imageBase) return '';
      return CONFIG.imageBase + slugify(name) + '.' + (CONFIG.imageExt || 'jpg');
    }

    /* ====================================================
       ANIMATION ENGINE — Lenis + GSAP + IntersectionObserver
       ==================================================== */
    var Anim = (function(){
      var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var hasGSAP = typeof gsap !== 'undefined';
      var hasLenis = typeof Lenis !== 'undefined';
      var activeLenis = new Set();
      var rafRunning = false;

      if (!hasGSAP) document.documentElement.classList.add('no-anim');

      function tickLenis(t){
        activeLenis.forEach(function(l){ l.raf(t); });
        if (activeLenis.size > 0) requestAnimationFrame(tickLenis);
        else rafRunning = false;
      }
      function startRaf(){
        if (rafRunning) return;
        rafRunning = true;
        requestAnimationFrame(tickLenis);
      }

      function initLenis(screenEl){
        if (!hasLenis || RM) return;
        var inner = screenEl.querySelector('.screen-inner');
        if (!inner) return;
        try {
          var lenis = new Lenis({
            wrapper: screenEl,
            content: inner,
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.075,
            touchInertiaMultiplier: 15,
            wheelMultiplier: 1,
            duration: 1.15,
            easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
          });
          screenEl.__lenis = lenis;
          activeLenis.add(lenis);
          startRaf();
        } catch (e) {}
      }

      function initHero(screenEl){
        if (!hasGSAP || RM) return;
        var hero = screenEl.querySelector('.hero');
        if (hero) {
          var tl = gsap.timeline({ delay: 0.08, defaults: { ease: 'power3.out' } });
          var av = hero.querySelector('.profile-avatar');
          var info = hero.querySelector('.profile-info');
          var bd = hero.querySelector('.badge');
          var h1 = hero.querySelector('h1');
          var pp = hero.querySelector('p');
          var cta = hero.querySelector('.hero-cta');
          if (av) tl.from(av, { scale: 0.5, opacity: 0, duration: 0.55, ease: 'back.out(2.4)' });
          if (info) tl.from(info, { x: -18, opacity: 0, duration: 0.45 }, '-=0.35');
          if (bd) tl.from(bd, { x: 18, opacity: 0, duration: 0.45 }, '-=0.4');
          if (h1) tl.from(h1, { y: 26, opacity: 0, duration: 0.65 }, '-=0.3');
          if (pp) tl.from(pp, { y: 16, opacity: 0, duration: 0.5 }, '-=0.45');
          if (cta) tl.from(cta, { y: 16, opacity: 0, duration: 0.5 }, '-=0.4');
        }
        var dh = screenEl.querySelector('.detail-header');
        if (dh) gsap.from(dh, { y: -24, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.05 });
        var mh = screenEl.querySelector('.model-hero');
        if (mh) gsap.from(mh, { opacity: 0, scale: 1.04, duration: 0.7, ease: 'power2.out', delay: 0.1 });
      }

      function initReveals(screenEl){
        if (!hasGSAP || RM) {
          screenEl.querySelectorAll('.reveal').forEach(function(el){
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
          return;
        }
        var els = screenEl.querySelectorAll('.reveal');
        if (!els.length) return;
        var io = new IntersectionObserver(function(entries){
          var idx = 0;
          entries.forEach(function(entry){
            if (!entry.isIntersecting) return;
            var el = entry.target;
            io.unobserve(el);
            gsap.to(el, { opacity: 1, y: 0, duration: 0.75, delay: idx * 0.07, ease: 'power3.out', overwrite: true });
            idx++;
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        els.forEach(function(el){ io.observe(el); });
        screenEl.__revealIO = io;
      }

      function initFloatWa(screenEl){
        var hero = screenEl.querySelector('.hero');
        if (!hero || !floatWa) return;
        var io = new IntersectionObserver(function(entries){
          var e = entries[0];
          if (!screenEl.classList.contains('is-active')) return;
          if (e.isIntersecting) floatWa.classList.add('is-hidden');
          else floatWa.classList.remove('is-hidden');
        }, { threshold: 0.05 });
        io.observe(hero);
        screenEl.__heroIO = io;
      }

      function init(screenEl){
        initLenis(screenEl);
        initHero(screenEl);
        initReveals(screenEl);
        initFloatWa(screenEl);
      }

      function destroy(screenEl){
        if (screenEl.__lenis) {
          activeLenis.delete(screenEl.__lenis);
          try { screenEl.__lenis.destroy(); } catch (e) {}
          screenEl.__lenis = null;
        }
        if (screenEl.__revealIO) { screenEl.__revealIO.disconnect(); screenEl.__revealIO = null; }
        if (screenEl.__heroIO) { screenEl.__heroIO.disconnect(); screenEl.__heroIO = null; }
      }

      return { init: init, destroy: destroy };
    })();

    /* ==================================================== */

    var app = document.getElementById('app');
    var floatWa = document.getElementById('floatWa');
    var NAV_DURATION = 420;
    var stack = [];
    var animating = false;
    var pendingKreditModel = null;
    var pendingSheetModel = null;
    var sheetPushedHistory = false;
    var historyOK = false;
    var stokFilter = { q: '', cat: 'all' };
    var kreditFilter = { q: '', cat: 'all' };

    function waLink(msg){ return 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(msg || CONFIG.defaultMessage); }
    function openWa(msg, btnEl){
      if (btnEl && btnEl.classList.contains('is-loading')) return;
      if (btnEl) { btnEl.classList.add('is-loading'); setTimeout(function(){ btnEl.classList.remove('is-loading'); }, 700); }
      var url = waLink(msg);
      var win = null;
      try { win = window.open(url, '_blank', 'noopener'); } catch (e) {}
      if (!win) { try { window.location.href = url; } catch (e2) {} }
    }

    function routeToHash(route){
      if (route.indexOf('/model/') === 0) return '/model/' + encodeURIComponent(route.slice(7));
      return route || '/';
    }
    function hashToRoute(hash){
      var path = hash && hash.charAt(0) === '#' ? hash.slice(1) : (hash || '');
      if (!path) return '/';
      if (path.indexOf('/model/') === 0) {
        var raw = path.slice(7);
        try { return '/model/' + decodeURIComponent(raw); } catch (e) { return '/model/' + raw; }
      }
      return path;
    }
    function safePush(route){ try { history.pushState({ route: route }, '', '#' + routeToHash(route)); historyOK = true; } catch (e) { historyOK = false; } }
    function safeReplace(route){ try { history.replaceState({ route: route }, '', '#' + routeToHash(route)); historyOK = true; } catch (e) { historyOK = false; } }

    function expandKreditModel(screenEl, name){
      var cards = screenEl.querySelectorAll('[data-kredit-card]');
      var card = null;
      for (var i = 0; i < cards.length; i++) if (cards[i].getAttribute('data-kredit-card') === name) { card = cards[i]; break; }
      if (!card) return;
      var opened = screenEl.querySelectorAll('.kredit-card.open');
      for (var j = 0; j < opened.length; j++) if (opened[j] !== card) opened[j].classList.remove('open');
      card.classList.add('open');
      setTimeout(function(){
        try {
          if (screenEl.__lenis) screenEl.__lenis.scrollTo(card, { offset: -70, duration: 0.9 });
          else card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {}
      }, 120);
    }

    var sheetBackdrop = document.getElementById('sheetBackdrop');
    var actionSheet = document.getElementById('actionSheet');

    function openActionSheet(name){
      var data = getModelData(name);
      if (!data) return;
      pendingSheetModel = name;
      document.getElementById('sheetTitle').textContent = name;
      document.getElementById('sheetSub').textContent = 'OTR ' + formatRp(data.harga);
      if (sheetBackdrop) sheetBackdrop.classList.add('is-open');
      if (actionSheet) actionSheet.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      try { history.pushState({ actionSheet: true }, '', location.hash || '#/'); sheetPushedHistory = true; }
      catch (e) { sheetPushedHistory = false; }
    }
    function closeActionSheet(skipHistory){
      if (sheetBackdrop) sheetBackdrop.classList.remove('is-open');
      if (actionSheet) actionSheet.classList.remove('is-open');
      document.body.style.overflow = '';
      pendingSheetModel = null;
      if (sheetPushedHistory) {
        sheetPushedHistory = false;
        if (!skipHistory) { try { history.back(); } catch (e) {} }
      }
    }

    function updateKonsultasiBtn(card){
      var btn = card.querySelector('[data-konsultasi]');
      if (!btn) return;
      var name = btn.getAttribute('data-konsultasi');
      var isPromo = card.classList.contains('promo-active');
      var selDp = card.getAttribute('data-sel-dp');
      var selTenor = card.getAttribute('data-sel-tenor');
      var selCicilan = card.getAttribute('data-sel-cicilan');
      btn.classList.remove('has-selection', 'promo-ready');
      if (isPromo) {
        var p = CONFIG.promo.beatSeries;
        var cicilan = getPromoCicilan(name);
        btn.innerHTML = '⚡ Ambil Promo · ' + formatRp(cicilan) + '/bln · ' + p.tenor + ' bln';
        btn.classList.add('promo-ready');
        return;
      }
      if (selTenor && selCicilan && selDp) {
        btn.innerHTML = '✅ Ajukan Pilihan · ' + formatRp(+selCicilan) + '/bln · ' + selTenor + ' bln';
        btn.classList.add('has-selection');
        return;
      }
      btn.innerHTML = '💬 Konsultasi Kredit';
    }

    function resetSelection(card){
      if (!card) return;
      card.setAttribute('data-sel-dp', '');
      card.setAttribute('data-sel-tenor', '');
      card.setAttribute('data-sel-cicilan', '');
      var rows = card.querySelectorAll('.tenor-row.is-selected');
      for (var i = 0; i < rows.length; i++) rows[i].classList.remove('is-selected');
      updateKonsultasiBtn(card);
    }

    function buildKonsultasiMsg(card){
      var btn = card.querySelector('[data-konsultasi]');
      if (!btn) return CONFIG.defaultMessage;
      var name = btn.getAttribute('data-konsultasi');
      var isPromo = card.classList.contains('promo-active');
      if (isPromo) {
        var p = CONFIG.promo.beatSeries;
        var cicilan = getPromoCicilan(name);
        return 'Halo Dion, saya dari TikTok. Mau ambil PROMO ' + name + ': DP ' + formatRp(p.dp) + ', tenor ' + p.tenor + ' bulan, cicilan ' + formatRp(cicilan) + '/bulan.';
      }
      var selDp = card.getAttribute('data-sel-dp');
      var selTenor = card.getAttribute('data-sel-tenor');
      var selCicilan = card.getAttribute('data-sel-cicilan');
      if (selTenor && selCicilan && selDp) {
        return 'Halo Dion, saya dari TikTok. Mau kredit ' + name + ' dengan DP ' + formatRp(+selDp) + ', tenor ' + selTenor + ' bulan, cicilan ' + formatRp(+selCicilan) + '/bulan.';
      }
      return 'Halo Dion, saya dari TikTok. Mau konsultasi kredit ' + name + '.';
    }

    function renderHero(){
      var initial = (CONFIG.salesName || 'S').trim().charAt(0).toUpperCase();
      return '<header class="hero">'
        + '<div class="hero-blob"></div>'
        + '<div class="wrap">'
        +   '<div class="hero-top">'
        +     '<div class="hero-profile">'
        +       '<div class="profile-avatar">' + imgTag(CONFIG.images.profil, CONFIG.salesName) + '<span>' + esc(initial) + '</span></div>'
        +       '<div class="profile-info"><strong>' + esc(CONFIG.salesName) + '</strong><span>' + esc(CONFIG.salesRole) + '</span></div>'
        +     '</div>'
        +     '<div class="badge"><span class="dot"></span> Online</div>'
        +   '</div>'
        +   '<h1>Sales Resmi Honda Bandung</h1>'
        +   '<p>Harga OTR &amp; simulasi kredit FIFGROUP. Tanya stok, kredit, atau test ride via WhatsApp.</p>'
        +   '<a class="hero-cta" data-msg="' + esc(CONFIG.defaultMessage) + '">💬 Chat WhatsApp</a>'
        + '</div></header>';
    }

    function renderSocials(){
      var s = CONFIG.socials;
      var items = [
        { cls:'social-tiktok', url: s.tiktok ? 'https://tiktok.com/@' + s.tiktok : '', label: s.tiktok ? '@' + s.tiktok : 'TikTok', icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 7.32a4.86 4.86 0 0 1-3.6-1.66v7.62a5.6 5.6 0 1 1-5.6-5.6c.19 0 .37.01.55.03v2.9a2.7 2.7 0 1 0 1.9 2.59V2h2.9a4.86 4.86 0 0 0 4.85 4.7v.62Z"/></svg>' },
        { cls:'social-ig', url: s.ig ? 'https://instagram.com/' + s.ig : '', label: s.ig ? '@' + s.ig : 'Instagram', icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.5.01-4.73.07-1.14.05-1.76.24-2.17.4a2.4 2.4 0 0 0-.87.58 2.4 2.4 0 0 0-.58.87c-.16.41-.35 1.03-.4 2.17-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.05 1.14.24 1.76.4 2.17.14.36.34.66.58.87.21.24.51.44.87.58.41.16 1.03.35 2.17.4 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c1.14-.05 1.76-.24 2.17-.4.36-.14.66-.34.87-.58.24-.21.44-.51.58-.87.16-.41.35-1.03.4-2.17.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.05-1.14-.24-1.76-.4-2.17a2.4 2.4 0 0 0-.58-.87 2.4 2.4 0 0 0-.87-.58c-.41-.16-1.03-.35-2.17-.4-1.23-.06-1.58-.07-4.73-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 1.8a3.18 3.18 0 1 0 0 6.36 3.18 3.18 0 0 0 0-6.36Zm5.16-2.2a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32Z"/></svg>' },
        { cls:'social-yt', url: s.youtube ? 'https://youtube.com/@' + s.youtube : '', label: s.youtube ? '@' + s.youtube : 'YouTube', icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.4.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.13c1.9.52 9.4.52 9.4.52s7.5 0 9.4-.52a3 3 0 0 0 2.1-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"/></svg>' }
      ];
      var html = '<div class="socials reveal">';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var href = it.url ? ' href="' + esc(it.url) + '" target="_blank" rel="noopener"' : '';
        html += '<a class="social ' + it.cls + '"' + href + '><div class="social-icon">' + it.icon + '</div><span>' + esc(it.label) + '</span></a>';
      }
      return html + '</div>';
    }

    function renderFeaturedCards(){
      var html = '';
      for (var i = 0; i < FEATURED_KEYS.length; i++) {
        var name = FEATURED_KEYS[i];
        var data = getModelData(name);
        if (!data) continue;
        var meta = getModelMeta(name);
        var tagCls = meta.tag === 'PREMIUM' ? ' tag-dark' : '';
        html += '<a class="model reveal" data-nav="/model/' + esc(name) + '">'
          + '<div class="model-img">'
          +   imgTag(getImageForModel(name), name)
          +   (meta.tag ? '<span class="tag' + tagCls + '">' + meta.tag + '</span>' : '')
          +   '<span>' + meta.emoji + '</span>'
          + '</div>'
          + '<div class="model-body">'
          +   '<h3>' + esc(name) + '</h3>'
          +   '<p>' + esc(meta.tagline) + '</p>'
          +   '<div class="model-price">OTR ' + formatRp(data.harga) + '</div>'
          +   '<span class="model-btn">Lihat Detail →</span>'
          + '</div></a>';
      }
      return html;
    }

    function renderHome(){
      return renderHero()
        + '<main class="wrap">'
        + renderSocials()
        + '<section>'
        +   '<div class="section-head reveal"><h2 class="section-title">Pilih Kebutuhanmu</h2><p class="section-sub">Cek harga OTR &amp; stok, atau simulasi kredit.</p></div>'
        +   '<div class="actions">'
        +     '<a class="action reveal" data-nav="/stok"><div class="action-ico">🏍️</div><div class="action-body"><strong>Tanya Stok &amp; Harga</strong><span>' + getAllModelNames().length + ' model Honda</span></div><div class="action-arrow">›</div></a>'
        +     '<a class="action reveal" data-nav="/kredit"><div class="action-ico">💰</div><div class="action-body"><strong>Simulasi Kredit</strong><span>DP &amp; cicilan FIFGROUP</span></div><div class="action-arrow">›</div></a>'
        +   '</div>'
        + '</section>'
        + '<section>'
        +   '<div class="section-head reveal"><h2 class="section-title">Model Favorit</h2><p class="section-sub">Klik model untuk lihat detail &amp; harga.</p></div>'
        +   '<div class="models">' + renderFeaturedCards() + '</div>'
        + '</section>'
        + '<section>'
        +   '<div class="section-head reveal"><h2 class="section-title">Kenapa Beli dari Saya?</h2><p class="section-sub">Bukan calo. Sales resmi, proses transparan.</p></div>'
        +   '<div class="trust reveal">'
        +     '<div class="trust-item"><div class="trust-ico">✓</div><div><strong>Unit ready &amp; bisa dilihat</strong><span>Stok fisik tersedia, bisa cek langsung sebelum beli.</span></div></div>'
        +     '<div class="trust-item"><div class="trust-ico">✓</div><div><strong>Bantu proses kredit</strong><span>Dibantu sampai disetujui, tanpa biaya tersembunyi.</span></div></div>'
        +     '<div class="trust-item"><div class="trust-ico">✓</div><div><strong>Sales resmi Honda</strong><span>Bukan perantara. Legal, aman, dan terpercaya.</span></div></div>'
        +   '</div>'
        + '</section>'
        + '<section>'
        +   '<div class="terms reveal"><h3>Syarat &amp; Ketentuan</h3><p>Harga OTR dan simulasi kredit bersifat estimasi berdasarkan pricelist FIFGROUP, dapat berubah sewaktu-waktu tanpa pemberitahuan. Cicilan belum termasuk diskon dan potongan tenor. Harga final, ketersediaan unit, dan persetujuan kredit akan dikonfirmasi langsung via WhatsApp.</p></div>'
        + '</section>'
        + '</main>'
        + '<footer>© ' + new Date().getFullYear() + ' ' + esc(CONFIG.brand) + ' · ' + esc(CONFIG.salesName) + '</footer>';
    }

    function renderBackHeader(title){
      return '<header class="detail-header">'
        + '<button class="back-btn" data-back aria-label="Kembali">'
        +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><polyline points="15 18 9 12 15 6"></polyline></svg>'
        + '</button>'
        + '<span class="detail-title">' + esc(title) + '</span>'
        + '<div style="width:42px;flex-shrink:0"></div>'
        + '</header>';
    }

    function renderHargaCard(name){
      var data = getModelData(name);
      if (!data) return '';
      var cicilanHeader = getCicilanHeader(name);
      var html = '<div class="harga-card reveal">'
        + '<div class="harga-section"><div class="harga-label">Harga OTR</div><div class="harga-value">' + formatRp(data.harga) + '</div></div>';
      if (cicilanHeader) {
        html += '<div class="harga-section"><div class="harga-label">Cicilan Mulai</div><div class="harga-value">' + formatRp(cicilanHeader.cicilan) + '<small>/bln</small></div><div class="harga-note">Tenor ' + cicilanHeader.tenor + ' bulan · DP ' + formatRp(cicilanHeader.dp) + '</div></div>';
      }
      html += '<a class="harga-cta" data-nav="/kredit" data-expand-kredit="' + esc(name) + '">Lihat Semua Simulasi Kredit →</a></div>';
      return html;
    }

    function renderModelDetail(name){
      var data = getModelData(name);
      if (!data) return renderNotFound();
      var meta = getModelMeta(name);
      var tagHtml = meta.tag ? '<span class="tag' + (meta.tag === 'PREMIUM' ? ' tag-dark' : '') + '">' + meta.tag + '</span>' : '';
      var hl = '';
      for (var i = 0; i < meta.highlights.length; i++) hl += '<li>' + esc(meta.highlights[i]) + '</li>';
      return renderBackHeader(name)
        + '<div class="model-hero">' + imgTag(getImageForModel(name), name) + tagHtml + '<span>' + meta.emoji + '</span></div>'
        + '<div class="wrap" style="padding-top:24px">'
        +   '<h2 class="detail-h2">' + esc(name) + '</h2>'
        +   '<p class="detail-tagline">' + esc(meta.tagline) + '</p>'
        +   '<p class="detail-desc">' + esc(meta.description) + '</p>'
        +   renderHargaCard(name)
        +   '<div><h3 class="detail-h3 reveal">Keunggulan</h3><ul class="highlights reveal">' + hl + '</ul></div>'
        +   '<div class="cta-block reveal"><a class="wa-btn" data-msg="Halo Dion, saya dari TikTok. Mau tanya stok &amp; harga ' + esc(name) + '.">💬 Tanya Stok &amp; Harga</a></div>'
        + '</div>';
    }

    function filterModelsByState(f){
      var names = getAllModelNames();
      if (f.cat !== 'all') {
        var cat = null;
        for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === f.cat) { cat = CATEGORIES[i]; break; }
        if (cat) names = names.filter(function(n){ return cat.models.indexOf(n) !== -1; });
      }
      if (f.q) {
        var q = f.q.toLowerCase();
        names = names.filter(function(n){ return n.toLowerCase().indexOf(q) !== -1; });
      }
      return names;
    }

    function renderFilterBar(f, prefix){
      var html = '<div class="filter-bar"><div class="search-wrap">'
        + '<input type="search" class="search-input" data-search="' + prefix + '" placeholder="Cari model... (mis. Beat, Vario, PCX)" value="' + esc(f.q) + '" autocomplete="off"></div>'
        + '<div class="cat-tabs">'
        + '<button class="cat-chip' + (f.cat === 'all' ? ' is-active' : '') + '" data-cat="' + prefix + ':all">Semua</button>';
      for (var i = 0; i < CATEGORIES.length; i++) {
        var c = CATEGORIES[i];
        html += '<button class="cat-chip' + (f.cat === c.key ? ' is-active' : '') + '" data-cat="' + prefix + ':' + c.key + '">' + esc(c.label) + '</button>';
      }
      return html + '</div></div>';
    }

    function renderStokList(){
      var names = filterModelsByState(stokFilter);
      if (!names.length) return '<div class="empty-state">Tidak ada model yang cocok. Coba kata kunci lain.</div>';
      var html = '';
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var data = getModelData(name);
        if (!data) continue;
        var meta = getModelMeta(name);
        html += '<a class="stok-item" href="#" data-model="' + esc(name) + '">'
          + '<div class="stok-item-emoji">' + meta.emoji + '</div>'
          + '<div class="stok-item-info"><strong>' + esc(name) + '</strong><span>OTR ' + formatRp(data.harga) + '</span></div>'
          + '<div class="stok-item-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="9 18 15 12 9 6"></polyline></svg></div>'
          + '</a>';
      }
      return html;
    }

    function renderStok(){
      return renderBackHeader('Stok & Harga')
        + '<div class="wrap" style="padding-top:8px">'
        +   '<p class="detail-desc reveal" style="margin-bottom:2px">Daftar harga OTR semua model Honda. Tap model untuk pilih cash atau kredit.</p>'
        +   renderFilterBar(stokFilter, 'stok')
        +   '<div id="stok-list-container">' + renderStokList() + '</div>'
        + '</div>';
    }

    function renderTenorRows(name, dp){
      var data = getModelData(name);
      if (!data) return '';
      var tenors = getTenors(data, dp);
      var tbl = data.tabel[String(dp)] || {};
      var html = '';
      for (var i = 0; i < tenors.length; i++) {
        var t = tenors[i];
        var cicilan = tbl[t];
        html += '<button class="tenor-row" type="button" data-dp="' + dp + '" data-tenor="' + t + '" data-cicilan="' + cicilan + '" aria-pressed="false">'
          + '<div class="tenor-dur">' + t + ' bulan</div>'
          + '<div class="tenor-cicilan">' + formatRp(cicilan) + '<small>/bln</small></div>'
          + '<div class="tenor-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="9 18 15 12 9 6"></polyline></svg></div>'
          + '</button>';
      }
      return html;
    }

    function renderDpSlider(name, currentDp){
      var data = getModelData(name);
      if (!data) return '';
      var opts = getSliderDpOptions(data);
      if (!opts.length) return '';
      var idx = opts.indexOf(currentDp);
      if (idx < 0) idx = 0;
      var minDp = opts[0];
      var maxDp = opts[opts.length - 1];
      var pct = opts.length > 1 ? (idx / (opts.length - 1)) * 100 : 0;
      var triggerDp = getPromoTriggerDp(name);
      var isAtTrigger = triggerDp !== null && opts[idx] === triggerDp;
      var hasPromo = isBeatSeries(name) && isPromoAvailable(name);
      var p = CONFIG.promo.beatSeries;
      var promoHtml = '';
      if (hasPromo) {
        promoHtml = '<div class="promo-container' + (isAtTrigger ? ' is-visible' : '') + '" data-promo-container="' + esc(name) + '">'
          + '<div class="promo-divider">atau</div>'
          + '<button class="promo-btn" data-promo-toggle="' + esc(name) + '" type="button">⚡ Coba DP Promo ' + formatRp(p.dp) + ' · Tenor ' + p.tenor + ' bulan</button></div>';
      }
      return '<div class="dp-slider-wrap" data-dp-wrap="' + esc(name) + '">'
        + '<div class="dp-display"><div><span class="dp-display-label">DP Dipilih</span><span class="dp-display-sub" data-dp-sub>Geser untuk ubah DP</span></div>'
        + '<span class="dp-display-value" data-dp-value>' + formatRp(opts[idx]) + '</span></div>'
        + '<input type="range" class="dp-slider" data-model="' + esc(name) + '" min="0" max="' + (opts.length - 1) + '" value="' + idx + '" step="1" style="--pct: ' + pct + '%" aria-label="Geser untuk atur DP">'
        + '<div class="dp-slider-labels"><span>' + formatRp(minDp) + '</span><span>' + formatRp(maxDp) + '</span></div>'
        + '<div class="dp-note">Belum termasuk diskon &amp; potongan tenor</div>'
        + promoHtml + '</div>';
    }

    function renderPromoView(name){
      if (!isBeatSeries(name) || !isPromoAvailable(name)) return '';
      var p = CONFIG.promo.beatSeries;
      var cicilan = getPromoCicilan(name);
      return '<div class="promo-view"><div class="promo-banner">'
        + '<div class="promo-banner-label">⚡ Promo Spesial Beat Series</div>'
        + '<div class="promo-banner-value">' + formatRp(cicilan) + '<small>/bln</small></div>'
        + '<div class="promo-banner-meta">DP ' + formatRp(p.dp) + ' · Tenor ' + p.tenor + ' bulan</div>'
        + '<div class="promo-banner-note">Cicilan promo belum termasuk diskon &amp; potongan tenor. Ketuk tombol di bawah untuk konfirmasi via WhatsApp.</div>'
        + '<button class="promo-banner-back" data-promo-toggle="' + esc(name) + '" type="button">← Kembali ke DP Normal</button>'
        + '</div></div>';
    }

    function renderKreditCardsList(){
      var names = filterModelsByState(kreditFilter);
      if (!names.length) return '<div class="empty-state">Tidak ada model yang cocok. Coba kata kunci lain.</div>';
      var html = '';
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var data = getModelData(name);
        if (!data) continue;
        var meta = getModelMeta(name);
        var cicilanHeader = getCicilanHeader(name);
        var defaultDp = getDefaultDp(name);
        var mulaiHtml = cicilanHeader
          ? '<span class="kredit-mulai">Mulai ' + formatRp(cicilanHeader.cicilan) + '/bln</span>'
          : '<span class="kredit-mulai" style="color:var(--label-3)">Belum tersedia</span>';
        html += '<div class="kredit-card" data-kredit-card="' + esc(name) + '" data-sel-dp="" data-sel-tenor="" data-sel-cicilan="">'
          + '<button class="kredit-head" data-toggle-kredit="' + esc(name) + '" type="button">'
          +   '<div class="kredit-emoji">' + meta.emoji + '</div>'
          +   '<div class="kredit-info"><strong>' + esc(name) + '</strong>' + mulaiHtml + '<span class="kredit-otr">OTR ' + formatRp(data.harga) + '</span></div>'
          +   '<div class="kredit-chevron">›</div>'
          + '</button>'
          + '<div class="kredit-detail"><div class="kredit-detail-inner"><div class="kredit-body"><div class="kredit-body-inner">'
          +   renderDpSlider(name, defaultDp)
          +   renderPromoView(name)
          +   '<div class="tenor-list" data-tenor-list="' + esc(name) + '">' + renderTenorRows(name, defaultDp) + '</div>'
          +   '<button class="wa-btn" type="button" data-konsultasi="' + esc(name) + '">💬 Konsultasi Kredit</button>'
          + '</div></div></div></div>'
          + '</div>';
      }
      return html;
    }

    function renderKredit(){
      return renderBackHeader('Simulasi Kredit')
        + '<div class="wrap" style="padding-top:8px">'
        +   '<p class="detail-desc reveal" style="margin-bottom:2px">Pilih model &amp; atur DP. Tap tenor untuk pilih cicilan, lalu kirim via WhatsApp. Angka dari pricelist FIFGROUP.</p>'
        +   renderFilterBar(kreditFilter, 'kredit')
        +   '<div id="kredit-list-container">' + renderKreditCardsList() + '</div>'
        + '</div>';
    }

    function renderNotFound(){
      return renderBackHeader('Tidak Ditemukan')
        + '<div class="not-found"><h2>Halaman tidak ditemukan</h2><p>Halaman yang Anda cari tidak tersedia.</p><a class="wa-btn" data-back>← Kembali</a></div>';
    }

    function renderRoute(route){
      if (!route || route === '/') return renderHome();
      if (route.indexOf('/model/') === 0) return renderModelDetail(route.slice(7));
      if (route === '/stok') return renderStok();
      if (route === '/kredit') return renderKredit();
      return renderNotFound();
    }

    function makeScreen(route){
      var el = document.createElement('section');
      el.className = 'screen';
      el.setAttribute('data-route', route);
      el.innerHTML = '<div class="screen-inner">' + renderRoute(route) + '</div>';
      return el;
    }

    function pushScreen(route, animate){
      if (animate && animating) return;
      var current = stack[stack.length - 1];
      var el = makeScreen(route);
      app.appendChild(el);

      var afterActivate = function(){
        animating = false;
        Anim.init(el);
        if (pendingKreditModel && route === '/kredit') {
          var target = pendingKreditModel;
          pendingKreditModel = null;
          setTimeout(function(){ expandKreditModel(el, target); }, 150);
        }
      };

      if (animate && current) {
        animating = true;
        void el.offsetWidth;
        current.classList.remove('is-active');
        current.classList.add('is-behind');
        el.classList.add('is-active');
        setTimeout(afterActivate, NAV_DURATION);
      } else if (animate) {
        animating = true;
        el.classList.add('is-active');
        setTimeout(afterActivate, NAV_DURATION);
      } else {
        el.classList.add('no-transition', 'is-active');
        if (current) {
          current.classList.add('no-transition');
          current.classList.remove('is-active');
          current.classList.add('is-behind');
        }
        requestAnimationFrame(function(){
          el.classList.remove('no-transition');
          if (current) current.classList.remove('no-transition');
          afterActivate();
        });
      }
      stack.push(el);
    }

    function popScreen(animate){
      if (animate && animating) return;
      if (stack.length <= 1) return;
      var current = stack.pop();
      var prev = stack[stack.length - 1];

      var finalize = function(){
        Anim.destroy(current);
        current.remove();
        if (prev && floatWa) {
          var hero = prev.querySelector('.hero');
          if (hero) {
            var rect = hero.getBoundingClientRect();
            if (rect.bottom > 20) floatWa.classList.add('is-hidden');
            else floatWa.classList.remove('is-hidden');
          } else floatWa.classList.remove('is-hidden');
        }
      };

      if (animate) {
        animating = true;
        current.classList.remove('is-active');
        prev.classList.remove('is-behind');
        prev.classList.add('is-active');
        setTimeout(function(){ finalize(); animating = false; }, NAV_DURATION);
      } else {
        finalize();
        prev.classList.remove('is-behind');
        prev.classList.add('is-active');
      }
    }

    function popTo(index){
      if (index < 0 || index >= stack.length - 1) return;
      while (stack.length - 1 > index + 1) {
        var s = stack.pop();
        Anim.destroy(s);
        s.remove();
      }
      popScreen(true);
    }

    function navigate(route){
      if (animating) return;
      var current = stack[stack.length - 1];
      if (current && current.getAttribute('data-route') === route) return;
      safePush(route);
      pushScreen(route, true);
    }

    function goBack(){
      if (animating) return;
      if (actionSheet && actionSheet.classList.contains('is-open')) { closeActionSheet(); return; }
      if (stack.length > 1) {
        if (historyOK) { try { history.back(); return; } catch (e) {} }
        popScreen(true);
        var prev = stack[stack.length - 1];
        if (prev) safeReplace(prev.getAttribute('data-route'));
        return;
      }
      var current = stack[0];
      if (current && current.getAttribute('data-route') !== '/') {
        var home = makeScreen('/');
        app.appendChild(home);
        home.classList.add('no-transition', 'is-active');
        current.classList.add('no-transition');
        current.classList.remove('is-active');
        current.classList.add('is-behind');
        requestAnimationFrame(function(){
          home.classList.remove('no-transition');
          current.classList.remove('no-transition');
          Anim.init(home);
        });
        stack.length = 0;
        stack.push(home);
        Anim.destroy(current);
        current.remove();
        safeReplace('/');
      }
    }

    function refreshActiveList(prefix){
      var screen = stack[stack.length - 1];
      if (!screen) return;
      if (prefix === 'stok') {
        var c1 = screen.querySelector('#stok-list-container');
        if (c1) c1.innerHTML = renderStokList();
      } else if (prefix === 'kredit') {
        var c2 = screen.querySelector('#kredit-list-container');
        if (c2) c2.innerHTML = renderKreditCardsList();
      }
    }

    function handleSliderInput(slider){
      var card = slider.closest('.kredit-card');
      if (!card || card.classList.contains('promo-active')) return;
      var name = slider.getAttribute('data-model');
      var data = getModelData(name);
      if (!data) return;
      var opts = getSliderDpOptions(data);
      var idx = Math.max(0, Math.min(opts.length - 1, Number(slider.value)));
      var dp = opts[idx];
      var pct = opts.length > 1 ? (idx / (opts.length - 1)) * 100 : 0;
      slider.style.setProperty('--pct', pct + '%');
      var display = card.querySelector('[data-dp-value]');
      if (display) display.textContent = formatRp(dp);
      var tenorList = card.querySelector('[data-tenor-list]');
      if (tenorList) tenorList.innerHTML = renderTenorRows(name, dp);
      var promoContainer = card.querySelector('[data-promo-container]');
      if (promoContainer) {
        var triggerDp = getPromoTriggerDp(name);
        if (triggerDp !== null && dp === triggerDp) promoContainer.classList.add('is-visible');
        else promoContainer.classList.remove('is-visible');
      }
      resetSelection(card);
    }

    function handleSearchInput(input){
      var prefix = input.getAttribute('data-search');
      var val = input.value;
      if (prefix === 'stok') stokFilter.q = val;
      else if (prefix === 'kredit') kreditFilter.q = val;
      else return;
      refreshActiveList(prefix);
    }

    app.addEventListener('input', function(e){
      var t = e.target;
      if (t && t.closest && t.closest('[data-search]')) { handleSearchInput(t); return; }
      if (t && t.classList && t.classList.contains('dp-slider')) { handleSliderInput(t); return; }
    });

    app.addEventListener('click', function(e){
      if (animating) return;
      var target = e.target;

      var backEl = target.closest('[data-back]');
      if (backEl) { e.preventDefault(); goBack(); return; }

      var navEl = target.closest('[data-nav]');
      if (navEl) {
        e.preventDefault();
        var expand = navEl.getAttribute('data-expand-kredit');
        if (expand) pendingKreditModel = expand;
        navigate(navEl.getAttribute('data-nav'));
        return;
      }

      var msgEl = target.closest('[data-msg]');
      if (msgEl) { e.preventDefault(); openWa(msgEl.getAttribute('data-msg'), msgEl); return; }

      var stokEl = target.closest('.stok-item');
      if (stokEl) {
        e.preventDefault();
        var mname = stokEl.getAttribute('data-model');
        if (mname) openActionSheet(mname);
        return;
      }

      var toggleEl = target.closest('[data-toggle-kredit]');
      if (toggleEl) {
        e.preventDefault();
        var card = toggleEl.closest('.kredit-card');
        if (!card) return;
        var wasOpen = card.classList.contains('open');
        var parent = card.parentElement;
        if (parent) {
          var opened = parent.querySelectorAll('.kredit-card.open');
          for (var i = 0; i < opened.length; i++) if (opened[i] !== card) opened[i].classList.remove('open');
        }
        if (wasOpen) card.classList.remove('open');
        else card.classList.add('open');
        return;
      }

      var tenorEl = target.closest('.tenor-row');
      if (tenorEl) {
        e.preventDefault();
        var card2 = tenorEl.closest('.kredit-card');
        if (!card2 || card2.classList.contains('promo-active')) return;
        var dp = tenorEl.getAttribute('data-dp');
        var tenor = tenorEl.getAttribute('data-tenor');
        var cicilan = tenorEl.getAttribute('data-cicilan');
        if (!dp || !tenor || !cicilan) return;
        var rows = card2.querySelectorAll('.tenor-row');
        for (var j = 0; j < rows.length; j++) { rows[j].classList.remove('is-selected'); rows[j].setAttribute('aria-pressed', 'false'); }
        tenorEl.classList.add('is-selected');
        tenorEl.setAttribute('aria-pressed', 'true');
        card2.setAttribute('data-sel-dp', dp);
        card2.setAttribute('data-sel-tenor', tenor);
        card2.setAttribute('data-sel-cicilan', cicilan);
        updateKonsultasiBtn(card2);
        return;
      }

      var konsulEl = target.closest('[data-konsultasi]');
      if (konsulEl) {
        e.preventDefault();
        var card3 = konsulEl.closest('.kredit-card');
        if (!card3) return;
        openWa(buildKonsultasiMsg(card3), konsulEl);
        return;
      }

      var promoBtn = target.closest('[data-promo-toggle]');
      if (promoBtn) {
        e.preventDefault();
        var pname = promoBtn.getAttribute('data-promo-toggle');
        var card4 = promoBtn.closest('.kredit-card');
        if (!card4) return;
        var data = getModelData(pname);
        if (!data) return;
        var wasActive = card4.classList.contains('promo-active');
        var p = CONFIG.promo.beatSeries;
        if (!wasActive) {
          resetSelection(card4);
          card4.classList.add('promo-active');
          var disp = card4.querySelector('[data-dp-value]');
          if (disp) disp.innerHTML = formatRp(p.dp) + ' <small style="font-size:10px;color:#ff9f0a;font-weight:800;margin-left:4px">PROMO</small>';
          var sub = card4.querySelector('[data-dp-sub]');
          if (sub) sub.textContent = 'Mode Promo Aktif';
          updateKonsultasiBtn(card4);
        } else {
          card4.classList.remove('promo-active');
          var triggerDp = getPromoTriggerDp(pname);
          var opts = getSliderDpOptions(data);
          var targetDp = (triggerDp !== null && opts.indexOf(triggerDp) !== -1) ? triggerDp : getDefaultDp(pname);
          var targetIdx = opts.indexOf(targetDp);
          var slider = card4.querySelector('.dp-slider');
          if (slider && targetIdx >= 0) {
            slider.value = targetIdx;
            var pct = opts.length > 1 ? (targetIdx / (opts.length - 1)) * 100 : 0;
            slider.style.setProperty('--pct', pct + '%');
          }
          var disp2 = card4.querySelector('[data-dp-value]');
          if (disp2) disp2.textContent = formatRp(targetDp);
          var sub2 = card4.querySelector('[data-dp-sub]');
          if (sub2) sub2.textContent = 'Geser untuk ubah DP';
          var tenorList = card4.querySelector('[data-tenor-list]');
          if (tenorList) tenorList.innerHTML = renderTenorRows(pname, targetDp);
          var promoContainer = card4.querySelector('[data-promo-container]');
          if (promoContainer) {
            if (targetDp === triggerDp) promoContainer.classList.add('is-visible');
            else promoContainer.classList.remove('is-visible');
          }
          resetSelection(card4);
        }
        return;
      }

      var catEl = target.closest('[data-cat]');
      if (catEl) {
        e.preventDefault();
        var parts = catEl.getAttribute('data-cat').split(':');
        var prefix = parts[0];
        var cat = parts[1];
        var f = prefix === 'stok' ? stokFilter : kreditFilter;
        f.cat = cat;
        var tabs = catEl.parentElement;
        if (tabs) {
          var chips = tabs.querySelectorAll('.cat-chip');
          for (var k = 0; k < chips.length; k++) chips[k].classList.remove('is-active');
        }
        catEl.classList.add('is-active');
        refreshActiveList(prefix);
        return;
      }
    });

    var sheetCancel = document.getElementById('sheetCancel');
    if (sheetCancel) sheetCancel.addEventListener('click', closeActionSheet);
    if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeActionSheet);

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && actionSheet && actionSheet.classList.contains('is-open')) closeActionSheet();
    });

    var sheetActionBtns = document.querySelectorAll('[data-sheet-action]');
    for (var si = 0; si < sheetActionBtns.length; si++) {
      (function(btn){
        btn.addEventListener('click', function(){
          var name = pendingSheetModel;
          var action = btn.getAttribute('data-sheet-action');
          var hadHistoryPush = sheetPushedHistory;
          if (!name) { closeActionSheet(); return; }
          if (action === 'cash') {
            closeActionSheet();
            openWa('Halo Dion, saya dari TikTok. Mau tanya harga cash & stok ' + name + '.', btn);
          } else if (action === 'kredit') {
            pendingKreditModel = name;
            if (hadHistoryPush) {
              sheetPushedHistory = false;
              try { history.replaceState({ route: '/kredit' }, '', '#/kredit'); } catch (e) {}
              closeActionSheet(true);
              pushScreen('/kredit', true);
            } else {
              closeActionSheet(true);
              navigate('/kredit');
            }
          }
        });
      })(sheetActionBtns[si]);
    }

    if (floatWa) {
      floatWa.addEventListener('click', function(e){
        e.preventDefault();
        openWa(CONFIG.defaultMessage, null);
      });
    }

    window.addEventListener('popstate', function(){
      if (actionSheet && actionSheet.classList.contains('is-open')) { closeActionSheet(true); return; }
      var route = hashToRoute(location.hash || '');
      var current = stack[stack.length - 1];
      if (current && current.getAttribute('data-route') === route) return;
      var idx = -1;
      for (var i = 0; i < stack.length; i++) if (stack[i].getAttribute('data-route') === route) { idx = i; break; }
      if (idx >= 0 && idx < stack.length - 1) popTo(idx);
      else pushScreen(route, true);
    });

    var initialRoute = hashToRoute(location.hash || '');
    if (!initialRoute || initialRoute.charAt(0) !== '/') initialRoute = '/';

    try { history.replaceState({ route: '/' }, '', '#/'); historyOK = true; } catch (e) { historyOK = false; }

    try {
      pushScreen('/', false);
    } catch (err) {
      app.innerHTML = '<div style="padding:48px 24px;font-family:-apple-system,sans-serif;color:#1c1c1e;line-height:1.5"><h2 style="font-size:20px;margin-bottom:8px">Gagal memuat halaman</h2><p style="color:#6b6b70;font-size:14px">' + esc(String((err && err.message) || err)) + '</p></div>';
      return;
    }

    if (initialRoute !== '/') {
      try { safePush(initialRoute); pushScreen(initialRoute, false); } catch (e2) {}
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
