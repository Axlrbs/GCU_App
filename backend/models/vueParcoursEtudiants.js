module.exports = (sequelize, DataTypes) => {
    return sequelize.define('vue_parcours_etudiants', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true // ✅ indispensable avec Sequelize
      },
      libelleAnneeUniversitaire: DataTypes.STRING,
      nomEtudiant: DataTypes.STRING,
      prenomEtudiant: DataTypes.STRING,
      cursusLibelle: DataTypes.STRING,
      nomPromotion: DataTypes.STRING,
      libelleSemestre: DataTypes.STRING,
      nomParcours: DataTypes.STRING
    }, {
      tableName: 'vue_parcours_etudiants',
      timestamps: false
    });
  };
  