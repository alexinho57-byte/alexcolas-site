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
- **Aucune ressource tierce au chargement.** Les polices sont auto-hébergées
  (`assets/fonts/`, déclarées dans `assets/css/fonts.css`). Ne jamais rebrancher
  un CDN de polices ou de scripts : c'est à la fois une perte de performance et
  une contradiction avec les mentions légales, qui affirment qu'aucune donnée
  ne part vers un tiers.
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
| `/mentions-legales` | Mentions légales — **indexable** (voir §8) |
| `/404` | Page d'erreur — `noindex` |
| `/demos/brasa/` | Site de démonstration (restaurant fictif) — `noindex`, voir §9 |
| `/demos/lexora/` | Site de démonstration (cabinet fictif) — `noindex`, voir §9 |

**Conventions :**

- URLs **sans extension `.html`**. Les redirections 301 sont en place — toute nouvelle
  page doit suivre la même règle et être ajoutée aux redirections.
- Toute nouvelle page doit être ajoutée au `sitemap.xml`.
- **Chemins d'assets toujours absolus** (`/assets/…`, `/favicon.svg`). Les chemins
  relatifs fonctionnent à la racine mais cassent dès qu'une URL gagne un niveau
  de profondeur.
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

**Décisions arrêtées (audit SEO local du 17 août 2026) :**

- **Les mentions légales ont vocation à être indexées** — Google s'appuie sur
  cette page pour confirmer l'identité de l'entité, et une page légale complète
  est un signal de confiance, pas un déchet. Elles restent cependant en `noindex`
  et hors `sitemap.xml` **tant que le SIRET n'est pas renseigné** : faire indexer
  une page légale portant « à compléter » produit exactement l'effet inverse.
  Le jour où le SIRET existe : retirer la balise dans `mentions-legales.html`
  et décommenter le bloc déjà présent dans `sitemap.xml`.
- **Le nœud `provider` doit être redéclaré sur chaque page de service.** Google
  lit chaque page isolément : une référence `@id` vers un nœud déclaré uniquement
  sur l'accueil pointe dans le vide. Le NAP complet (adresse, téléphone) reste
  tenu à un seul endroit, l'accueil, pour éviter toute divergence.
- ❌ **Ne pas ajouter de balisage `FAQPage`.** Les résultats enrichis FAQ ne sont
  plus affichés par Google. Les FAQ visibles restent utiles pour le lecteur —
  c'est leur seule justification, et elle suffit.
- ❌ **Ne jamais déclarer une adresse à Metz** tant que le siège est à
  Silly-sur-Nied. Google contrôle, et une suspension de fiche se récupère mal.

**Règles pour toute nouvelle page :**

1. Une intention de recherche par page, ancrée géographiquement.
2. Un `<h1>` unique, une hiérarchie de titres cohérente.
3. `title` ≤ 60 caractères, `meta description` ≤ 155 caractères.
4. JSON-LD LocalBusiness + ajout au `sitemap.xml` + maillage interne depuis l'accueil.
5. Pas de bourrage de mots-clés : le texte doit rester lisible à voix haute.

## 9. Portfolio

**Règle absolue : ne jamais présenter un projet pour ce qu'il n'est pas.**
Le portfolio peut contenir des projets à des stades différents — c'est normal pour
un freelance qui démarre — mais **chaque étude de cas porte son statut de façon
visible**, et le lecteur doit toujours savoir ce qu'il regarde. Ne jamais gonfler,
ne jamais laisser un projet de démonstration passer pour une commande client.

**Trois statuts, trois traitements :**

| Statut | Badge | Classe CSS |
|---|---|---|
| Livré, en ligne | aucun badge + lien « Voir le site en ligne » | — |
| Client réel, en cours | « Projet en cours — pas encore en ligne » | `.case__status` (contour) |
| Démonstration, sans client | « Projet de démonstration — … fictif » | `.case__status.case__status--demo` (plein) |

Le badge « démonstration » est **plein** et non en contour, précisément pour qu'on
ne puisse ni le manquer ni le confondre avec « projet en cours ».

**Les quatre projets au 24/08/2026 :**

1. **Charlies Gabriella** — landing page de vente développée à la main, paiement
   **Stripe**. Livré et en ligne. ⚠️ Ce n'est **pas** un site Shopify.
2. **Atelier Inoly** (Gwenaëlle) — refonte de boutique WooCommerce. Client réel,
   développement en cours. Voir §10.
3. **Brasa** — site de restaurant à Metz, 5 pages statiques. **Démonstration,
   restaurant fictif.** Les coordonnées, la carte, les prix et les témoignages du
   projet source sont inventés : ils ne doivent jamais être repris ailleurs, ni
   sur ce site ni dans un JSON-LD.
4. **Lexora** — site de cabinet d'avocats à Metz, page unique. **Démonstration,
   cabinet fictif.**

**Pourquoi des démonstrations.** Restaurant et cabinet d'avocats sont deux
clientèles locales à forte valeur que le portfolio ne couvrait pas. Elles montrent
une compétence sectorielle avant qu'un client l'ait commandée. C'est un usage
courant et légitime — à la seule condition d'être annoncé, ce qui est fait.

**Ordre d'affichage : le réel d'abord, la démonstration ensuite.** Ne pas
intercaler. Un futur projet livré s'insère avant Brasa, pas à la fin.

### Les démonstrations en ligne — `/demos/` (24/08/2026)

Brasa et Lexora sont consultables depuis le portfolio (« Ouvrir la démonstration »).
Une capture ne prouve pas un moteur de réservation ni une page honoraires : il
fallait qu'on puisse cliquer. Cinq règles encadrent leur mise en ligne, et **aucune
ne doit sauter** :

1. **`noindex, nofollow` sur chacune des 11 pages.** Un faux restaurant et un faux
   cabinet rattachés à `alexcolas.com` brouilleraient l'entité que le SEO local
   cherche justement à faire reconnaître.
2. **Pas de `Disallow` dans `robots.txt`** — et c'est délibéré. Bloquer le crawl
   empêcherait Google de *lire* le `noindex`, et les adresses, liées depuis le
   portfolio, pourraient rester indexées à vide. Le `noindex` seul est la bonne
   réponse. Même raisonnement que pour les mentions légales.
3. **Aucune donnée structurée.** Les blocs JSON-LD (`Restaurant`, etc.) ont été
   retirés des deux projets. Ne jamais les réintroduire ici.
4. **Bandeau de démonstration fixé en haut de chaque page** (`.demo-flag`), avec
   retour vers le portfolio. Les en-têtes des deux sites étant en position fixe,
   ils sont décalés de `--demo-flag-h`. Ne pas retirer ce décalage.
5. **Aucune ressource tierce**, comme sur le reste du domaine : polices
   auto-hébergées dans chaque démo, et le cadre OpenStreetMap de la page contact
   de Lexora a été supprimé (requête tierce + marqueur sur une adresse réelle).

**Données neutralisées — ne pas les restaurer :**

- Adresses : « rue des Clercs » (une vraie rue de Metz) → **« rue de la
  Démonstration »**, qui se signale comme fictive même hors contexte.
- Lexora : les quatre portraits étaient des **photos de personnes réelles** issues
  de banques d'images, sous des identités d'avocats inventées, avec numéros de
  toque et dates de serment fabriqués. Remplacés par des monogrammes
  (`.person__portrait--vide`) et la mention « Profil fictif ».
- Brasa : les trois avis cinq étoiles portent « — *avis fictif* ».

⚠️ Les dossiers sources restent hors dépôt (`Desktop/claude code/`). Le dépôt ne
contient que les fichiers réellement servis : pour Brasa, uniquement
`assets/img/web/` et `assets/logo/web/` — les originaux pèsent 40 Mo.

## 10. État et chantiers en cours

**En attente — ne dépend que d'Alexandre :**

- [x] ~~**Numéro de téléphone**~~ — fait le 17/08/2026. **06 17 97 02 74**, présent
      dans le pied de page des 7 pages, dans la section contact de l'accueil, dans
      les mentions légales et en clé `telephone` du JSON-LD (format international
      `+33617970274`). ⚠️ Si le numéro change, il doit être modifié **partout à la
      fois** : c'est le recoupement entre le site, la fiche Google et les annuaires
      qui vaut, pas la présence seule. Un numéro divergent est pire qu'absent.
- [ ] **SIRET.** Alexandre n'en a pas encore au 17/08/2026 — l'activité n'est donc
      pas immatriculée. C'est un préalable légal à l'affichage de mentions légales
      complètes (et à la facturation). Tant qu'il manque, la page reste en `noindex`.
      Le **RCS** ne s'applique probablement pas : il vise les commerçants, alors que
      la création de sites est une prestation de services. À confirmer au moment de
      l'immatriculation ; si c'est bien le cas, supprimer la ligne plutôt que la
      laisser vide.
- [ ] **Fiche Google Business Profile.** L'adresse du siège (Silly-sur-Nied) est à
      ~20 km de Metz : le pack local se classe en grande partie sur la proximité
      géographique, donc le bloc carte de Metz restera difficile à atteindre. Trois
      options, par ordre de sérieux : **(1)** fiche en zone de service, adresse
      masquée, zones déclarées Metz + Moselle — configuration honnête pour un
      freelance qui se déplace ; **(2)** domiciliation ou bureau partagé à Metz avec
      réception de courrier, seule voie légitime pour une adresse messine, à coût
      réel ; **(3)** jamais d'adresse inventée. Une fois la fiche choisie, ajouter
      son URL publique en `sameAs` dans le JSON-LD de l'accueil.
- [ ] **Avis Google.** Second facteur du pack local, et le seul actionnable
      immédiatement. Charlies Gabriella devrait laisser le premier.
      Ne jamais inventer ces valeurs. Les champs restants sont marqués `.todo`
      dans `mentions-legales.html`.
- [ ] **Indexation** — vérifier dans Search Console (rapport *Pages* → onglets
      *Indexées* / *Non indexées*). Les recherches `site:alexcolas.com` sur Google,
      Bing et DuckDuckGo échouent (CAPTCHA / bandeau de consentement) : ne pas
      retenter cette voie, passer par Search Console.

**Pistes identifiées, non engagées :**

- **Page `/landing-page`.** C'est le seul des quatre services sans page dédiée,
  alors que c'est la seule réalisation documentée. La requête « landing page Metz »
  ne pèse rien en volume, mais la page donnerait un point d'atterrissage à mailler
  depuis le portfolio et depuis l'accueil. À rédiger avec Alexandre.
- Enrichir le portfolio à mesure que les projets sortent. Un portfolio à un projet
  est le plafond actuel de l'E-E-A-T : chaque livraison future vaut plus qu'un mois
  d'optimisation technique.
- CSS critique en ligne (les images et les polices ont été traitées le 17/08/2026).
- Pages locales supplémentaires (Thionville, Nancy) si la stratégie Metz porte.

---

*Dernière mise à jour : 24 août 2026 — mise en ligne des deux démonstrations dans
`/demos/` (noindex, bandeau, données fictives neutralisées, polices auto-hébergées),
et refonte de la §9 : trois statuts de projet, badge plein pour les démonstrations.
Précédemment, le 17/08/2026 : audit SEO local — téléphone partout, polices
auto-hébergées, images WebP + srcset, `provider` JSON-LD redéclaré, chemins d'assets
uniformisés, `.well-known` débloqué dans `.htaccess`.*
