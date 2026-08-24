// Menu mobile + animations GSAP.
(function () {
  'use strict';

  /* --- Menu mobile ------------------------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Menu' : 'Fermer';
    });
  }

  /* --- GSAP -------------------------------------------------------------- */
  // gsap.min.js et ScrollTrigger.min.js sont chargés avant ce fichier.
  // SplitText.min.js n'est chargé que sur l'accueil.
  // Si GSAP manque, on sort : le site doit rester entièrement lisible sans
  // JavaScript. C'est pour cette raison qu'aucun état initial masquant n'est
  // posé en CSS — tout est posé ici, donc rien n'est masqué si ce fichier ne
  // s'exécute pas.

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

  // Durées courtes, sorties douces : une animation qui se remarque est ratée.
  gsap.defaults({ duration: 0.6, ease: 'power2.out' });

  // Cormorant Garamond arrive en asynchrone. Tant qu'il n'est pas là, les
  // titres sont mesurés sur la police de repli : les hauteurs sont fausses,
  // donc les déclencheurs et surtout le découpage en lignes du hero le sont
  // aussi. On attend donc les polices — mais jamais plus de 1,5 seconde, pour
  // qu'un CDN lent ne laisse pas le titre invisible.
  var policesPretes = Promise.race([
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 1500); }),
  ]);

  // Un cabinet d'avocats reçoit des visiteurs en situation de stress ou de
  // handicap : le respect de prefers-reduced-motion n'est pas négociable.
  // Tout ce qui est déclaré dans ce bloc est annulé et remis à zéro si
  // l'utilisateur active la réduction des animations, même en cours de session.
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* --- 1. Révélation au scroll ---------------------------------------- */
    // ScrollTrigger.batch regroupe les éléments qui entrent dans la même frame,
    // ce qui donne le décalage sans avoir à déclarer un conteneur par cas : les
    // cartes de domaines.html sont isolées, celles de l'accueil sont en grille.

    var blocs = gsap.utils.toArray('.card, .person, .fact, .list-plain > li');

    if (blocs.length) {
      gsap.set(blocs, { opacity: 0, y: 16 });

      ScrollTrigger.batch(blocs, {
        start: 'top 88%',
        once: true,
        onEnter: function (lot) {
          gsap.to(lot, { opacity: 1, y: 0, stagger: 0.08 });
        },
      });
    }

    /* --- 2. Tracé des filets or ----------------------------------------- */
    // Les filets sont des pseudo-éléments, hors de portée de GSAP. On anime
    // donc la variable --rule-scale sur l'élément parent, que le ::before
    // consomme via transform: scaleX(). Voir styles.css.
    // Le hero est exclu : son eyebrow est repris par la séquence ci-dessous.

    var filets = gsap.utils.toArray('.eyebrow, .card, .fact')
      .filter(function (el) { return !el.closest('.hero'); });

    if (filets.length) {
      gsap.set(filets, { '--rule-scale': 0 });

      ScrollTrigger.batch(filets, {
        start: 'top 92%',
        once: true,
        onEnter: function (lot) {
          gsap.to(lot, { '--rule-scale': 1, duration: 0.45, stagger: 0.06 });
        },
      });
    }

    /* --- 3. Hero cinématique -------------------------------------------- */

    var hero = document.querySelector('.hero');
    var titre = hero && hero.querySelector('h1');
    var media = hero && hero.querySelector('.hero__media');

    var heroSplit = null;
    var heroElements = [];

    if (hero && titre) {
      var heroEyebrow = hero.querySelector('.eyebrow');
      var heroLede = hero.querySelector('.hero__lede');
      var heroActions = hero.querySelector('.hero__actions');

      heroElements = [heroEyebrow, titre, heroLede, heroActions].filter(Boolean);

      // Masquage immédiat et synchrone : si on attendait les polices pour
      // masquer, le titre s'afficherait en clair avant de disparaître.
      gsap.set(heroElements, { opacity: 0 });
      if (heroEyebrow) gsap.set(heroEyebrow, { '--rule-scale': 0 });

      // Parallaxe : le calque glisse vers le bas pendant que la page monte,
      // donc la photo paraît défiler moins vite que le texte. 12 % seulement —
      // au-delà, le mouvement se voit et trahit l'effet.
      if (media) {
        gsap.to(media, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      policesPretes.then(function () {
        var sequence = gsap.timeline();

        if (typeof SplitText !== 'undefined') {
          // mask: 'lines' emballe chaque ligne dans un conteneur en
          // overflow hidden — c'est ce qui produit la révélation par le bas.
          // autoSplit redécoupe si la largeur change (le changement de hauteur
          // dû à la barre d'adresse mobile est ignoré, donc pas de rejeu).
          heroSplit = SplitText.create(titre, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: function (self) {
              gsap.set(titre, { opacity: 1 });
              return gsap.from(self.lines, {
                yPercent: 100,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
              });
            },
          });
        } else {
          sequence.to(titre, { opacity: 1, y: 0, duration: 0.9 }, 0);
        }

        if (heroEyebrow) {
          sequence.to(heroEyebrow, { opacity: 1, duration: 0.5 }, 0)
                  .to(heroEyebrow, { '--rule-scale': 1, duration: 0.5 }, 0.1);
        }
        if (heroLede) sequence.to(heroLede, { opacity: 1, y: 0, duration: 0.7 }, 0.5);
        if (heroActions) sequence.to(heroActions, { opacity: 1, y: 0, duration: 0.7 }, 0.65);

        // Le découpage en lignes change la hauteur du titre : sans ce
        // recalcul, tous les déclencheurs plus bas dans la page sont décalés.
        ScrollTrigger.refresh();
      });
    }

    /* --- Filet de sécurité ---------------------------------------------- */
    // Si un déclencheur ne partait jamais, ou si SplitText échouait, du contenu
    // resterait invisible. On force la révélation au bout de 4 secondes : sur
    // un site où l'on cherche un avocat en urgence, du texte manquant coûte
    // bien plus cher qu'une animation ratée.
    var secours = gsap.delayedCall(4, function () {
      gsap.to(blocs.concat(filets).concat(heroElements), {
        opacity: 1, y: 0, '--rule-scale': 1, duration: 0.3, overwrite: 'auto',
      });
    });

    return function () {
      secours.kill();
      if (heroSplit) heroSplit.revert();
    };
  });

  // Recalcul après chargement des polices, pour les pages sans hero.
  policesPretes.then(function () { ScrollTrigger.refresh(); });
})();
