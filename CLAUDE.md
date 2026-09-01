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

## 4. Stack et déploiement

- **Site statique HTML / CSS / JS.** Pas de framework, pas de build step, pas de
  gestionnaire de paquets. Ne pas introduire React, Tailwind, Vite ou un
  générateur de site statique sans discussion préalable explicite.
- **Aucune ressource tierce au chargement.** Polices auto-hébergées
  (`assets/fonts/`, déclarées dans `assets/css/fonts.css`). Ne jamais rebrancher
  un CDN de polices ou de scripts.
- **Hébergement : Hostinger.** HTTPS forcé. **PHP** disponible côté serveur.
- **Déploiement continu :** `git push` → webhook Hostinger → mise en ligne.
  **Un commit poussé est un commit en production.** Vérifier avant de pousser.

## 5. Structure et URLs

| URL | Contenu |
|---|---|
| `/` | Accueil : hero, services, méthode, à-propos |
| `/portfolio` | Réalisations |
| `/site-vitrine` | Service — ciblage « site vitrine Metz » |
| `/site-ecommerce` | Service — « site e-commerce Metz » (mentionne WooCommerce) |
| `/refonte-site-internet` | Service — « refonte site internet Metz » |
| `/mentions-legales` | Mentions légales — **indexable à terme** (voir §8) |
| `/404` | Page d'erreur — `noindex` |
| `/demos/brasa/` | Démonstration, restaurant fictif — `noindex`, voir §9 |
| `/demos/lexora/` | Démonstration, cabinet fictif — `noindex`, voir §9 |

**Conventions :**

- URLs **sans extension `.html`**. Redirections 301 en place — toute nouvelle
  page suit la règle et est ajoutée aux redirections.
- Toute nouvelle page est ajoutée au `sitemap.xml`.
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

**Les quatre projets au 24/08/2026 :**

1. **Charlies Gabriella** — landing page de vente à la main, paiement **Stripe**.
   Livré et en ligne. ⚠️ Ce n'est **pas** un site Shopify.
2. **Atelier Inoly** (Gwenaëlle) — refonte WooCommerce. Client réel, en cours.
3. **Brasa** — restaurant à Metz, 5 pages. **Démonstration, fictif.** Coordonnées,
   carte, prix et témoignages inventés : ne jamais les reprendre ailleurs, ni
   sur ce site ni dans un JSON-LD.
4. **Lexora** — cabinet d'avocats à Metz, page unique. **Démonstration, fictif.**

**Ordre d'affichage : le réel d'abord, la démonstration ensuite.** Ne pas
intercaler. Un futur projet livré s'insère avant Brasa, pas à la fin.

### Les démonstrations en ligne — `/demos/`

Cinq règles encadrent leur mise en ligne, et **aucune ne doit sauter** :

1. **`noindex, nofollow` sur chacune des 11 pages.**
2. **Pas de `Disallow` dans `robots.txt`** — délibéré : bloquer le crawl
   empêcherait Google de *lire* le `noindex`.
3. **Aucune donnée structurée.** Les blocs JSON-LD (`Restaurant`, etc.) ont été
   retirés. Ne jamais les réintroduire ici.
4. **Bandeau de démonstration fixé en haut de chaque page** (`.demo-flag`), avec
   retour au portfolio. Les en-têtes des deux sites étant en position fixe, ils
   sont décalés de `--demo-flag-h`. Ne pas retirer ce décalage.
5. **Aucune ressource tierce** : polices auto-hébergées dans chaque démo, et le
   cadre OpenStreetMap de la page contact de Lexora a été supprimé.

**Données neutralisées — ne pas les restaurer :** adresses en « rue de la
Démonstration » ; numéros de toque et dates de serment de Lexora supprimés,
remplacés par « Profil fictif » ; les trois avis de Brasa portent « — *avis
fictif* ». ⚠️ Les portraits de Lexora sont des visages **générés**. Si un jour
ils sont remplacés, la règle demeure : **jamais de photo d'une personne réelle
sous une identité inventée.**

⚠️ Les dossiers sources restent hors dépôt (`Desktop/claude code/`).

## 10. Chantiers en cours

**En attente — ne dépend que d'Alexandre :**

- [ ] **SIRET.** Pas encore obtenu. Préalable légal aux mentions légales
      complètes et à la facturation. Tant qu'il manque, la page reste `noindex`.
      Champs restants marqués `.todo` dans `mentions-legales.html`.
- [ ] **Fiche Google Business Profile.** Trois options étudiées, voir l'archive.
      **Jamais d'adresse inventée.** Une fois la fiche choisie, ajouter son URL
      en `sameAs` dans le JSON-LD de l'accueil.
- [ ] **Avis Google.** Seul facteur du pack local actionnable immédiatement.
      Charlies Gabriella devrait laisser le premier. Ne jamais inventer ces
      valeurs.
- [ ] **Indexation** — à vérifier dans Search Console. Ne pas passer par des
      recherches `site:` dans un navigateur (CAPTCHA).

**Pistes non engagées** (détail dans l'archive) : page `/landing-page`,
enrichissement du portfolio, CSS critique en ligne, pages Thionville / Nancy.

⚠️ **Téléphone : 06 17 97 02 74**, présent sur les 7 pages, dans les mentions
légales et en JSON-LD (`+33617970274`). S'il change, il doit être modifié
**partout à la fois** : un numéro divergent est pire qu'absent.

*Màj 01/09/2026 — historique et justifications extraits vers `CLAUDE.archive.md`.*
