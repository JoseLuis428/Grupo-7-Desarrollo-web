module.exports = function (sequelize, DataTypes) {
  const Size = sequelize.define('Size', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  }, {
    tableName: 'sizes',
    timestamps: false
  });

  Size.associate = function (models) {
    Size.belongsToMany(models.Product, {
      as: 'products',
      through: 'product_size',
      foreignKey: 'size_id',
      otherKey: 'product_id',
      timestamps: false
    });
  };

  return Size;
};
