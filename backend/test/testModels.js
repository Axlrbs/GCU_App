const db = require('../models');

(async () => {
  await db.sequelize.authenticate();

  /*const formation = await db.formation.findOne({
    where: { formationId: 7 },
    include: db.etudiant
  });
  console.log(JSON.stringify(formation,null, 2));



  const villes = await db.ville.findAll({
    include: db.entreprise
  });
  console.log(JSON.stringify(villes,null, 2));
  


  const entreprises = await db.entreprise.findAll({
    include: db.ville
  });
  console.log(JSON.stringify(entreprises,null, 2));

  const stages = await db.stage.findAll({
    include: [
      db.entreprise,
      db.etudiant,
      { model: db.tuteur, as: 'tuteurPro' },
      { model: db.tuteur, as: 'tuteurPedago' }
    ]
  });
  console.log(JSON.stringify(stages,null, 2));



  const tuteurs = await db.tuteur.findAll({
    include: db.role
  });
  console.log(JSON.stringify(tuteurs,null, 2));


  const etudiants = await db.etudiant.findAll({
    include: {
      model: db.resultatAnneeEtudiant,
      include: [db.promotion, db.decisionJurys]
    }
  });
  console.log(JSON.stringify(etudiants,null, 2));

  const etudiantsWithCursus = await db.etudiant.findAll({
    include: db.cursus
  });
  console.log(JSON.stringify(etudiantsWithCursus,null, 2));


  const etudiantsWithPartenariat = await db.etudiant.findAll({
    include: {
      model: db.etudiantParticipePartenariat,
      include: [db.naturePartenariat, db.partenaire]
    }
  });
  console.log(JSON.stringify(etudiantsWithPartenariat,null, 2));


  const etudiantsWithAbsence = await db.etudiant.findAll({
    include: db.absence,
    required: true
  });
  console.log(JSON.stringify(etudiantsWithAbsence,null, 2));

  const mobilites = await db.mobilite.findAll({
    include: [
      db.etudiant,
      db.anneeUniversitaire,
      { model: db.etat, as: 'etatContratEtude' },
      { model: db.etat, as: 'etatReleveNote' }
    ]
  });
  console.log(JSON.stringify(mobilites,null, 2));


  const mobilites = await db.mobilite.findAll({
    include: db.typeMobilite
  });
  console.log(JSON.stringify(mobilites,null, 2));*/


  const parcoursEtudiants = await db.parcoursEtudiantParSemestre.findAll({
    include: [db.etudiant, db.parcours, db.semestre, db.anneeUniversitaire]
  });
  console.log(JSON.stringify(parcoursEtudiants,null, 2));

})();
