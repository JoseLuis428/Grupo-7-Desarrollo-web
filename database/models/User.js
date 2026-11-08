module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(60), allowNull: false },
    lastName: { type: DataTypes.STRING(80), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    photo: { type: DataTypes.STRING(120), allowNull: true, defaultValue: null },
    category: { type: DataTypes.ENUM('admin', 'customer'), allowNull: false, defaultValue: 'customer' }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: false
  });

  return User;
};
