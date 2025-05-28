module.exports = function(sequelize, DataTypes) {
  const Etablissement = sequelize.define('etablissement', {
    etablissementId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomEtablissement: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contactEtablissement: {
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
    tableName: 'etablissement',
    schema: 'public',
    timestamps: false
  });

  Etablissement.associate = function(models) {
    Etablissement.belongsTo(models.ville, { foreignKey: 'villeId' });
    Etablissement.hasMany(models.etablissementorigineformation, { foreignKey: 'etablissementId' });
    Etablissement.hasMany(models.mobilite, { foreignKey: 'etablissementId' });
    Etablissement.hasMany(models.etudiant, { foreignKey: 'etablissementId' });
    Etablissement.hasMany(models.laboratoire, { foreignKey: 'etablissementId' });
  };

  return Etablissement;
};
