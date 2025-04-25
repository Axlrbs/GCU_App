module.exports = function(sequelize, DataTypes) {
  const EPC = sequelize.define('etudiantPasseCertification', {
    numeroEtudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    },
    certificationLangueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'certificationLangue',
        key: 'certificationLangueId'
      }
    },
    scoreCertification: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'etudiantPasseCertification',
    schema: 'public',
    timestamps: false
  });

  EPC.associate = function(models) {
    EPC.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    EPC.belongsTo(models.certificationLangue, { foreignKey: 'certificationLangueId' });
  };

  return EPC;
};
