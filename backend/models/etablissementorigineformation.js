module.exports = function(sequelize, DataTypes) {
  const EOF = sequelize.define('etablissementorigineformation', {
    formationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'formation',
        key: 'formationId'
      }
    },
    etablissementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'etablissement',
        key: 'etablissementId'
      }
    },
    numeroEtudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    }
  }, {
    tableName: 'etablissementorigineformation',
    timestamps: false
  });

  EOF.associate = function(models) {
    EOF.belongsTo(models.etudiant, { foreignKey: 'numeroEtudiant' });
    EOF.belongsTo(models.formation, { foreignKey: 'formationId' });
    EOF.belongsTo(models.etablissement, { foreignKey: 'etablissementId' });
  };

  return EOF;
};
