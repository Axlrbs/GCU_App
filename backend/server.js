// 📁 server.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const app = express();
const db = require('./models');
const fs = require('fs');
const path = require('path');

// ANTI-DDOS
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
});

app.use(limiter);

app.use(express.json()); // Pour parser les JSON entrants
app.use(helmet());

// forcer le https
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// 🌐 Swagger
const setupSwagger = require('./swagger');
setupSwagger(app);

app.use('/api-docs', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).send('Accès refusé en production');
  }
  next();
});

// LOG
const morgan = require('morgan');
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' } // 'a' pour ajouter à la fin sans écraser
);

// Logger toutes les requêtes dans access.log
app.use(morgan('combined', { stream: accessLogStream }));


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

const etudiantParticipePartenariatRoutes = require('./routes/etudiantparticipepartenariat');
app.use('/api/etudiantparticipepartenariats', etudiantParticipePartenariatRoutes);

const certificationLangueRoutes = require('./routes/certificationlangues');
app.use('/api/certificationlangues', certificationLangueRoutes);

const etudiantPasseCertificationRoutes = require('./routes/etudiantpassecertifications');
app.use('/api/etudiantpassecertifications', etudiantPasseCertificationRoutes);

const absenceRoutes = require('./routes/absences');
app.use('/api/absences', absenceRoutes);

const etatRoutes = require('./routes/etats');
app.use('/api/etats', etatRoutes);

const typeMobiliteRoutes = require('./routes/typemobilites');
app.use('/api/typemobilites', typeMobiliteRoutes);

const cursusRoutes = require('./routes/cursus');
app.use('/api/cursus', cursusRoutes);

const decisionJurysRoutes = require('./routes/decisionjurys');
app.use('/api/decisionjurys', decisionJurysRoutes);

const promotionRoutes = require('./routes/promotions');
app.use('/api/promotions', promotionRoutes);

const anneeUniversitaireRoutes = require('./routes/anneeuniversitaires');
app.use('/api/anneeuniversitaires', anneeUniversitaireRoutes);

const resultatAnneeEtudiantRoutes = require('./routes/resultatanneeetudiants');
app.use('/api/resultatanneeetudiants', resultatAnneeEtudiantRoutes);

const semestreRoutes = require('./routes/semestres');
app.use('/api/semestres', semestreRoutes);

const parcoursRoutes = require('./routes/parcours');
app.use('/api/parcours', parcoursRoutes);

const parcoursEtudiantParSemestreRoutes = require('./routes/parcoursEtudiantParSemestre')
app.use('/api/parcoursetudiantparsemestre', parcoursEtudiantParSemestreRoutes);

const utilisateurRoutes =  require('./routes/utilisateurs')
app.use('/api/utilisateurs', utilisateurRoutes);



// 🟢 Lancer le serveur
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur à l'écoute sur http://localhost:${PORT}`);
    console.log(`📚 Swagger dispo sur http://localhost:${PORT}/api-docs`);
  });
});
