const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const EPP = sequelize.define('etudiantParticipePartenariat', {
    idParticipation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numeroEtudiant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    },
    naturePartenariatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'naturePartenariat',
        key: 'naturePartenariatId'
      }
    },
    partenaireId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partenaire',
        key: 'partenaireId'
      }
    },
    dateActivite: {
      type: DataTypes.DATE,
      allowNull: true
    },
    commentaireActivite: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nbreJetonsAttribues: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    aParticipe: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'etudiantParticipePartenariat',
    timestamps: false
  });

  EPP.associate = function(models) {
    EPP.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    EPP.belongsTo(models.naturePartenariat, { foreignKey: 'naturePartenariatId' });
    EPP.belongsTo(models.partenaire, { foreignKey: 'partenaireId' });
  };

  return EPP;
};
