module.exports = function(sequelize, DataTypes) {
  const Stage = sequelize.define('stage', {
    stageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dateDebutStage: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateFinStage: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nbreJoursEffectifs: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    entrepriseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entreprise',
        key: 'entrepriseId'
      }
    },
    tuteurProId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tuteur',
        key: 'tuteurId'
      }
    },
    tuteurPedagoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tuteur',
        key: 'tuteurId'
      }
    },
    numeroEtudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    }
  }, {
    sequelize,
    tableName: 'stage',
    schema: 'public',
    timestamps: false
  });

  Stage.associate = function(models) {
    Stage.belongsTo(models.entreprise, { foreignKey: 'entrepriseId' });
    Stage.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    Stage.belongsTo(models.tuteur, { foreignKey: 'tuteurProId', as: 'tuteurPro' });
    Stage.belongsTo(models.tuteur, { foreignKey: 'tuteurPedagoId', as: 'tuteurPedago' });
  };

  return Stage;
};
