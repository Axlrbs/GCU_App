// 📁 server.js

const express = require('express');
const app = express();
const db = require('./models');

app.use(express.json()); // Pour parser les JSON entrants

// 🌐 Swagger
const setupSwagger = require('./swagger');
setupSwagger(app);

// 📦 Routes
const etudiantRoutes = require('./routes/etudiant');
app.use('/api/etudiants', etudiantRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 🟢 Lancer le serveur
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur à l'écoute sur http://localhost:${PORT}`);
    console.log(`📚 Swagger dispo sur http://localhost:${PORT}/api-docs`);
  });
});
