/*
 * Visite guidée interactive — Chronos-Services (accueil)
 * Librairie : Driver.js (MIT) hébergée localement → fonctionne hors-ligne (PWA).
 *
 *  - démarre automatiquement UNE seule fois, après l'écran de bienvenue (#csOb)
 *  - mémorise « terminée » ou « passée » dans localStorage (clé ci-dessous)
 *  - relançable à tout moment : csTour.start({ force: true }) (menu → « Revoir la visite »)
 *  - une étape dont l'élément est absent/invisible est ignorée (aucun blocage)
 */
(function () {
  'use strict';

  var AUTO_DELAY = 500;
  // true = la visite s'affiche à CHAQUE ouverture de la page (même si déjà terminée/passée).
  // false = une seule fois, puis uniquement via le bouton « ? » / le menu.
  var ALWAYS_AUTO = { home: true, cv: true, maj: true };

  // Sur les formulaires : pas de relance quand l'utilisateur REVIENT du catalogue (choix du modèle).
  var CATALOGUE_FLAG = 'chronos-tour-from-catalogue';
  function markCatalogueTrip() { try { sessionStorage.setItem(CATALOGUE_FLAG, '1'); } catch (e) {} }
  function isReload() {
    try {
      var n = performance.getEntriesByType('navigation')[0];
      if (n) return n.type === 'reload';
      return performance.navigation && performance.navigation.type === 1;
    } catch (e) { return false; }
  }
  function returningFromCatalogue() {
    var flagged = false;
    try { flagged = sessionStorage.getItem(CATALOGUE_FLAG) === '1'; sessionStorage.removeItem(CATALOGUE_FLAG); } catch (e) {}
    if (isReload()) return false; // rechargement volontaire de la page : on relance la visite
    if (flagged) return true;
    return /catalogue/i.test(decodeURIComponent(document.referrer || ''));
  }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('a[href*="catalogue"], #btnCatalogueCV');
    if (t) markCatalogueTrip();
  }, true);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { try { sessionStorage.removeItem(CATALOGUE_FLAG); } catch (err) {} }
  });
  var active = null;
  // Parcours sélectionné par <body data-cs-tour="home|cv|maj"> (par défaut : accueil)
  var TOUR_NAME = (document.body && document.body.getAttribute('data-cs-tour')) || 'home';
  var STORE_KEY = TOUR_NAME === 'home' ? 'chronos-tour-v1' : 'chronos-tour-' + TOUR_NAME + '-v1';

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; }
  }
  function writeState(status) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ status: status, at: Date.now() })); } catch (e) { /* stockage indisponible : on ignore */ }
  }

  var HOME_STEPS = [
    {
      element: '.tile--a',
      radius: 24,
      popover: {
        title: 'Commander un nouveau CV',
        description: 'Remplissez un formulaire sur votre téléphone, ou <strong>scannez votre ancien CV</strong> : nos experts rédigent le reste en 48 h.',
        side: 'bottom', align: 'start'
      }
    },
    {
      element: '.tile--b',
      radius: 24,
      popover: {
        title: 'Déjà client ?',
        description: 'Retrouvez votre CV et <strong>mettez-le à jour</strong> en ajoutant ou modifiant vos informations.',
        side: 'bottom', align: 'end'
      }
    },
    {
      element: '.tile--c',
      radius: 24,
      popover: {
        title: 'Modèles Premium',
        description: 'Parcourez plus de <strong>40 modèles</strong> professionnels et choisissez celui qui vous ressemble.',
        side: 'top', align: 'end'
      }
    },
    {
      element: '.tile--e',
      radius: 24,
      popover: {
        title: 'Une question ?',
        description: 'Écrivez-nous sur <strong>WhatsApp</strong> : une réponse rapide, sans quitter l’application.',
        side: 'top', align: 'center'
      }
    },
    {
      element: '#menuFab',
      radius: 40,
      popover: {
        title: 'Le menu',
        description: 'Partage de l’application, centre d’aide, affiches, réseaux sociaux… et <strong>« Revoir la visite »</strong> si besoin.',
        side: 'top', align: 'center'
      }
    }
  ];

  var CV_STEPS = [
    {
      element: '.step-indicators', radius: 16,
      popover: {
        title: 'Un parcours en 6 étapes',
        description: 'Avancez à votre rythme : la barre de progression vous montre où vous en êtes. Les champs marqués d’un <strong>*</strong> sont obligatoires.',
        side: 'bottom', align: 'center'
      }
    },
    {
      element: '#scanFab', radius: 40,
      popover: {
        title: 'Gagnez du temps',
        description: 'Vous avez déjà un CV ? <strong>Scannez-le</strong> : l’IA pré-remplit le formulaire. Le bouton micro permet aussi de <strong>dicter</strong> vos informations.',
        side: 'top', align: 'end'
      }
    },
    {
      element: '#btnCatalogueCV', radius: 12,
      popover: {
        title: 'Choisissez votre modèle',
        description: 'Parcourez le catalogue puis revenez ici : <strong>vos réponses sont conservées</strong>. Indiquez ensuite le numéro du modèle.',
        side: 'top', align: 'center'
      }
    },
    {
      element: '#niveauUrgence', radius: 12,
      popover: {
        title: 'Délai et montant',
        description: '<strong>Normal</strong> (sous 48 h) ou <strong>Premium</strong> (priorité absolue, +50 %). Le montant à payer s’affiche juste en dessous.',
        side: 'top', align: 'center'
      }
    },
    {
      element: '#nextBtn', radius: 14,
      popover: {
        title: 'Passez à la suite',
        description: 'Cliquez sur <strong>Suivant</strong> quand vous avez terminé. Un champ obligatoire oublié sera signalé en rouge, et vous pourrez tout vérifier avant l’envoi.',
        side: 'top', align: 'end'
      }
    }
  ];

  var MAJ_STEPS = [
    {
      element: '#scannerCard', radius: 18,
      popover: {
        title: 'Un document à importer ?',
        description: 'Optionnel : contrat, diplôme, attestation… l’IA <strong>pré-remplit</strong> les champs à votre place.',
        side: 'bottom', align: 'center'
      }
    },
    {
      element: '#renouveauCard', radius: 18,
      popover: {
        title: 'Changer de modèle ?',
        description: 'Activez cette option <strong>seulement</strong> si vous souhaitez un nouveau design pour votre CV.',
        side: 'bottom', align: 'center'
      }
    },
    {
      element: '#cardIdentification .card-head', radius: 18,
      popover: {
        title: 'Vos coordonnées',
        description: 'Votre nom et votre téléphone nous permettent de <strong>retrouver votre dossier</strong>. Ces champs sont obligatoires.',
        side: 'bottom', align: 'center'
      }
    },
    {
      element: '.rubrique-grid', radius: 16,
      popover: {
        title: 'Cochez ce qui a changé',
        description: 'Sélectionnez <strong>uniquement</strong> les rubriques à modifier : une zone de saisie apparaît pour chacune.',
        side: 'bottom', align: 'center'
      }
    },
    {
      element: '#submitBtn', radius: 14,
      popover: {
        title: 'Envoyez votre demande',
        description: 'Une fois vos modifications saisies, envoyez : <strong>notre équipe s’occupe du reste</strong>.',
        side: 'top', align: 'center'
      }
    }
  ];

  var STEPS = { home: HOME_STEPS, cv: CV_STEPS, maj: MAJ_STEPS }[TOUR_NAME] || HOME_STEPS;

  function isVisible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    var cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  function anyOverlayOpen() {
    if (document.querySelector('#csOb')) return true;
    var sels = ['.share-backdrop.open', '.menu-backdrop.open', '.modal-backdrop.open', '#majModal.open',
                '#scannerOverlay', '#micOverlay', '.payment-modal', '.modal-overlay'];
    return sels.some(function (q) {
      var el = document.querySelector(q);
      if (!el) return false;
      if (/\.open$/.test(q)) return true;
      return window.getComputedStyle(el).display !== 'none';
    });
  }

  function start(opts) {
    opts = opts || {};
    if (active) return false;
    var lib = window.driver && window.driver.js && window.driver.js.driver;
    if (!lib) return false; // librairie non chargée : on n'affiche rien plutôt que casser la page
    if (!opts.force && ((!ALWAYS_AUTO[TOUR_NAME] && readState()) || anyOverlayOpen())) return false;

    var steps = STEPS.filter(function (s) { return isVisible(document.querySelector(s.element)); });
    if (!steps.length) return false;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finished = false;
    var total = steps.length;
    var drv;
    var closed = false;

    // Nettoyage idempotent : appelé quelle que soit la façon de quitter (Terminer, ×, Échap, « Passer »)
    function finish() {
      if (closed) return;
      closed = true;
      document.body.classList.remove('cs-tour-on');
      active = null;
      writeState(finished ? 'done' : 'skipped');
    }

    function setRadius(r) {
      drv.setConfig(Object.assign({}, drv.getConfig(), { stageRadius: r }));
    }

    drv = lib({
      steps: steps.map(function (s) {
        return {
          element: s.element, popover: s.popover,
          onHighlightStarted: function () { setRadius(s.radius); },
          // recalage une fois le défilement / la mise en page stabilisés (polices, images, formulaires)
          onHighlighted: function () {
            [350, 900].forEach(function (d) { setTimeout(function () { if (!closed && drv.isActive()) drv.refresh(); }, d); });
          }
        };
      }),
      popoverClass: 'cs-tour',
      showProgress: true,
      progressText: 'Étape {{current}} sur {{total}}',
      nextBtnText: 'Suivant',
      prevBtnText: 'Précédent',
      doneBtnText: 'Terminer',
      showButtons: ['previous', 'next', 'close'],
      overlayColor: '#04180a',
      overlayOpacity: 0.78,
      stagePadding: 8,
      stageRadius: 24,
      popoverOffset: 14,
      animate: !reduceMotion,
      smoothScroll: !reduceMotion,
      allowClose: true,
      allowKeyboardControl: true,
      disableActiveInteraction: true,   // empêche de quitter la page en cliquant sur une tuile pendant la visite
      overlayClickBehavior: function () {}, // un tap à côté ne ferme pas la visite par accident
      skipMissingElement: true,
      onPopoverRender: function (popover, o) {
        var closeBtn = popover.wrapper.querySelector('.driver-popover-close-btn');
        if (closeBtn) closeBtn.setAttribute('aria-label', 'Quitter la visite guidée');
        var prevBtn = popover.wrapper.querySelector('.driver-popover-prev-btn');
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Étape précédente');
        var last = o.driver.isLastStep();
        if (!last && !popover.footer.querySelector('.cs-tour-skip')) {
          var skip = document.createElement('button');
          skip.type = 'button';
          skip.className = 'cs-tour-skip';
          skip.textContent = 'Passer la visite';
          skip.addEventListener('click', function () { finish(); o.driver.destroy(); });
          popover.footer.appendChild(skip);
        }
      },
      onNextClick: function (el, step, o) {
        if (o.driver.isLastStep()) { finished = true; finish(); o.driver.destroy(); }
        else o.driver.moveNext();
      },
      onDestroyStarted: function (el, step, o) { finish(); o.driver.destroy(); },
      onDestroyed: finish
    });

    document.body.classList.add('cs-tour-on');
    active = drv;
    window.scrollTo({ top: 0, behavior: 'auto' });
    drv.drive();
    return true;
  }

  function stop() { if (active) active.destroy(); }

  function maybeAutoStart() {
    if (TOUR_NAME !== 'home' && returningFromCatalogue()) return;
    setTimeout(function () { start(); }, AUTO_DELAY);
  }

  window.csTour = { start: start, stop: stop, reset: function () { try { localStorage.removeItem(STORE_KEY); } catch (e) {} } };

  // Bouton « ? » flottant sur les formulaires : permet de relancer l'aide à tout moment
  function addHelpButton() {
    if (TOUR_NAME === 'home' || document.querySelector('.cs-tour-help')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cs-tour-help';
    b.setAttribute('aria-label', 'Besoin d’aide ? Lancer la visite guidée');
    b.title = 'Besoin d’aide ?';
    b.innerHTML = '<span aria-hidden="true">?</span>';
    b.addEventListener('click', function () { start({ force: true }); });
    document.body.appendChild(b);
  }

  // Démarrage auto : après fermeture de l'écran de bienvenue, ou tout de suite s'il n'existe pas
  document.addEventListener('cs:onboarding-closed', maybeAutoStart);
  function init() { addHelpButton(); if (!document.getElementById('csOb')) maybeAutoStart(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
