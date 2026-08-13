/* =============================================================
   Alexandre Colas — landing page
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     RÉGLAGE À FAIRE : où partent les messages du formulaire.
     - Laissé vide, le formulaire ouvre la messagerie du visiteur
       avec le message déjà rédigé (fonctionne sans hébergement).
     - Avec un service comme Formspree, Basin ou Web3Forms, collez
       ici l'URL fournie : les messages arrivent alors par e-mail
       sans que le visiteur quitte le site.
       Exemple : 'https://formspree.io/f/xxxxxxxx'
     ----------------------------------------------------------- */
  var FORM_ENDPOINT = '';
  var EMAIL = 'contact@alexcolas.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Animation d'entrée ─────────────────────────────────── */
  document.querySelectorAll('[data-delay]').forEach(function (el) {
    el.style.setProperty('--d', el.dataset.delay);
  });
  requestAnimationFrame(function () {
    document.body.classList.add('is-ready');
  });

  /* ── Apparition au défilement ───────────────────────────── */
  var observed = document.querySelectorAll(
    '.section__title, .label, .offer__item, .step, .contact__intro .lede, .contact__details, .form,' +
    '.case__shot, .case__list li, .case__meta, .showcase__shot, .showcase .lede'
  );

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    observed.forEach(function (el, i) {
      el.classList.add('watch');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      observer.observe(el);
    });
  }

  /* ── En-tête au défilement ──────────────────────────────── */
  var header = document.getElementById('site-header');
  // Sur les pages sans hero clair, l'en-tête reste marine en permanence.
  if (document.querySelector('.hero')) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Menu mobile ────────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  var closeNav = function () {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ── Année du pied de page ──────────────────────────────── */
  var annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();

  /* ── Formulaire de contact ──────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statut = document.getElementById('form-status');

  var afficherErreur = function (input, visible) {
    var champ = input.closest('.field');
    var message = champ.querySelector('.field__error');
    champ.classList.toggle('is-invalid', visible);
    if (message) message.hidden = !visible;
    input.setAttribute('aria-invalid', visible ? 'true' : 'false');
  };

  var estValide = function (input) {
    var valeur = input.value.trim();
    if (!valeur) return false;
    if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur);
    if (input.id === 'message') return valeur.length >= 10;
    return true;
  };

  var requis = Array.prototype.slice.call(form.querySelectorAll('[required]'));

  requis.forEach(function (input) {
    input.addEventListener('blur', function () {
      if (input.value.trim()) afficherErreur(input, !estValide(input));
    });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('is-invalid') && estValide(input)) {
        afficherErreur(input, false);
      }
    });
  });

  var definirStatut = function (texte, type) {
    statut.textContent = texte;
    statut.className = 'form__status' + (type ? ' is-' + type : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var premierInvalide = null;
    requis.forEach(function (input) {
      var ok = estValide(input);
      afficherErreur(input, !ok);
      if (!ok && !premierInvalide) premierInvalide = input;
    });

    if (premierInvalide) {
      definirStatut('Complétez les champs signalés pour envoyer votre message.', 'error');
      premierInvalide.focus();
      return;
    }

    var donnees = {
      nom: form.nom.value.trim(),
      email: form.email.value.trim(),
      projet: form.projet.value,
      message: form.message.value.trim()
    };

    var bouton = form.querySelector('button[type="submit"]');

    if (!FORM_ENDPOINT) {
      // Sans service d'envoi : on ouvre la messagerie du visiteur.
      var corps =
        'Nom : ' + donnees.nom + '\n' +
        'E-mail : ' + donnees.email + '\n' +
        'Type de projet : ' + donnees.projet + '\n\n' +
        donnees.message;

      window.location.href =
        'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Nouveau projet — ' + donnees.nom) +
        '&body=' + encodeURIComponent(corps);

      definirStatut('Votre messagerie s’ouvre avec le message prêt à partir.', 'ok');
      return;
    }

    bouton.disabled = true;
    definirStatut('Envoi en cours…');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(donnees)
    })
      .then(function (reponse) {
        if (!reponse.ok) throw new Error('Envoi refusé');
        form.reset();
        definirStatut('Message reçu. Je vous réponds sous 24 heures.', 'ok');
      })
      .catch(function () {
        definirStatut('L’envoi a échoué. Écrivez-moi directement à ' + EMAIL + '.', 'error');
      })
      .then(function () {
        bouton.disabled = false;
      });
  });
})();
