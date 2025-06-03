const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Decision = sequelize.define('decisionJurys', {
    codeDecision: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    libelleDecision: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'decisionJurys',
    timestamps: false
  });

  Decision.associate = function(models) {
    Decision.hasMany(models.resultatAnneeEtudiant, { foreignKey: 'codeDecision' });
  };

  return Decision;
};
