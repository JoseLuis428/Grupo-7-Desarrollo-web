module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    section: { type: DataTypes.ENUM('recomendado', 'vendido'), allowNull: true, defaultValue: null },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'category_id' }
  }, {
    tableName: 'products',
    timestamps: false
  });

  Product.associate = function (models) {
    Product.belongsTo(models.Category, { as: 'category', foreignKey: 'categoryId' });
    Product.belongsToMany(models.Size, {
      as: 'sizes',
      through: 'product_size',
      foreignKey: 'product_id',
      otherKey: 'size_id',
      timestamps: false
    });
  };

  return Product;
};
