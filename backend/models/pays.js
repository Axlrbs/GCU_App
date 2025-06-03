module.exports = function(sequelize, DataTypes) {
  const Pays = sequelize.define('pays', {
    codePays: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true
    },
    nomPays: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pays',
    timestamps: false
  });

  Pays.associate = function(models) {
    Pays.hasMany(models.ville, { foreignKey: 'codePays' });
    Pays.hasMany(models.nationalite, { foreignKey: 'codePays' });
  };

  return Pays;
};
