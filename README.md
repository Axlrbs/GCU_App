# Backend GCU_App

Bienvenue dans le backend du projet **GCU_App**. Ce serveur est construit avec **Node.js**, **Express**, **Sequelize** et utilise **Swagger** pour documenter l'API.

---

## 📂 Structure du projet

```
backend/
├── config/            # Configuration Sequelize (config.js)
├── controllers/       # Logique des routes (CRUD)
├── models/            # Modèles Sequelize
├── routes/            # Définition des routes
├── middlewares/       # Middlewares personnalisés (ex: authentification)
├── server.js          # Fichier principal du serveur Express
├── swagger.js         # Configuration de la documentation Swagger
├── .env               # Variables d'environnement (PORT, DB, etc.)
├── package.json       # Dépendances et scripts
```

---

## 🚀 Lancer le projet en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet avec le contenu suivant :

```bash
PORT=3000
JWT_SECRET=mon_super_secret
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=database_development
DATABASE_HOST=127.0.0.1
DATABASE_DIALECT=postgres
```

**Important** : Adaptez les informations à votre propre base de données.

### 3. Lancer le serveur en mode développement

```bash
npm run dev
```

> Le serveur sera disponible sur : http://localhost:3000

### 4. Accéder à la documentation Swagger

```
http://localhost:3000/api-docs
```

---

## 🛡️ Sécurité (Production)

- Utiliser `helmet` pour sécuriser les headers HTTP.
- Limiter le nombre de requêtes via `express-rate-limit`.
- Protéger Swagger API-docs derrière un filtre en production.
- Logger toutes les erreurs importantes via `winston`.
- Ne pas exposer le fichier `.env` publiquement.

---

## 📊 Scripts disponibles

Dans le fichier `package.json` :

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development node server.js",
  "start": "cross-env NODE_ENV=production node server.js"
}
```

- `npm run dev` : Lance le serveur en mode développement
- `npm start` : Lance le serveur en mode production

---

## 💡 Améliorations possibles

- Ajouter la rotation des logs (winston + daily rotate file)
- Ajouter l'intégration continue (CI/CD) avec GitHub Actions
- Déployer sur Render, Railway, AWS ou autre fournisseur cloud

---

## 📖 Auteur

- Projet réalisé par **[Ton Nom ici]**
- Backend Node.js Express / Sequelize 2025

---

> Ce README est généré pour te donner un projet backend clair, évolutif et prêt pour la production. 🚀
