const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const NaturePartenariat = sequelize.define('naturePartenariat', {
    naturePartenariatId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelleNaturePartenariat: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'naturePartenariat',
    timestamps: false
  });

  NaturePartenariat.associate = function(models) {
    NaturePartenariat.hasMany(models.etudiantParticipePartenariat, { foreignKey: 'naturePartenariatId' });
  };

  return NaturePartenariat;
};
