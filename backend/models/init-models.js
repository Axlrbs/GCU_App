var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _absence = require("./absence");
var _anneeUniversitaire = require("./anneeUniversitaire");
var _certificationLangue = require("./certificationLangue");
var _cursus = require("./cursus");
var _decisionJurys = require("./decisionJurys");
var _entreprise = require("./entreprise");
var _etablissement = require("./etablissement");
var _etablissementorigineformation = require("./etablissementorigineformation");
var _etat = require("./etat");
var _etudiant = require("./etudiant");
var _etudiantParticipePartenariat = require("./etudiantParticipePartenariat");
var _etudiantPasseCertification = require("./etudiantPasseCertification");
var _formation = require("./formation");
var _mobilite = require("./mobilite");
var _naturePartenariat = require("./naturePartenariat");
var _parcours = require("./parcours");
var _parcoursEtudiantParSemestre = require("./parcoursEtudiantParSemestre");
var _partenaire = require("./partenaire");
var _pays = require("./pays");
var _promotion = require("./promotion");
var _resultatAnneeEtudiant = require("./resultatAnneeEtudiant");
var _role = require("./role");
var _semestre = require("./semestre");
var _stage = require("./stage");
var _statutetudiant = require("./statutetudiant");
var _tuteur = require("./tuteur");
var _typeMobilite = require("./typeMobilite");
var _ville = require("./ville");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var absence = _absence(sequelize, DataTypes);
  var anneeUniversitaire = _anneeUniversitaire(sequelize, DataTypes);
  var certificationLangue = _certificationLangue(sequelize, DataTypes);
  var cursus = _cursus(sequelize, DataTypes);
  var decisionJurys = _decisionJurys(sequelize, DataTypes);
  var entreprise = _entreprise(sequelize, DataTypes);
  var etablissement = _etablissement(sequelize, DataTypes);
  var etablissementorigineformation = _etablissementorigineformation(sequelize, DataTypes);
  var etat = _etat(sequelize, DataTypes);
  var etudiant = _etudiant(sequelize, DataTypes);
  var etudiantParticipePartenariat = _etudiantParticipePartenariat(sequelize, DataTypes);
  var etudiantPasseCertification = _etudiantPasseCertification(sequelize, DataTypes);
  var formation = _formation(sequelize, DataTypes);
  var mobilite = _mobilite(sequelize, DataTypes);
  var naturePartenariat = _naturePartenariat(sequelize, DataTypes);
  var parcours = _parcours(sequelize, DataTypes);
  var parcoursEtudiantParSemestre = _parcoursEtudiantParSemestre(sequelize, DataTypes);
  var partenaire = _partenaire(sequelize, DataTypes);
  var pays = _pays(sequelize, DataTypes);
  var promotion = _promotion(sequelize, DataTypes);
  var resultatAnneeEtudiant = _resultatAnneeEtudiant(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var semestre = _semestre(sequelize, DataTypes);
  var stage = _stage(sequelize, DataTypes);
  var statutetudiant = _statutetudiant(sequelize, DataTypes);
  var tuteur = _tuteur(sequelize, DataTypes);
  var typeMobilite = _typeMobilite(sequelize, DataTypes);
  var ville = _ville(sequelize, DataTypes);

  mobilite.belongsTo(anneeUniversitaire, { as: "anneeuniversitaire", foreignKey: "anneeuniversitaireid"});
  anneeUniversitaire.hasMany(mobilite, { as: "mobilites", foreignKey: "anneeuniversitaireid"});
  parcoursEtudiantParSemestre.belongsTo(anneeUniversitaire, { as: "anneeUniversitaire", foreignKey: "anneeUniversitaireId"});
  anneeUniversitaire.hasMany(parcoursEtudiantParSemestre, { as: "parcoursEtudiantParSemestres", foreignKey: "anneeUniversitaireId"});
  resultatAnneeEtudiant.belongsTo(anneeUniversitaire, { as: "anneeUniversitaire", foreignKey: "anneeUniversitaireId"});
  anneeUniversitaire.hasMany(resultatAnneeEtudiant, { as: "resultatAnneeEtudiants", foreignKey: "anneeUniversitaireId"});
  etudiantPasseCertification.belongsTo(certificationLangue, { as: "certificationLangue", foreignKey: "certificationLangueId"});
  certificationLangue.hasMany(etudiantPasseCertification, { as: "etudiantPasseCertifications", foreignKey: "certificationLangueId"});
  etudiant.belongsTo(cursus, { as: "cursu", foreignKey: "cursusId"});
  cursus.hasMany(etudiant, { as: "etudiants", foreignKey: "cursusId"});
  resultatAnneeEtudiant.belongsTo(decisionJurys, { as: "codeDecision_decisionJury", foreignKey: "codeDecision"});
  decisionJurys.hasMany(resultatAnneeEtudiant, { as: "resultatAnneeEtudiants", foreignKey: "codeDecision"});
  stage.belongsTo(entreprise, { as: "entreprise", foreignKey: "entrepriseId"});
  entreprise.hasMany(stage, { as: "stages", foreignKey: "entrepriseId"});
  etablissementorigineformation.belongsTo(etablissement, { as: "etablissement", foreignKey: "etablissementId"});
  etablissement.hasMany(etablissementorigineformation, { as: "etablissementorigineformations", foreignKey: "etablissementId"});
  mobilite.belongsTo(etablissement, { as: "etablissement", foreignKey: "etablissementId"});
  etablissement.hasMany(mobilite, { as: "mobilites", foreignKey: "etablissementId"});
  mobilite.belongsTo(etat, { as: "etatcontratetude", foreignKey: "etatcontratetudeid"});
  etat.hasMany(mobilite, { as: "mobilites", foreignKey: "etatcontratetudeid"});
  mobilite.belongsTo(etat, { as: "etatrelevenote", foreignKey: "etatrelevenoteid"});
  etat.hasMany(mobilite, { as: "etatrelevenote_mobilites", foreignKey: "etatrelevenoteid"});
  absence.belongsTo(etudiant, { as: "numeroetudiant_etudiant", foreignKey: "numeroetudiant"});
  etudiant.hasMany(absence, { as: "absences", foreignKey: "numeroetudiant"});
  etablissementorigineformation.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(etablissementorigineformation, { as: "etablissementorigineformations", foreignKey: "numeroEtudiant"});
  etudiantParticipePartenariat.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(etudiantParticipePartenariat, { as: "etudiantParticipePartenariats", foreignKey: "numeroEtudiant"});
  etudiantPasseCertification.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(etudiantPasseCertification, { as: "etudiantPasseCertifications", foreignKey: "numeroEtudiant"});
  mobilite.belongsTo(etudiant, { as: "numeroetudiant_etudiant", foreignKey: "numeroetudiant"});
  etudiant.hasMany(mobilite, { as: "mobilites", foreignKey: "numeroetudiant"});
  parcoursEtudiantParSemestre.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(parcoursEtudiantParSemestre, { as: "parcoursEtudiantParSemestres", foreignKey: "numeroEtudiant"});
  resultatAnneeEtudiant.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(resultatAnneeEtudiant, { as: "resultatAnneeEtudiants", foreignKey: "numeroEtudiant"});
  stage.belongsTo(etudiant, { as: "numeroEtudiant_etudiant", foreignKey: "numeroEtudiant"});
  etudiant.hasMany(stage, { as: "stages", foreignKey: "numeroEtudiant"});
  etablissementorigineformation.belongsTo(formation, { as: "formation", foreignKey: "formationId"});
  formation.hasMany(etablissementorigineformation, { as: "etablissementorigineformations", foreignKey: "formationId"});
  etudiant.belongsTo(formation, { as: "formation", foreignKey: "formationId"});
  formation.hasMany(etudiant, { as: "etudiants", foreignKey: "formationId"});
  etudiantParticipePartenariat.belongsTo(naturePartenariat, { as: "naturePartenariat", foreignKey: "naturePartenariatId"});
  naturePartenariat.hasMany(etudiantParticipePartenariat, { as: "etudiantParticipePartenariats", foreignKey: "naturePartenariatId"});
  parcoursEtudiantParSemestre.belongsTo(parcours, { as: "parcour", foreignKey: "parcoursId"});
  parcours.hasMany(parcoursEtudiantParSemestre, { as: "parcoursEtudiantParSemestres", foreignKey: "parcoursId"});
  etudiantParticipePartenariat.belongsTo(partenaire, { as: "partenaire", foreignKey: "partenaireId"});
  partenaire.hasMany(etudiantParticipePartenariat, { as: "etudiantParticipePartenariats", foreignKey: "partenaireId"});
  ville.belongsTo(pays, { as: "codePays_pay", foreignKey: "codePays"});
  pays.hasMany(ville, { as: "villes", foreignKey: "codePays"});
  resultatAnneeEtudiant.belongsTo(promotion, { as: "promotion", foreignKey: "promotionId"});
  promotion.hasMany(resultatAnneeEtudiant, { as: "resultatAnneeEtudiants", foreignKey: "promotionId"});
  tuteur.belongsTo(role, { as: "role", foreignKey: "roleId"});
  role.hasMany(tuteur, { as: "tuteurs", foreignKey: "roleId"});
  parcoursEtudiantParSemestre.belongsTo(semestre, { as: "semestre", foreignKey: "semestreId"});
  semestre.hasMany(parcoursEtudiantParSemestre, { as: "parcoursEtudiantParSemestres", foreignKey: "semestreId"});
  etudiant.belongsTo(statutetudiant, { as: "statutetudiant", foreignKey: "statutetudiantid"});
  statutetudiant.hasMany(etudiant, { as: "etudiants", foreignKey: "statutetudiantid"});
  stage.belongsTo(tuteur, { as: "tuteurPedago", foreignKey: "tuteurPedagoId"});
  tuteur.hasMany(stage, { as: "stages", foreignKey: "tuteurPedagoId"});
  stage.belongsTo(tuteur, { as: "tuteurPro", foreignKey: "tuteurProId"});
  tuteur.hasMany(stage, { as: "tuteurPro_stages", foreignKey: "tuteurProId"});
  mobilite.belongsTo(typeMobilite, { as: "typeMobilite", foreignKey: "typeMobiliteId"});
  typeMobilite.hasMany(mobilite, { as: "mobilites", foreignKey: "typeMobiliteId"});
  entreprise.belongsTo(ville, { as: "ville", foreignKey: "villeId"});
  ville.hasMany(entreprise, { as: "entreprises", foreignKey: "villeId"});
  etablissement.belongsTo(ville, { as: "ville", foreignKey: "villeId"});
  ville.hasMany(etablissement, { as: "etablissements", foreignKey: "villeId"});

  return {
    SequelizeMeta,
    absence,
    anneeUniversitaire,
    certificationLangue,
    cursus,
    decisionJurys,
    entreprise,
    etablissement,
    etablissementorigineformation,
    etat,
    etudiant,
    etudiantParticipePartenariat,
    etudiantPasseCertification,
    formation,
    mobilite,
    naturePartenariat,
    parcours,
    parcoursEtudiantParSemestre,
    partenaire,
    pays,
    promotion,
    resultatAnneeEtudiant,
    role,
    semestre,
    stage,
    statutetudiant,
    tuteur,
    typeMobilite,
    ville,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
