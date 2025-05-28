module.exports = function(sequelize, DataTypes) {
    const Laboratoire = sequelize.define('laboratoire', {
      laboratoireid: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      nomlaboratoire: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      etablissementId: {    
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'etablissement',
          key: 'etablissementId'
        }
      }
    }, {
      sequelize,
      tableName: 'laboratoire',
      schema: 'public',
      timestamps: false
    });
  
    Laboratoire.associate = function(models) {
      Laboratoire.belongsTo(models.etablissement, { foreignKey: 'etablissementId' });
      Laboratoire.hasMany(models.mobilite, { foreignKey: 'laboratoireid' }); 
    };
  
    return Laboratoire;
  };
  