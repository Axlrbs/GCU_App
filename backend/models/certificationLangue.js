const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const CertificationLangue = sequelize.define('certificationLangue', {
    certificationLangueId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    intituleCertificationLangue: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'certificationLangue',
    schema: 'public',
    timestamps: false
  });

  CertificationLangue.associate = function(models) {
    CertificationLangue.hasMany(models.etudiantPasseCertification, { foreignKey: 'certificationLangueId' });
  };

  
  return CertificationLangue;
};
