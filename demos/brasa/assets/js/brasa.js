/* ==========================================================================
   BRASA — Steak & Fire · Interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Header : état "collé" au scroll ---------- */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    var toggle = function (open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', function () {
      toggle(!document.body.classList.contains('nav-open'));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') toggle(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
    });
  }

  /* ---------- Apparition au scroll ---------- */
  var reveals = document.querySelectorAll('[data-r]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    // Filet de sécurité : une apparition qui ne se déclenche pas laisserait le
    // contenu invisible pour toujours. Toutes les 1,5 s, on révèle d'office ce
    // qui se trouve déjà au-dessus du bas de l'écran. Mieux vaut une animation
    // ratée qu'une photo manquante.
    var sweep = function () {
      var n = 0;
      reveals.forEach(function (el) {
        if (el.classList.contains('in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('in');
          n++;
        }
      });
      return n;
    };
    window.setInterval(sweep, 1500);
    window.addEventListener('load', sweep);
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Carte : surlignage de la sous-nav ---------- */
  var mnav = document.querySelector('.menu-nav');
  if (mnav) {
    var links = Array.prototype.slice.call(mnav.querySelectorAll('a'));
    var targets = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if ('IntersectionObserver' in window && targets.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      targets.forEach(function (t) { spy.observe(t); });
    }
  }

  /* ---------- Galerie : lightbox ---------- */
  var gals = document.querySelectorAll('[data-gallery]');
  var lb = document.querySelector('.lightbox');
  if (gals.length && lb) {
    var figs = [];
    gals.forEach(function (g) {
      Array.prototype.forEach.call(g.querySelectorAll('figure'), function (f) { figs.push(f); });
    });
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var idx = 0;

    var show = function (i) {
      idx = (i + figs.length) % figs.length;
      var src = figs[idx].querySelector('img');
      var cap = figs[idx].querySelector('figcaption');
      lbImg.src = src.getAttribute('data-full') || src.src;
      lbImg.alt = src.alt || '';
      lbCap.textContent = cap ? cap.textContent.trim() : '';
    };
    var open = function (i) {
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    var close = function () {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    };

    figs.forEach(function (f, i) {
      f.setAttribute('tabindex', '0');
      f.setAttribute('role', 'button');
      f.addEventListener('click', function () { open(i); });
      f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector('.lightbox__x').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Réservation : maquette de disponibilités ---------- */
  var form = document.querySelector('[data-resa]');
  if (form) {
    var dateInput = form.querySelector('#resa-date');
    var slotsGrid = form.querySelector('.slots__grid');
    var slotField = form.querySelector('#resa-heure');
    var msg = form.querySelector('.msg');
    var service = form.querySelector('#resa-service');

    var HOURS = {
      midi: ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00'],
      soir: ['19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '22:00']
    };

    // Date du jour comme minimum + valeur par défaut
    var today = new Date();
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    if (dateInput) {
      dateInput.min = iso(today);
      if (!dateInput.value) dateInput.value = iso(today);
    }

    // Pseudo-aléatoire stable : mêmes créneaux indisponibles pour une même date
    var seeded = function (str) {
      var h = 2166136261;
      for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return function () {
        h += 0x6D2B79F5;
        var t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    var renderSlots = function () {
      if (!slotsGrid) return;
      var svc = service ? service.value : 'soir';
      var list = HOURS[svc] || HOURS.soir;
      var date = dateInput ? dateInput.value : '';
      var rnd = seeded(date + svc);
      var day = date ? new Date(date).getDay() : 6;

      slotsGrid.innerHTML = '';
      if (slotField) slotField.value = '';

      // Lundi fermé
      if (day === 1) {
        slotsGrid.innerHTML =
          '<p class="tiny" style="letter-spacing:.14em;text-transform:none">' +
          'Le restaurant est fermé le lundi. Choisissez une autre date.</p>';
        return;
      }
      // Pas de service du midi le dimanche
      if (day === 0 && svc === 'midi') {
        slotsGrid.innerHTML =
          '<p class="tiny" style="letter-spacing:.14em;text-transform:none">' +
          'Pas de service le dimanche midi. Le service du soir reste ouvert.</p>';
        return;
      }

      list.forEach(function (h) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot';
        b.textContent = h;
        b.setAttribute('aria-pressed', 'false');
        if (rnd() < 0.3) {
          b.disabled = true;
          b.title = 'Complet';
        }
        b.addEventListener('click', function () {
          slotsGrid.querySelectorAll('.slot').forEach(function (s) {
            s.setAttribute('aria-pressed', 'false');
          });
          b.setAttribute('aria-pressed', 'true');
          if (slotField) slotField.value = h;
        });
        slotsGrid.appendChild(b);
      });
    };

    if (dateInput) dateInput.addEventListener('change', renderSlots);
    if (service) service.addEventListener('change', renderSlots);
    renderSlots();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!msg) return;
      var heure = slotField ? slotField.value : '';
      if (!heure) {
        msg.innerHTML = '<b>Sélectionnez un créneau</b> pour finaliser votre demande.';
        msg.classList.add('show');
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      var data = new FormData(form);
      var d = new Date(data.get('date'));
      var jolie = d.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
      msg.innerHTML =
        '<b>Demande enregistrée (démonstration).</b><br>' +
        data.get('couverts') + ' couvert(s) — ' + jolie + ' à ' + heure + '. ' +
        'Un e-mail de confirmation serait envoyé à ' + (data.get('email') || 'votre adresse') + '.' +
        '<br><span style="opacity:.6">Ce formulaire est une maquette : aucune donnée n\'est transmise. ' +
        'Il sera remplacé par le module de réservation retenu (TheFork, Zenchef…).</span>';
      msg.classList.add('show');
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Plan : chargement au clic (pas de cookie tiers avant accord) ---------- */
  var mapBox = document.querySelector('[data-map]');
  if (mapBox) {
    var mapBtn = mapBox.querySelector('[data-map-load]');
    if (mapBtn) {
      mapBtn.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = mapBox.getAttribute('data-src');
        f.loading = 'lazy';
        f.title = 'Plan d\'accès — BRASA, 9 rue des Clercs, Metz';
        f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        f.setAttribute('allowfullscreen', '');
        mapBox.innerHTML = '';
        mapBox.appendChild(f);
      });
    }
  }

  /* ---------- Année du copyright ---------- */
  var y = document.querySelectorAll('[data-year]');
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
