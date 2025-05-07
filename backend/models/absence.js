const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Absence = sequelize.define('absence', {
    absenceId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dateDebutAbsence: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateFinAbsence: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ecOuActivite: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    raisonAbsence: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    numeroetudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'etudiant',
        key: 'numeroEtudiant'
      }
    },
    anneeUniversitaireId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'anneeUniversitaire',
        key: 'anneeUniversitaireId'
      }
    },
    estjustifiee: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'absence',
    schema: 'public',
    timestamps: false
  });

  Absence.associate = function(models) {
    Absence.belongsTo(models.etudiant, { foreignKey: 'numeroetudiant' });
    Absence.belongsTo(models.anneeUniversitaire, { foreignKey: 'anneeUniversitaireId' });
  };
  
  return Absence;

};
