# Chronos-Services - Générateur de CV Professionnel

## Description du projet

Ce projet propose une interface web complète pour la création, la modification et la gestion de CV professionnels, adaptée à différents profils d’utilisateurs (débutant, ancien client, expert). Il est conçu pour offrir une expérience utilisateur fluide, pédagogique et personnalisée, avec des formulaires dynamiques et une gestion avancée des données.

---

## Fonctionnalités principales

### 1. **Page d’accueil interactive**
- Sélection du profil utilisateur : Débutant, Ancien client, Expert.
- Présentation claire des parcours et des avantages pour chaque profil.

### 2. **Tutoriel interactif pour débutants**
- Guide étape par étape pour la rédaction d’un CV.
- Explications, exemples concrets, conseils et mini-FAQ.
- Navigation fluide entre les étapes, avec gestion du clavier.

### 3. **Formulaire de modification pour anciens clients**
- Formulaire simplifié et rapide pour demander des modifications sur un CV existant.
- Champs dynamiques selon la section à modifier (informations personnelles, formation, expérience, compétences, langues, centres d’intérêts, objectifs, mise en forme, plusieurs sections).
- Génération automatique de groupes de champs pour modifications multiples.
- Validation en temps réel et gestion des erreurs.
- Collecte et structuration intelligente des données : toutes les informations sont regroupées dans un message formaté, envoyé par email.

### 4. **Gestion avancée des champs dynamiques**
- Ajout/suppression de groupes de champs selon les besoins de l’utilisateur.
- Nettoyage et réinitialisation automatique lors du changement de section.
- Templates personnalisés pour chaque type de modification.

### 5. **Interface responsive et moderne**
- Design adaptatif pour mobiles, tablettes et ordinateurs.
- Effets visuels : loader, animations d’entrée, transitions, feedback utilisateur.

### 6. **Envoi sécurisé des données**
- Utilisation de Formspree pour la réception des demandes par email.
- Message structuré et complet, regroupant toutes les informations saisies.
- Gestion des niveaux d’urgence et affichage d’informations contextuelles.

### 7. **Navigation entre profils**
- Retour à l’accueil possible à tout moment.
- Redirection vers le formulaire expert pour les utilisateurs avancés.

---

## Structure des fichiers

- **index.html** : Page d’accueil principale et header (si présent).
- **interface-new.html** : Interface complète avec tutoriel, formulaire ancien client, gestion dynamique des champs, scripts JS intégrés.
- **formulaire-original.html** : Formulaire expert (accès direct pour les utilisateurs avancés).
- **README.md** : Documentation du projet, instructions et description.
- **Galleries/** : Dossier contenant les images utilisées pour la galerie (si présent).
- **assets/** : Dossier pour les ressources additionnelles (CSS, JS, images, etc.).

---

## Technologies utilisées

- **HTML5 / CSS3** : Structure et design responsive.
- **JavaScript Vanilla** : Gestion de la logique, des formulaires, des animations et de la validation.
- **Formspree** : Envoi sécurisé des données par email.

---

## Pour les développeurs

- Le code est organisé pour faciliter la maintenance et l’ajout de nouvelles sections ou templates.
- Les fonctions JS sont commentées et structurées pour une compréhension rapide.
- Les champs dynamiques sont générés à partir d’objets templates, ce qui permet une personnalisation facile.
- La validation et la gestion des erreurs sont centralisées.
- Les messages envoyés sont formatés pour une lecture claire côté réception.

---

## Pour l’IA ou la génération de contenu

- Les templates et la structure du projet permettent à une IA de générer des textes, des exemples ou des conseils pour chaque section du CV.
- Les champs dynamiques peuvent être exploités pour créer des contenus personnalisés selon le profil et les besoins de l’utilisateur.

---

## Instructions pour l’utilisation

1. Ouvrir `interface-new.html` pour accéder à toutes les fonctionnalités (tutoriel, formulaire ancien client, navigation).
2. Pour les utilisateurs experts, accéder directement à `formulaire-original.html`.
3. Les images de la galerie doivent être placées dans le dossier `Galleries` si la fonctionnalité est utilisée.
4. Modifier ou ajouter des templates dans le JS pour personnaliser les sections dynamiques.
5. Mettre à jour le formulaire et les templates selon les besoins du projet ou du client.

---

## Auteur & Contact

Projet développé pour Chronos-Services.  
Pour toute question ou demande de personnalisation, contactez l’équipe via le formulaire ou par email.

---

## Mise à jour du dépôt GitHub

Pour mettre à jour le dépôt avec vos modifications :

```powershell
git add .
git commit -m "Mise à jour du README et amélioration de l'interface CV Chronos-Services"
git push
```

---

**Ce README permet à la fois à une IA de générer du contenu pertinent et à un développeur de comprendre, maintenir et faire évoluer le projet.**
