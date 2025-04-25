module.exports = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('utilisateur', {
      utilisateurId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'gestionnaire', 'lecteur'),
        defaultValue: 'lecteur'
      }
    }, {
      tableName: 'utilisateur',
      timestamps: false
    });
  
    return Utilisateur;
  };
  