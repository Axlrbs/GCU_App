const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Mobilite = sequelize.define('mobilite', {
    mobiliteId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dureeMobilite: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    typeMobiliteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'typeMobilite',
        key: 'typeMobiliteId'
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
    numeroetudiant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    },
    anneeuniversitaireid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'anneeUniversitaire',
        key: 'anneeUniversitaireId'
      }
    },
    etatcontratetudeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'etat',
        key: 'etatId'
      }
    },
    dateeffetcontrat: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    etatrelevenoteid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'etat',
        key: 'etatId'
      }
    },
    dateeffetreleve: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nbrecreditects: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    laboratoireid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'laboratoire',
        key: 'laboratoireid'
      }
    },
    remarque: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entrepriseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entreprise',
        key: 'entrepriseId'
      }
    }
  }, {
    sequelize,
    tableName: 'mobilite',
    schema: 'public',
    timestamps: false
  });

  Mobilite.associate = function(models) {
    Mobilite.belongsTo(models.etudiant, { foreignKey: 'numeroetudiant' });
    Mobilite.belongsTo(models.anneeUniversitaire, { foreignKey: 'anneeuniversitaireid' });
    Mobilite.belongsTo(models.etat, { foreignKey: 'etatcontratetudeid', as: 'etatContratEtude' });
    Mobilite.belongsTo(models.etat, { foreignKey: 'etatrelevenoteid', as: 'etatReleveNote' });
    Mobilite.belongsTo(models.typeMobilite, { foreignKey: 'typeMobiliteId' });
    Mobilite.belongsTo(models.etablissement, { foreignKey: 'etablissementId' });
    Mobilite.belongsTo(models.laboratoire, { foreignKey: 'laboratoireid' });
    Mobilite.belongsTo(models.entreprise, { foreignKey: 'entrepriseId' });
  };

  return Mobilite;
};
