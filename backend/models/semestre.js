const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Semestre = sequelize.define('semestre', {
    semestreId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelleSemestre: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'semestre',
    timestamps: false
  });

  Semestre.associate = function(models) {
    Semestre.hasMany(models.parcoursEtudiantParSemestre, { foreignKey: 'semestreId' });
  };

  return Semestre;
};
