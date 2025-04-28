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
      },
      prenom: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('admin', 'etudes', 'mobilites','stages')
      }
    }, {
      tableName: 'utilisateur',
      timestamps: false
    });
  
    return Utilisateur;
  };
  