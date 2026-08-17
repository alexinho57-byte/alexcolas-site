# CLAUDE.md — alexcolas.com

Fichier de contexte du projet. Lu automatiquement par Claude Code à chaque session,
et synchronisé dans le Projet Claude.ai via le connecteur GitHub.

> **Règle n°1 : ce fichier est la source de vérité.**
> Toute décision structurante (design, wording, technique, SEO) doit être écrite ici
> dans le même commit que le changement. Si ce n'est pas écrit ici, ce sera oublié
> à la prochaine session.

---

## 1. Le projet

Site vitrine d'**Alexandre Colas**, freelance en création de sites internet à **Metz**.
Objectif : générer des demandes de devis locales (Metz et Moselle) et servir de
démonstration du savoir-faire — le site est lui-même une pièce du portfolio.

Domaine : `alexcolas.com`

## 2. Le client

Alexandre est **non-technique mais très impliqué** : il relit et valide chaque décision
de design, de wording et de structure.

**Conséquences sur la façon de travailler :**

- Expliquer le *pourquoi* avant le *comment*, en français courant, sans jargon inutile.
- Ne pas attendre de specs détaillées : **proposer des recommandations argumentées**,
  avec les alternatives et leurs compromis. Le rôle est celui d'un conseil (SEO,
  architecture, choix techniques), pas d'un simple exécutant.
- Avant une modification qui touche plusieurs pages ou change un parti pris visuel :
  annoncer ce qui va changer et pourquoi, puis attendre la validation.
- Les corrections mineures (typo, balise oubliée, lien mort) peuvent être faites
  directement, en les signalant.

## 3. Positionnement et ton

Le positionnement commande le contenu **et** les choix techniques.

- **Sur mesure, artisanal, proche du client.** Anti « usine à sites ».
- **Pas d'abonnement, pas de dépendance.** Le client reste propriétaire de son site.
- Ton professionnel mais humain. Pas de superlatifs marketing, pas de « solutions
  innovantes », pas de promesses chiffrées invérifiables.
- Le vocabulaire de la couture et de l'artisanat est cohérent avec la marque
  (le logo porte une piqûre de couture) — à utiliser avec parcimonie, sans le filer
  jusqu'à l'excès.

**Test de cohérence :** toute proposition qui créerait une dépendance à un service
tiers payant ou récurrent est contraire au positionnement. C'est la raison pour
laquelle Formspree a été abandonné au profit d'un script PHP maison.

## 4. Stack et déploiement

- **Site statique HTML / CSS / JS.** Pas de framework, pas de build step, pas de
  gestionnaire de paquets. Ne pas introduire React, Tailwind, Vite ou un générateur
  de site statique sans discussion préalable explicite.
- **Hébergement : Hostinger.** HTTPS forcé.
- **Déploiement continu :** `git push` sur GitHub → webhook Hostinger → mise en ligne.
  Un commit poussé est un commit en production. Vérifier avant de pousser.
- **PHP** disponible côté serveur (utilisé par le formulaire de contact).

## 5. Structure et URLs

| URL | Contenu |
|---|---|
| `/` | Accueil : hero, services, méthode, à-propos |
| `/portfolio` | Réalisations |
| `/site-vitrine` | Page de service — ciblage « site vitrine Metz » |
| `/site-ecommerce` | Page de service — ciblage « site e-commerce Metz » (mentionne WooCommerce, ajouté à la demande d'Alexandre) |
| `/refonte-site-internet` | Page de service — ciblage « refonte site internet Metz » |
| `/mentions-legales` | Mentions légales |
| `/404` | Page d'erreur |

**Conventions :**

- URLs **sans extension `.html`**. Les redirections 301 sont en place — toute nouvelle
  page doit suivre la même règle et être ajoutée aux redirections.
- Toute nouvelle page doit être ajoutée au `sitemap.xml`.
- Le header, le footer, les balises meta et le JSON-LD sont **dupliqués dans chaque
  fichier** (pas de framework). Une modification de l'un de ces blocs doit être
  répercutée sur **toutes** les pages, y compris `/404` et `/mentions-legales`.
  C'est l'erreur la plus fréquente sur ce projet — vérifier systématiquement.

## 6. Design system

- **Palette :** taupe / marine / os, dérivée du portrait d'Alexandre.
  *(Codes hex : voir les variables CSS en tête de la feuille de styles — s'y référer
  plutôt que de saisir des couleurs en dur.)*
- **Typographie : Bricolage Grotesque.** Choix définitif.
- **Logo :** monogramme « AC » avec une piqûre de couture, symbole du sur-mesure.
- Priorité au **mobile** : c'est le critère qui a tranché le choix de police.

**Décisions arrêtées — ne pas rouvrir sans demande explicite d'Alexandre :**

- ❌ **Syne** — rejetée, jugée peu lisible sur mobile. Ne pas la reproposer.
- ❌ Les anciennes palettes et polices testées puis écartées. Le sujet est clos.
- ❌ **Formspree** et toute solution de formulaire tierce — contraire au positionnement.

## 7. Formulaire de contact

- Script PHP maison : `contact.php`, avec protection anti-spam.
- Autonome par principe : aucun service tiers, aucun abonnement.
- Toute évolution doit conserver cette autonomie et rester testable en local.

## 8. SEO

État en place :

- `title`, `meta description` et balises Open Graph optimisés avec l'ancrage **« Metz »**.
- Données structurées **Schema.org / LocalBusiness** (à répercuter sur toute nouvelle page).
- `robots.txt` et `sitemap.xml` créés, sitemap soumis.
- **Google Search Console** configuré.
- **Google Business Profile** créé en parallèle par Alexandre (cohérence à maintenir
  entre les NAP — nom, adresse, téléphone — du site et de la fiche).
- Pages de service dédiées aux requêtes locales (cf. section 5).

**Règles pour toute nouvelle page :**

1. Une intention de recherche par page, ancrée géographiquement.
2. Un `<h1>` unique, une hiérarchie de titres cohérente.
3. `title` ≤ 60 caractères, `meta description` ≤ 155 caractères.
4. JSON-LD LocalBusiness + ajout au `sitemap.xml` + maillage interne depuis l'accueil.
5. Pas de bourrage de mots-clés : le texte doit rester lisible à voix haute.

## 9. Portfolio

- **Charlies Gabriella** — landing page développée à la main, avec système de paiement
  **Stripe** intégré. Seul projet réel documenté à ce jour.
  ⚠️ Ce n'est **pas** un site Shopify. Ne pas le décrire comme tel.
- Ne jamais inventer, gonfler ou illustrer une réalisation fictive. Le portfolio ne
  contient que des projets réellement livrés.

## 10. État et chantiers en cours

**En attente :**

- [ ] **Mentions légales** — quasi complètes. Manquent le **SIRET** et la **forme
      juridique précise**. Ne pas inventer ces valeurs : les demander à Alexandre.
- [ ] **Indexation** — vérifier dans Search Console (rapport *Pages* → onglets
      *Indexées* / *Non indexées*). Les recherches `site:alexcolas.com` sur Google,
      Bing et DuckDuckGo échouent (CAPTCHA / bandeau de consentement) : ne pas
      retenter cette voie, passer par Search Console.

**Pistes identifiées, non engagées :**

- Enrichir le portfolio à mesure que les projets sortent.
- Performance / Core Web Vitals : compression des images, CSS critique.
- Pages locales supplémentaires (Thionville, Nancy) si la stratégie Metz porte.

---

*Dernière mise à jour : à renseigner à chaque modification de ce fichier.*
