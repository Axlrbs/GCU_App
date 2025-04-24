const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Partenaire = sequelize.define('partenaire', {
    partenaireId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomPartenaire: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    secteurPartenaire: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'partenaire',
    schema: 'public',
    timestamps: false
  });

  Partenaire.associate = function(models) {
    Partenaire.hasMany(models.etudiantParticipePartenariat, { foreignKey: 'partenaireId' });
  };

  return Partenaire;
};
