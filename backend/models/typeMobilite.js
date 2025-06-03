const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const TypeMobilite =  sequelize.define('typeMobilite', {
    typeMobiliteId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelleTypeMobilite: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'typeMobilite',
    timestamps: false
  });

  TypeMobilite.associate = function(models) {
    TypeMobilite.hasMany(models.mobilite, { foreignKey: 'typeMobiliteId' });
  };

  return TypeMobilite;
};
