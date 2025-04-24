const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Formation = sequelize.define('formation', {
    formationId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    typeFormation: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'formation',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "formation_pkey",
        unique: true,
        fields: [
          { name: "formationId" },
        ]
      },
    ]
  });

  Formation.associate = function(models) {
    Formation.hasMany(models.etablissementorigineformation, { foreignKey: 'formationId' });
    Formation.hasMany(models.etudiant, { foreignKey: 'formationId' });
  };

  return Formation;
};
