const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const RAE = sequelize.define('resultatAnneeEtudiant', {
    resultatId: {
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
    promotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'promotion',
        key: 'promotionId'
      }
    },
    codeDecision: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'decisionJurys',
        key: 'codeDecision'
      }
    },
    dateDecisionJurys: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'resultatAnneeEtudiant',
    schema: 'public',
    timestamps: false
  });

  RAE.associate = function(models) {
    RAE.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    RAE.belongsTo(models.promotion, { foreignKey: 'promotionId' });
    RAE.belongsTo(models.decisionJurys, { foreignKey: 'codeDecision' });
    RAE.belongsTo(models.anneeUniversitaire, { foreignKey: 'anneeUniversitaireId' });

  };
  
  return RAE;
};
