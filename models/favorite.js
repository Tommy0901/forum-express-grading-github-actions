'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Favorite.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
    }
  }
  Favorite.init({
    userId: DataTypes.INTEGER,
    // restaurantId: DataTypes.INTEGER // 於上方 associate 有設定關聯外鍵時可省略
  }, {
    sequelize,
    modelName: 'Favorite',
    underscored: true,
    tableName: 'Favorites'
  })
  return Favorite
}
