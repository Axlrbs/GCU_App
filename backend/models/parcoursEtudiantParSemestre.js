const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const PAE = sequelize.define('parcoursEtudiantParSemestre', {
    parcoursetudiantid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    anneeUniversitaireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'anneeUniversitaire',
        key: 'anneeUniversitaireId'
      }
    },
    numeroEtudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    },
    parcoursId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parcours',
        key: 'parcoursId'
      }
    },
    semestreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'semestre',
        key: 'semestreId'
      }
    }
  }, {
    sequelize,
    tableName: 'parcoursEtudiantParSemestre',
    schema: 'public',
    timestamps: false
  });

  PAE.associate = function(models) {
    PAE.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    PAE.belongsTo(models.parcours, { foreignKey: 'parcoursId' });
    PAE.belongsTo(models.semestre, { foreignKey: 'semestreId' });
    PAE.belongsTo(models.anneeUniversitaire, { foreignKey: 'anneeUniversitaireId' });
  };

  return PAE;
};
