module.exports = function(sequelize, DataTypes) {
  const Entreprise = sequelize.define('entreprise', {
    entrepriseId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    raisonSociale: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contactEntreprise: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    villeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ville',
        key: 'villeId'
      }
    }
  }, {
    sequelize,
    tableName: 'entreprise',
    timestamps: false
  });

  Entreprise.associate = function(models) {
    Entreprise.belongsTo(models.ville, { foreignKey: 'villeId' });
    Entreprise.hasMany(models.stage, { foreignKey: 'entrepriseId' });
    Entreprise.hasMany(models.mobilite, { foreignKey: 'entrepriseId' });
  };

  return Entreprise;
};
