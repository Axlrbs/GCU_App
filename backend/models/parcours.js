const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Parcours = sequelize.define('parcours', {
    parcoursId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomParcours: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'parcours',
    schema: 'public',
    timestamps: false
  });

  Parcours.associate = function(models) {
    Parcours.hasMany(models.parcoursEtudiantParSemestre, { foreignKey: 'parcoursId' });
  };

  return Parcours;
};
