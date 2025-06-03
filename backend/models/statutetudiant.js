module.exports = function(sequelize, DataTypes) {
  const StatutEtudiant = sequelize.define('statutetudiant', {
    statutetudiantid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libellestatutetudiant: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'statutetudiant',
    timestamps: false
  });

  StatutEtudiant.associate = function(models) {
    StatutEtudiant.hasMany(models.etudiant, { foreignKey: 'statutetudiantid' });
  };

  return StatutEtudiant;
};
