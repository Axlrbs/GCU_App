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

const mobiliteRoutes = require('./routes/mobilites');
app.use('/api/mobilites', mobiliteRoutes);

const stageRoutes = require('./routes/stages');
app.use('/api/stages', stageRoutes);

const entrepriseRoutes = require('./routes/entreprises');
app.use('/api/entreprises', entrepriseRoutes);

const tuteurRoutes = require('./routes/tuteurs');
app.use('/api/tuteurs', tuteurRoutes);

const roleRoutes = require('./routes/roles');
app.use('/api/roles', roleRoutes);

const villeRoutes = require('./routes/villes');
app.use('/api/villes', villeRoutes);

const paysRoutes = require('./routes/pays');
app.use('/api/pays', paysRoutes);

const etablissementRoutes = require('./routes/etablissements');
app.use('/api/etablissements', etablissementRoutes);

const etablissementorigineformationRoutes = require('./routes/etablissementorigineformations');
app.use('/api/etablissementorigineformations', etablissementorigineformationRoutes);

const formationRoutes = require('./routes/formations');
app.use('/api/formations', formationRoutes);

const partenaireRoutes = require('./routes/partenaires');
app.use('/api/partenaires', partenaireRoutes);

const naturePartenariatRoutes = require('./routes/naturePartenariats');
app.use('/api/naturepartenariats', naturePartenariatRoutes);


// 🟢 Lancer le serveur
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur à l'écoute sur http://localhost:${PORT}`);
    console.log(`📚 Swagger dispo sur http://localhost:${PORT}/api-docs`);
  });
});
