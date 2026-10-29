# Visite guidée interactive — historique des modifications

Librairie : Driver.js 1.10.2 (MIT), hébergée localement (pas de CDN → compatible PWA hors-ligne).
Déploiement : copier tous les fichiers ci-dessous à la racine du dépôt (mêmes chemins), puis commit/push (Netlify publie la racine `.`).

## Fichiers AJOUTÉS
- `css/driver.css`            — styles de base Driver.js (copie de la librairie)
- `css/chronos-tour.css`      — thème Chronos (vert/orange, Sora/DM Sans) + bouton flottant « ? »
- `js/vendor/driver.js.iife.js` — Driver.js 1.10.2 (copie locale)
- `js/chronos-tour.js`        — logique : parcours (home / cv / maj / catalogue), mémorisation, bouton « ? », démarrage auto
- `CHANGELOG-visite-guidee.md` — ce fichier

## Fichiers MODIFIÉS
- `index.html` (accueil)
  - `<head>` : + `css/driver.css`, `css/chronos-tour.css`
  - menu « + » : + entrée « Revoir la visite guidée »
  - fonction `closeOb()` (onboarding) : + `document.dispatchEvent(new CustomEvent('cs:onboarding-closed'))`
  - avant `</body>` : + `js/vendor/driver.js.iife.js` et `js/chronos-tour.js` (defer)
- `formulaire-cv-scanner.html` : `<body data-cs-tour="cv">`, + 2 CSS dans `<head>`, + 2 scripts avant `</body>`
- `formulaire-mise-a-jour-cv.html` : `<body data-cs-tour="maj">`, + 2 CSS dans `<head>`, + 2 scripts avant `</body>`
- `sw.js` : `CACHE_VERSION` "v1" → "v3" (à incrémenter à chaque modification de js/chronos-tour.js ou css/chronos-tour.css, sinon les navigateurs gardent l'ancienne version en cache : le SW sert les JS/CSS en cache-first) ; + 4 fichiers (css/js ci-dessus) dans `PRECACHE_ASSETS`

## Comportement
- Accueil (`home`) : la visite s'affiche À CHAQUE ouverture, après l'écran de bienvenue `#csOb` ; « Passer la visite » / × / Échap la ferme.
- Formulaires (`cv`, `maj`) : la visite s'affiche à chaque ouverture ET à chaque rechargement volontaire de la page,
  SAUF quand l'utilisateur revient du catalogue après avoir choisi un modèle (détecté par un drapeau sessionStorage
  `chronos-tour-from-catalogue` posé au clic sur un lien/bouton « catalogue », et par document.referrer contenant « catalogue »).
  Un rechargement (F5) relance toujours la visite.
- Catalogue (`catalogue`) : visite de 12 étapes, à chaque ouverture/rechargement. Elle OUVRE ET FERME elle-même l'aperçu (`previewModel`/`closePreview`) et la fenêtre de partage (`#shareBtn`/`closeShare`) : recherche, filtres, aperçu/choix, flèches de navigation, zoom, « Choisir », « Partager », avis WhatsApp + téléchargement image HD, lien + réseaux, QR code, plein écran, comparer. Les flèches ← → du clavier pilotent la visite (et non le carrousel). Chaque étape a un champ `ui` ('list' | 'preview' | 'share') dans `CATALOGUE_STEPS`. Bouton « ? » en bas à DROITE (le tiroir « récents » occupe le bas-gauche).
- Bouton « ? » flottant sur les formulaires et le catalogue (conservé) : relance manuelle à tout moment.
- Réglage : objet `ALWAYS_AUTO` en haut de `js/chronos-tour.js` (false = une seule fois puis manuel).
- Relance manuelle : menu « + » → « Revoir la visite guidée » (accueil), bouton « ? » (formulaires), console `csTour.start({force:true})`.

- `catalogue de CV.html` : `<body data-cs-tour="catalogue">`, + 2 CSS dans `<head>`, + 2 scripts avant `</body>`

## Fichiers NON modifiés
Tout le reste (autres pages HTML, `js/pwa-*.js`, `manifest.json`, `netlify.toml`, fonctions, images…).
