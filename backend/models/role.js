module.exports = function(sequelize, DataTypes) {
  const Role = sequelize.define('role', {
    roleId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleLibelle: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'role',
    schema: 'public',
    timestamps: false
  });

  Role.associate = function(models) {
    Role.hasMany(models.tuteur, { foreignKey: 'roleId' });
  };

  return Role;
};
