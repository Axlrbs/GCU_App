const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Etat = sequelize.define('etat', {
    etatId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelleEtat: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'etat',
    timestamps: false
  });

  Etat.associate = function(models) {
    Etat.hasMany(models.mobilite, { foreignKey: 'etatcontratetudeid', as: 'mobilitesContratEtude' });
    Etat.hasMany(models.mobilite, { foreignKey: 'etatrelevenoteid', as: 'mobilitesReleveNote' });
  };

  return Etat;
};
