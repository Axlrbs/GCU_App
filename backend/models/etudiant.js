const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Etudiant = sequelize.define('etudiant', {
    numeroEtudiant: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomEtudiant: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prenomEtudiant: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sexe: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mailEtudiant: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    anneeArrivee: {
      type: DataTypes.DATE,
      allowNull: true
    },
    anneeDiplomation: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nbreJetons: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    cursusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cursus',
        key: 'cursusId'
      }
    },
    formationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'formation',
        key: 'formationId'
      }
    },
    estdiplome: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    statutetudiantid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'statutetudiant',
        key: 'statutetudiantid'
      }
    },
    etablissementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'etablissement',
        key: 'etablissementId'
      }
    },
    nationaliteid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'nationalite',
        key: 'nationaliteid'
      }
    }
  }, {
    sequelize,
    tableName: 'etudiant',
    timestamps: false
  });

  Etudiant.associate = function(models) {
    Etudiant.hasMany(models.etablissementorigineformation, { foreignKey: 'numeroEtudiant' });
    Etudiant.belongsTo(models.formation, { foreignKey: 'formationId' });
    Etudiant.hasMany(models.stage, { foreignKey: 'numeroEtudiant' });
    Etudiant.hasMany(models.resultatAnneeEtudiant, { foreignKey: 'numeroEtudiant' });
    Etudiant.belongsTo(models.cursus, { foreignKey: 'cursusId' });
    Etudiant.hasMany(models.etudiantParticipePartenariat, { foreignKey: 'numeroEtudiant' });
    Etudiant.hasMany(models.etudiantPasseCertification, { foreignKey: 'numeroEtudiant' });
    Etudiant.hasMany(models.absence, { foreignKey: 'numeroetudiant' });
    Etudiant.hasMany(models.mobilite, { foreignKey: 'numeroetudiant' });
    Etudiant.hasMany(models.parcoursEtudiantParSemestre, { foreignKey: 'numeroEtudiant' });
    Etudiant.belongsTo(models.statutetudiant, { foreignKey: 'statutetudiantid' });
    Etudiant.belongsTo(models.etablissement, { foreignKey: 'etablissementId' });
    Etudiant.belongsTo(models.nationalite, { foreignKey: 'nationaliteid' });
  };

  return Etudiant;
};