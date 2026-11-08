module.exports = function (sequelize, DataTypes) {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    slug: { type: DataTypes.STRING(60), allowNull: false, unique: true }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  Category.associate = function (models) {
    Category.hasMany(models.Product, { as: 'products', foreignKey: 'categoryId' });
  };

  return Category;
};
