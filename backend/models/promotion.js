const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Promotion = sequelize.define('promotion', {
    promotionId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nomPromotion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'promotion',
    schema: 'public',
    timestamps: false
  });

  Promotion.associate = function(models) {
    Promotion.hasMany(models.resultatAnneeEtudiant, { foreignKey: 'promotionId' });
  };

  return Promotion;
};
