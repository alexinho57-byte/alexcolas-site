# CLAUDE.md — alexcolas.com

Contexte du projet, lu à chaque session. **Ce fichier est la source de vérité :**
toute décision structurante (design, wording, technique, SEO) s'écrit ici dans le
même commit que le changement.

Le *pourquoi* des décisions ci-dessous — historique, raisonnements, options
écartées — est dans **`CLAUDE.archive.md`**, qui n'est pas chargé automatiquement.
À consulter avant de rouvrir un sujet tranché, jamais « pour avoir le contexte ».

---

## 1. Le projet

Site vitrine d'**Alexandre Colas**, freelance en création de sites internet à
**Metz**. Objectif : générer des demandes de devis locales (Metz et Moselle) et
servir de démonstration du savoir-faire — le site est lui-même une pièce du
portfolio. Domaine : `alexcolas.com`

## 2. Le client

Alexandre est **non-technique mais très impliqué** : il relit et valide chaque
décision de design, de wording et de structure.

- Expliquer le *pourquoi* avant le *comment*, en français courant, sans jargon.
- **Proposer des recommandations argumentées**, avec les compromis. Rôle de
  conseil (SEO, architecture, technique), pas d'exécutant.
- Avant une modification qui touche plusieurs pages ou change un parti pris
  visuel : annoncer ce qui va changer et pourquoi, puis **attendre la validation**.
- Les corrections mineures (typo, balise oubliée, lien mort) se font directement,
  en les signalant.

## 3. Positionnement et ton

- **Sur mesure, artisanal, proche du client.** Anti « usine à sites ».
- **Pas d'abonnement, pas de dépendance.** Le client reste propriétaire.
- Ton professionnel mais humain. Pas de superlatifs marketing, pas de
  « solutions innovantes », pas de promesses chiffrées invérifiables.
- Vocabulaire de la couture et de l'artisanat : avec parcimonie.

**Test de cohérence :** toute proposition créant une dépendance à un service
tiers payant ou récurrent est contraire au positionnement.

**Qui modifie le site après la livraison (décision du 25/09/2026) :**

- **Le client reste propriétaire de son site** : code, nom de domaine et
  hébergement à son nom, libre de changer de prestataire.
- **Un site codé à la main (vitrine, landing page) n'est pas modifié par le
  client.** C'est Alexandre qui fait les modifications : demande du client →
  estimation → intervention après accord, **90 €/h, TVA non applicable**.
  Ne plus jamais écrire « vous pourrez le modifier vous-même », « sans
  m'appeler », « faire vivre seul », « prise en main ».
- **Exception : une boutique WooCommerce reste gérable par le client**
  (produits, prix, stock, commandes). Ces promesses-là restent vraies.

**Tarifs (25/09/2026) — référence interne :** site vitrine dès 1 200 €,
landing page dès 800 €, e-commerce WooCommerce dès 2 500 €, refonte sur devis.
TVA non applicable (art. 293 B du CGI). Intervention après livraison : 90 €/h.
⚠️ **Prix de départ affichés depuis le 25/09/2026** (accueil et FAQ
« Combien coûte… ? » de `/site-vitrine` et `/site-ecommerce`), avec la mention
« TVA non applicable ». Cette décision remplace celle du 09/09 (« aucun chiffre
sur le site »). Le périmètre et le prix final sont fixés au devis. Revoir la
mention TVA si le régime change.

**Accueil allégé (25/09/2026) :** titre « Votre activité mérite un site qui
donne envie. », expérience commerciale sous les boutons. Styles propres à
l'accueil dans `/assets/css/home.css` (`?v=4`), chargé sur cette seule page.

**Vocabulaire :** « premier échange gratuit — 30 minutes », **jamais « audit
gratuit »** : le mot promet une analyse écrite. C'est un appel pour comprendre
le besoin ; le devis fixe vient ensuite.

## 4. Stack et déploiement

- **Site statique HTML / CSS / JS.** Pas de framework, pas de build step, pas de
  gestionnaire de paquets. Ne pas introduire React, Tailwind, Vite ou un
  générateur de site statique sans discussion préalable explicite.
- **Aucune ressource tierce au chargement.** Polices auto-hébergées
  (`assets/fonts/`, déclarées dans `assets/css/fonts.css`). Ne jamais rebrancher
  un CDN de polices ou de scripts.
- **Hébergement : Hostinger.** HTTPS forcé. **PHP** disponible côté serveur.
- **Cache : les feuilles de styles et les scripts portent un `?v=N`.** Toute
  modification de `assets/css/style.css` oblige à incrémenter ce numéro dans
  les **12 pages** (actuellement `style.css?v=18`, `main.js?v=11`) — sinon Hostinger continue de servir l’ancien fichier et le
  changement reste invisible en ligne.
- **Déploiement continu :** `git push` → webhook Hostinger → mise en ligne.
  **Un commit poussé est un commit en production.** Vérifier avant de pousser.
- **Garde-fou automatique :** un hook `.git/hooks/pre-commit` lance
  `.claude/verifier.py` et **annule le commit** si une règle des démonstrations
  est enfreinte, si un `?v=N` diverge entre les pages, si le téléphone n'est pas
  le même partout, ou si une image citée n'existe pas. Les deux fichiers sont
  hors dépôt. En cas de faux positif, **corriger la règle** plutôt que d'utiliser
  `--no-verify`. Ajouter une règle chaque fois qu'une erreur silencieuse est
  découverte — c'est là tout l'intérêt.

## 5. Structure et URLs

| URL | Contenu |
|---|---|
| `/` | Accueil : hero, services, méthode, à-propos |
| `/portfolio` | Grille des réalisations — une carte par projet |
| `/portfolio/atelier-inoly` | Étude de cas — boutique WooCommerce |
| `/portfolio/charlies-gabriella` | Étude de cas — landing page Stripe — **retirée du portfolio le 20/09/2026**, `noindex`, hors sitemap, plus aucun lien (voir §9) |
| `/portfolio/noverde` | Étude de cas — démonstration paysagiste |
| `/portfolio/brasa` | Étude de cas — démonstration restaurant |
| `/portfolio/lexora` | Étude de cas — démonstration cabinet d'avocats |
| `/site-vitrine` | Service — ciblage « site vitrine Metz » |
| `/site-ecommerce` | Service — « site e-commerce Metz » (mentionne WooCommerce) |
| `/refonte-site-internet` | Service — « refonte site internet Metz » |
| `/mentions-legales` | Mentions légales — **indexable à terme** (voir §8) |
| `/404` | Page d'erreur — `noindex` |
| `/demos/brasa/` | Démonstration, restaurant fictif — `noindex`, voir §9 |
| `/demos/lexora/` | Démonstration, cabinet fictif — `noindex`, voir §9 |
| `/demos/noverde/` | Démonstration, paysagiste fictif — `noindex`, voir §9 |

**Conventions :**

- URLs **sans extension `.html`**. Redirections 301 en place — toute nouvelle
  page suit la règle et est ajoutée aux redirections.
- Toute nouvelle page est ajoutée au `sitemap.xml`.
- **Le portfolio est un dossier** : `/portfolio` est servi par
  `portfolio/index.html`, chaque étude de cas est un fichier de ce dossier.
  Deux règles du `.htaccess` tiennent ça : `DirectorySlash Off` et la
  réécriture `-d → /index.html`, qui évitent la redirection vers
  `/portfolio/`. Une adresse sans slash final, toujours.
- **Les six pages du portfolio sont générées par un gabarit commun** dans le
  script de la session du 09/09/2026 — mais le dépôt ne contient que le HTML
  produit. Une modification du header ou du footer se répercute donc à la main,
  comme sur les autres pages.
- **Chemins d'assets toujours absolus** (`/assets/…`, `/favicon.svg`). Les
  chemins relatifs cassent dès qu'une URL gagne un niveau de profondeur.
- ⚠️ Header, footer, balises meta et JSON-LD sont **dupliqués dans chaque
  fichier**. Une modification de l'un de ces blocs doit être répercutée sur
  **toutes** les pages, `/404` et `/mentions-legales` comprises. **C'est
  l'erreur la plus fréquente sur ce projet — vérifier systématiquement.**

## 6. Design system

- **Palette :** taupe / marine / os, dérivée du portrait d'Alexandre. Utiliser
  les variables CSS en tête de la feuille de styles, jamais de hex en dur.
- **Typographie : Bricolage Grotesque.** Choix définitif.
- **Logo :** monogramme « AC » avec une piqûre de couture.
- Priorité au **mobile**.
- **Pied de page en colonnes** (03/09/2026) : bloc de marque à gauche, puis
  Services / Le studio / Contact. Trois colonnes dès 620 px, deux en dessous.
  Pas d’icônes de réseaux sociaux : aucun compte derrière.

**Décisions arrêtées — ne pas rouvrir sans demande explicite d'Alexandre :**

- ❌ **Syne** — rejetée, peu lisible sur mobile. Ne pas la reproposer.
- ❌ Anciennes palettes et polices testées puis écartées. Sujet clos.
- ❌ **Formspree** et toute solution de formulaire tierce.

## 7. Formulaire de contact

Script PHP maison `contact.php`, anti-spam inclus. Aucun service tiers, aucun
abonnement. Toute évolution conserve cette autonomie et reste testable en local.

## 8. SEO

**En place :** `title` / `meta description` / Open Graph ancrés « Metz » ;
Schema.org **LocalBusiness** ; `robots.txt` et `sitemap.xml` soumis ; **Google
Search Console** configuré ; **Google Business Profile** créé par Alexandre
(cohérence des NAP à maintenir) ; pages de service dédiées aux requêtes locales.

**Décisions arrêtées (audit du 17/08/2026) :**

- **Mentions légales : `noindex` et hors sitemap tant que le SIRET manque.** Le
  jour où il existe : retirer la balise dans `mentions-legales.html` et
  décommenter le bloc déjà présent dans `sitemap.xml`.
- **Le nœud `provider` est redéclaré sur chaque page de service.** Le NAP complet
  reste tenu à un seul endroit : l'accueil.
- ❌ **Pas de balisage `FAQPage`.** Les FAQ visibles restent utiles au lecteur,
  c'est leur seule justification.
- ❌ **Jamais d'adresse déclarée à Metz** tant que le siège est à Silly-sur-Nied.
- **NAP — téléphone :** `06 17 97 02 74` est publié sur le site. Il doit être
  **identique** sur la fiche Google Business Profile.

**Règles pour toute nouvelle page :**

1. Une intention de recherche par page, ancrée géographiquement.
2. Un `<h1>` unique, hiérarchie de titres cohérente.
3. `title` ≤ 60 caractères, `meta description` ≤ 155 caractères.
4. JSON-LD LocalBusiness + ajout au `sitemap.xml` + maillage depuis l'accueil.
5. Pas de bourrage de mots-clés : le texte doit rester lisible à voix haute.

## 9. Portfolio

**Règle absolue : ne jamais présenter un projet pour ce qu'il n'est pas.**
Chaque étude de cas porte son statut de façon visible. Ne jamais gonfler, ne
jamais laisser une démonstration passer pour une commande client.

| Statut | Badge | Classe CSS |
|---|---|---|
| Livré, en ligne | aucun + lien « Voir le site en ligne » | — |
| Client réel, en cours | « Projet en cours — pas encore en ligne » | `.case__status` (contour) |
| Démonstration | « Projet de démonstration — … fictif » | `.case__status.case__status--demo` (plein) |

**Une page par étude de cas depuis le 09/09/2026.** `/portfolio` n'est plus
qu'une grille de cartes : image, statut, titre, une phrase. Le détail vit sur
`/portfolio/<slug>`. Motif : la page dépliée mesurait 11 214 px sur téléphone,
soit quatorze écrans — personne ne lisait quatre études à la suite.

**Les cinq projets au 09/09/2026** (quatre affichés depuis le 20/09/2026, voir le point 1) **:**

1. **Charlies Gabriella** — landing page de vente à la main, paiement **Stripe**.
   Livré et en ligne. ⚠️ Ce n'est **pas** un site Shopify.
   ⚠️ **Retirée temporairement du portfolio le 20/09/2026**, à la demande
   d'Alexandre. Le fichier `portfolio/charlies-gabriella.html` existe toujours
   et porte un `noindex` ; la carte, l'entrée du `sitemap.xml` et tous les liens
   ont été retirés, et le chaînage des études de cas a été recousu en
   Atelier Inoly → Noverde. **Pour la remettre :** retirer le `noindex`,
   décommenter le bloc du `sitemap.xml`, remettre la carte dans
   `portfolio/index.html`, rebrancher Atelier Inoly → Charlies Gabriella →
   Noverde, et repasser l'intro du portfolio à « Cinq projets : deux sites en
   ligne ».
   **Motif :** le site `charliesgi.com` est en cours de refonte. La page
   d'étude de cas renvoyait vers lui (« Voir le site en ligne ») : un visiteur
   serait tombé sur un chantier. Le retrait dure le temps des travaux — ce
   n'est pas une décision de portfolio. **À remettre dès que le site est fini**,
   sinon le portfolio reste à un seul projet réel, ce qui l'affaiblit.
2. **Atelier Inoly** (Gwenaëlle) — refonte WooCommerce, thème sur mesure. Livré et
   en ligne sur **atelierinoly.fr** (01/09/2026). Mis en avant dans le bloc
   « Dernière réalisation » de l'accueil, placé en tête du portfolio, et maillé
   depuis la FAQ de `/site-ecommerce` — la page parlait de WooCommerce sans
   pouvoir le prouver. **Depuis le 20/09/2026, c'est le seul client réel
   publié.** ⚠️ **Ne jamais afficher un nombre de pièces** : le catalogue change
   régulièrement (« 56 pièces » retiré le 25/09/2026). Témoignage de Gwenaëlle :
   à venir.
3. **Brasa** — restaurant à Metz, 5 pages. **Démonstration, fictif.** Coordonnées,
   carte, prix et témoignages inventés : ne jamais les reprendre ailleurs, ni
   sur ce site ni dans un JSON-LD.
4. **Noverde** — paysagiste à Metz, **16 pages**, projet Astro. **Démonstration,
   fictif.** En ligne dans `/demos/noverde/` depuis le 09/09/2026. Journal de
   chantier ajouté par Alexandre le 09/09/2026 : 7 notes datées, chacune avec un
   chiffre. Les quatre concurrents messins analysés ne sont **pas nommés** dans
   le texte — décision délibérée, ce sont de vraies entreprises. Ne pas
   « corriger ».
5. **Lexora** — cabinet d'avocats à Metz, page unique. **Démonstration, fictif.**

**Ordre d'affichage : le réel d'abord, la démonstration ensuite.** Ne pas
intercaler. Le plus récent des projets réels ouvre le portfolio et alimente le
bloc « Dernière réalisation » de l'accueil — les deux pages montrent le même
projet en tête. Un futur projet livré s'insère avant Brasa, pas à la fin.

### Les démonstrations en ligne — `/demos/`

Cinq règles encadrent leur mise en ligne, et **aucune ne doit sauter** :

1. **`noindex, nofollow` sur chacune des 27 pages.**
2. **Pas de `Disallow` dans `robots.txt`** — délibéré : bloquer le crawl
   empêcherait Google de *lire* le `noindex`.
3. **Aucune donnée structurée.** Les blocs JSON-LD (`Restaurant`, etc.) ont été
   retirés. Ne jamais les réintroduire ici.
4. **Bandeau de démonstration fixé en haut de chaque page** (`.demo-flag`), avec
   retour au portfolio. Les en-têtes des deux sites étant en position fixe, ils
   sont décalés de `--demo-flag-h`. Ne pas retirer ce décalage.
5. **Aucune ressource tierce** : polices auto-hébergées dans chaque démo, et le
   cadre OpenStreetMap de la page contact de Lexora a été supprimé.

⚠️ **Le `url()` d'un `fonts.css` est relatif au fichier CSS, pas à la page.**
Brasa et Lexora ont vécu en ligne avec `url(assets/fonts/…)` dans un CSS déjà
situé dans `assets/` : les polices tombaient en 404 et les deux démos
s'affichaient en Times New Roman. Corrigé le 09/09/2026. Après toute
manipulation de polices, vérifier `document.fonts` dans la console, pas
seulement que la page « a l'air bien ». ⚠️ **Et incrémenter le `?v=N` du
`fonts.css` de la démo** : ces fichiers sont mis en cache un an. Sans nouveau
numéro, la correction reste invisible pour qui a déjà vu la page — c'est
exactement ce qui est arrivé à Brasa au premier essai.

**Noverde est construit par Astro**, pas écrit à la main. Le dossier source
(hors dépôt) vise `noverde.fr` à la racine d'un domaine ; ce qui est publié ici
a été réécrit vers `/demos/noverde/`, liens internes en `.html` compris — le
`.htaccess` ne réécrit rien sous `/demos/`. **Un nouveau build écrase ces
corrections.** Elles sont rejouées d'un coup par `.claude/noverde-publier.py`
(hors dépôt), qui recopie le build, applique les règles et **vérifie** qu'aucun
chemin ne sort de `/demos/noverde/`, qu'aucun tiers n'est appelé et que le
`noindex` est partout.

⚠️ **Chaque rubrique ajoutée au site source doit être inscrite dans `SECTIONS`**
de ce script, sinon ses liens tombent en 404 : le journal a été oublié au
premier passage, et la vérification l'a rattrapé.

⚠️ **Pas de flux RSS sur une démonstration.** Un flux ne peut pas porter de
`noindex` et diffuserait des contenus fictifs comme réels, hors du site et sans
le bandeau. `rss.xml` est supprimé à la publication, avec ses liens et le bloc
« Suivre le journal ». La correction durable serait dans le source Astro —
sinon chaque build le ramène.

**Données neutralisées — ne pas les restaurer :** adresses en « rue de la
Démonstration » ; numéros de toque et dates de serment de Lexora supprimés,
remplacés par « Profil fictif » ; les trois avis de Brasa portent « — *avis
fictif* ». ⚠️ Les portraits de Lexora sont des visages **générés**. Si un jour
ils sont remplacés, la règle demeure : **jamais de photo d'une personne réelle
sous une identité inventée.**

⚠️ Les dossiers sources restent hors dépôt (`Desktop/claude code/`).

## 10. Chantiers en cours

**En attente — ne dépend que d'Alexandre :**

- [ ] **Mentions légales — SIRET.** Pas encore obtenu (et RCS seulement s'il
      s'applique au statut). Préalable légal aux mentions légales complètes et
      à la facturation. Tant qu'il manque, la page reste `noindex`. Champs
      restants marqués `.todo` dans `mentions-legales.html`.
- [ ] **Témoignage de Gwenaëlle (Atelier Inoly).** À demander : zéro
      témoignage sur le site aujourd'hui. Idem pour Charlies Gabriella à son
      retour.
- [ ] **Mesurer l'origine des demandes.** À décider : comment savoir d'où
      vient chaque demande de devis. Sans outil tiers payant (voir §3).
- [ ] **Fiche Google Business Profile.** Trois options étudiées, voir l'archive.
      **Jamais d'adresse inventée.** Une fois la fiche choisie, ajouter son URL
      en `sameAs` dans le JSON-LD de l'accueil.
- [ ] **NAP — `latelierdamelie57.fr`.** Ce site WordPress est une ancienne
      réalisation d'Alexandre (hors dépôt, il en a les accès). Ses mentions
      légales le déclarent « édité par Alexandre COLAS, 38 rue Mangin, 57000
      Metz » : une **adresse obsolète**, publiée à son nom, et à Metz. Google
      lit ces mentions. Tant qu'elle traîne, elle contredit toute autre adresse
      déclarée — fiche Google Business comprise. À corriger avant d'ouvrir la
      fiche. Le même site est aussi le seul lien entrant possible depuis un vrai
      site messin : un « Site réalisé par Alexandre Colas » en pied de page.

- [ ] **Remettre Charlies Gabriella dans le portfolio.** Retirée le 20/09/2026
      le temps de la refonte de `charliesgi.com`. La marche à suivre est au §9.
      Tant qu'elle manque, le portfolio n'a qu'un seul projet réel.

- [ ] **Avis Google.** Seul facteur du pack local actionnable immédiatement.
      Charlies Gabriella devrait laisser le premier. Ne jamais inventer ces
      valeurs.
- [ ] **Indexation** — à vérifier dans Search Console. Ne pas passer par des
      recherches `site:` dans un navigateur (CAPTCHA).

**Pistes non engagées** (détail dans l'archive) : page `/landing-page`,
enrichissement du portfolio, CSS critique en ligne, pages Thionville / Nancy.

⚠️ **Téléphone : 06 17 97 02 74**, présent sur les 12 pages du site, dans les mentions
légales et en JSON-LD (`+33617970274`). S'il change, il doit être modifié
**partout à la fois** : un numéro divergent est pire qu'absent.

**Reste de l'audit du 09/09/2026 :**

- [ ] **Deux vues de plus pour Atelier Inoly et Charlies Gabriella.** Alexandre
      fournit lui-même ces captures : ce sont des sites clients, pas à moi de
      choisir ce qu'on en montre. Pour Inoly, le nuancier et la fiche produit
      avec choix de teinte — le texte les décrit sans jamais les montrer.

*Màj 25/09/2026 — corrections de l'audit du 13/09 : modifications après
livraison faites par Alexandre (90 €/h), « premier échange » au lieu
d'« audit », garanties retirées de la page refonte. Historique et
justifications dans `CLAUDE.archive.md`.*
