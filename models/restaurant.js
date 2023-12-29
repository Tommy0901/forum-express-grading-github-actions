'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.Category) // 省略第2個參數 { foreignKey: 'categoryId' } 的設定時，自動利用關聯對象的 model 名稱(Category) 加上 id 作為預設的 FK
      Restaurant.hasMany(models.Comment) // 省略第2個參數 { foreignKey: 'restaurantId' } 的設定
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'restaurantId',
        as: 'FavoritedUsers'
      })
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    underscored: true
  })
  return Restaurant
}
