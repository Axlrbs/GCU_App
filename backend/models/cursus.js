const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Cursus = sequelize.define('cursus', {
    cursusId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cursusLibelle: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cursus',
    schema: 'public',
    timestamps: false
  });

  Cursus.associate = function(models) {
    Cursus.hasMany(models.etudiant, { foreignKey: 'cursusId' });
  };

  return Cursus;
};
