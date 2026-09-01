# CLAUDE.archive.md — historique et justifications

Ce fichier n'est **pas** chargé automatiquement en contexte. Il conserve le
raisonnement derrière les décisions listées dans `CLAUDE.md`, pour le jour où
l'on se demandera « pourquoi avoir tranché comme ça ». Les règles, elles,
restent dans `CLAUDE.md` : c'est lui la source de vérité.

Extrait le 1er septembre 2026, lors d'un audit d'efficacité du contexte
(le fichier faisait 293 lignes et était relu à chaque tour de chaque session).

---

## Pourquoi le sur-mesure plutôt que l'usine à sites

Le positionnement commande le contenu **et** les choix techniques. Toute
proposition qui créerait une dépendance à un service tiers payant ou récurrent
est contraire au positionnement. C'est la raison pour laquelle Formspree a été
abandonné au profit d'un script PHP maison.

Le vocabulaire de la couture et de l'artisanat est cohérent avec la marque
(le logo porte une piqûre de couture) — à utiliser avec parcimonie, sans le
filer jusqu'à l'excès.

## Pourquoi aucune ressource tierce au chargement

Les polices sont auto-hébergées. Rebrancher un CDN de polices ou de scripts
serait à la fois une perte de performance et une contradiction avec les
mentions légales, qui affirment qu'aucune donnée ne part vers un tiers.

## Pourquoi les mentions légales ont vocation à être indexées

Google s'appuie sur cette page pour confirmer l'identité de l'entité, et une
page légale complète est un signal de confiance, pas un déchet. Elles restent
cependant en `noindex` et hors `sitemap.xml` tant que le SIRET n'est pas
renseigné : faire indexer une page légale portant « à compléter » produit
exactement l'effet inverse.

## Pourquoi redéclarer `provider` sur chaque page de service

Google lit chaque page isolément : une référence `@id` vers un nœud déclaré
uniquement sur l'accueil pointe dans le vide. Le NAP complet (adresse,
téléphone) reste tenu à un seul endroit, l'accueil, pour éviter toute
divergence.

## Pourquoi pas de balisage FAQPage

Les résultats enrichis FAQ ne sont plus affichés par Google. Les FAQ visibles
restent utiles pour le lecteur — c'est leur seule justification, et elle suffit.

## Pourquoi jamais d'adresse à Metz tant que le siège est à Silly-sur-Nied

Google contrôle, et une suspension de fiche se récupère mal.

## Pourquoi des projets de démonstration au portfolio

Restaurant et cabinet d'avocats sont deux clientèles locales à forte valeur que
le portfolio ne couvrait pas. Elles montrent une compétence sectorielle avant
qu'un client l'ait commandée. C'est un usage courant et légitime — à la seule
condition d'être annoncé, ce qui est fait.

Le badge « démonstration » est **plein** et non en contour, précisément pour
qu'on ne puisse ni le manquer ni le confondre avec « projet en cours ».

## Pourquoi les démonstrations sont en ligne, et pourquoi pas de Disallow

Une capture ne prouve pas un moteur de réservation ni une page honoraires : il
fallait qu'on puisse cliquer.

Bloquer le crawl dans `robots.txt` empêcherait Google de *lire* le `noindex`,
et les adresses, liées depuis le portfolio, pourraient rester indexées à vide.
Le `noindex` seul est la bonne réponse. Même raisonnement que pour les
mentions légales.

Un faux restaurant et un faux cabinet rattachés à `alexcolas.com` brouilleraient
l'entité que le SEO local cherche justement à faire reconnaître — d'où le
`noindex` sur les 11 pages.

## Pourquoi les portraits de Lexora ont été remplacés

Les quatre portraits étaient des photos de **personnes réelles** issues de
banques d'images, sous des identités d'avocats inventées, avec numéros de toque
et dates de serment fabriqués. Remplacés le 24/08/2026 par quatre visages
**générés** par Alexandre : personne de réel derrière, donc plus d'atteinte au
droit à l'image. C'était la seule raison des monogrammes ; la classe
`.person__portrait--vide` reste en place comme repli mais n'est plus utilisée.

Les adresses ont été passées de « rue des Clercs » (une vraie rue de Metz) à
« rue de la Démonstration », qui se signale comme fictive même hors contexte.

Les dossiers sources restent hors dépôt (`Desktop/claude code/`). Le dépôt ne
contient que les fichiers réellement servis : pour Brasa, uniquement
`assets/img/web/` et `assets/logo/web/` — les originaux pèsent 40 Mo.

## Téléphone — chantier clos le 17/08/2026

**06 17 97 02 74**, ajouté dans le pied de page des 7 pages, dans la section
contact de l'accueil, dans les mentions légales et en clé `telephone` du JSON-LD
(format international `+33617970274`).

## SIRET et RCS — raisonnement

Alexandre n'a pas de SIRET au 17/08/2026 : l'activité n'est donc pas
immatriculée. C'est un préalable légal à l'affichage de mentions légales
complètes (et à la facturation).

Le **RCS** ne s'applique probablement pas : il vise les commerçants, alors que
la création de sites est une prestation de services. À confirmer au moment de
l'immatriculation ; si c'est bien le cas, supprimer la ligne plutôt que la
laisser vide.

## Fiche Google Business Profile — les trois options étudiées

L'adresse du siège (Silly-sur-Nied) est à ~20 km de Metz : le pack local se
classe en grande partie sur la proximité géographique, donc le bloc carte de
Metz restera difficile à atteindre. Trois options, par ordre de sérieux :

1. Fiche en **zone de service**, adresse masquée, zones déclarées Metz +
   Moselle — configuration honnête pour un freelance qui se déplace.
2. **Domiciliation** ou bureau partagé à Metz avec réception de courrier, seule
   voie légitime pour une adresse messine, à coût réel.
3. **Jamais d'adresse inventée.**

Une fois la fiche choisie, ajouter son URL publique en `sameAs` dans le JSON-LD
de l'accueil.

## Indexation — voie à ne pas retenter

Les recherches `site:alexcolas.com` sur Google, Bing et DuckDuckGo échouent
(CAPTCHA / bandeau de consentement). Passer par Search Console, rapport
*Pages* → onglets *Indexées* / *Non indexées*.

## Pistes identifiées, non engagées

- **Page `/landing-page`.** Seul des quatre services sans page dédiée, alors que
  c'est la seule réalisation documentée. La requête « landing page Metz » ne
  pèse rien en volume, mais la page donnerait un point d'atterrissage à mailler
  depuis le portfolio et depuis l'accueil. À rédiger avec Alexandre.
- Enrichir le portfolio à mesure que les projets sortent. Un portfolio à un
  projet est le plafond actuel de l'E-E-A-T : chaque livraison future vaut plus
  qu'un mois d'optimisation technique.
- CSS critique en ligne (images et polices traitées le 17/08/2026).
- Pages locales supplémentaires (Thionville, Nancy) si la stratégie Metz porte.

## Journal

- **17/08/2026** — audit SEO local : téléphone partout, polices auto-hébergées,
  images WebP + srcset, `provider` JSON-LD redéclaré, chemins d'assets
  uniformisés, `.well-known` débloqué dans `.htaccess`.
- **20/08/2026** — Atelier Inoly ajouté au portfolio comme projet en cours.
- **24/08/2026** — mise en ligne des deux démonstrations dans `/demos/`
  (noindex, bandeau, données fictives neutralisées, polices auto-hébergées) ;
  refonte de la §9 : trois statuts de projet, badge plein pour les
  démonstrations.
- **01/09/2026** — extraction de ce fichier depuis `CLAUDE.md`.
