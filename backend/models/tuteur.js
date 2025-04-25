const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Tuteur = sequelize.define('tuteur', {
    tuteurId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomTuteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prenomTuteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mailTuteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telTuteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'roleId'
      }
    }
  }, {
    sequelize,
    tableName: 'tuteur',
    schema: 'public',
    timestamps: false
  });

  Tuteur.associate = function(models) {
    Tuteur.hasMany(models.stage, { foreignKey: 'tuteurProId', as: 'stagesPro' });
    Tuteur.hasMany(models.stage, { foreignKey: 'tuteurPedagoId', as: 'stagesPedago' });
    Tuteur.belongsTo(models.role, { foreignKey: 'roleId' });
  };

  return Tuteur;
  
};
