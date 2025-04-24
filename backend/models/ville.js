module.exports = function(sequelize, DataTypes) {
  const Ville = sequelize.define('ville', {
    villeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomVille: {
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
    tableName: 'ville',
    schema: 'public',
    timestamps: false
  });

  Ville.associate = function(models) {
    Ville.belongsTo(models.pays, { foreignKey: 'codePays' });
    Ville.hasMany(models.etablissement, { foreignKey: 'villeId' });
    Ville.hasMany(models.entreprise, { foreignKey: 'villeId' });
  };

  return Ville;
};
