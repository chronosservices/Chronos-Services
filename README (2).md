# Formulaire CV – Scanner IA (Groq + PDF.js + Tesseract)

## 🔧 Pipeline de traitement

```
Document soumis
    │
    ├─ PDF numérique  →  PDF.js  (extraction texte, gratuit, hors-ligne)
    ├─ PDF scanné     →  Tesseract.js OCR  (reconnaissance caractères)
    └─ Image JPG/PNG  →  Tesseract.js OCR  (reconnaissance caractères)
                                │
                                ▼
                    Groq API  →  LLaMA 3.3 70B
                    (analyse IA, mapping des champs)
                                │
                                ▼
                    Pré-remplissage formulaire
```

---

## 📁 Structure du projet

```
cv-app/
├── index.html                          ← Formulaire principal (renomme formulaire-cv-scanner.html)
├── netlify.toml
├── netlify/
│   └── functions/
│       └── groq-proxy.js               ← Proxy sécurisé (Netlify uniquement)
└── public/
    └── Business-Facebook-Cover-05.jpg
```

---

## 🚀 Démarrage rapide

### Étape 1 – Obtenir une clé Groq GRATUITE
1. Va sur **https://console.groq.com**
2. Crée un compte (gratuit, pas de carte bancaire)
3. Va dans **API Keys → Create API Key**
4. Copie la clé (commence par `gsk_...`)

### Étape 2 – Mettre la clé dans le code
Dans `index.html`, ligne ~649 :
```javascript
var GROQ_API_KEY = 'gsk_REMPLACEZ_PAR_VOTRE_CLE_GROQ';
//                         ↑ Remplace par ta vraie clé
```

### Étape 3 – Déployer sur GitHub Pages (le plus simple)
1. Crée un dépôt GitHub
2. Upload les fichiers
3. Settings → Pages → Branch: main → Save
4. Ton site est en ligne sur `https://ton-username.github.io/ton-repo/`

---

## 🔒 Déploiement sécurisé sur Netlify (clé cachée)

Si tu ne veux pas que la clé soit visible dans le code HTML :

1. Déploie sur **netlify.com** (connecte ton GitHub)
2. **Site configuration → Environment variables → Add variable** :
   - Key : `GROQ_API_KEY`
   - Value : `gsk_ta_vraie_cle_ici`
3. Redéploie

Le code détecte automatiquement Netlify et utilise le proxy sécurisé.

---

## 📊 Limites Groq (plan gratuit)

| Modèle | Requêtes/minute | Requêtes/jour | Tokens/minute |
|--------|----------------|---------------|---------------|
| llama-3.3-70b-versatile | 30 | 14 400 | 12 000 |

→ **Largement suffisant** pour un usage personnel ou une petite entreprise.

---

## 💡 Conseils pour de meilleurs résultats

- **PDF numérique** (créé sur ordinateur) = meilleure qualité, extraction instantanée
- **PDF scanné / image** = OCR via Tesseract (10-30 secondes selon la taille)
- Images floues ou mal éclairées = résultats OCR dégradés
- Le formulaire reste éditable après le pré-remplissage