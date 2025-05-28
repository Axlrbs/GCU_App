const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Nationalite = sequelize.define('nationalite', {
    nationaliteid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libellenationalite: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    codePays: {
        type: DataTypes.STRING(3),
        allowNull: false,
        references: {
          model: 'pays',
          key: 'codePays'
        }
      }
  }, {
    sequelize,
    tableName: 'nationalite',
    schema: 'public',
    timestamps: false
  });

  Nationalite.associate = function(models) {
    Nationalite.belongsTo(models.pays, { foreignKey: 'codePays' });
    Nationalite.hasMany(models.etudiant, { foreignKey: 'nationaliteid' });
  };
  
  return Nationalite;

};
