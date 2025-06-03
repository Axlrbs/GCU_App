const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const AnneeUniversitaire = sequelize.define('anneeUniversitaire', {
    anneeUniversitaireId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelleAnneeUniversitaire: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateFin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'anneeUniversitaire',
    timestamps: false
  });

  AnneeUniversitaire.associate = function(models) {
    AnneeUniversitaire.hasMany(models.mobilite, { foreignKey: 'anneeuniversitaireid' });
    AnneeUniversitaire.hasMany(models.parcoursEtudiantParSemestre, { foreignKey: 'anneeUniversitaireId' });
    AnneeUniversitaire.hasMany(models.resultatAnneeEtudiant, { foreignKey: 'anneeUniversitaireId' });
    AnneeUniversitaire.hasMany(models.stage, { foreignKey: 'anneeUniversitaireId' });
    AnneeUniversitaire.hasMany(models.absence, { foreignKey: 'anneeUniversitaireId' });
  };
  

  return AnneeUniversitaire;
}; 