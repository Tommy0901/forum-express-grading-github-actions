'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'userId' })
      Comment.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
    }
  }
  Comment.init({
    text: DataTypes.STRING,
    // userId: DataTypes.INTEGER, // 於上方 associate 有設定關聯外鍵時可省略
    // restaurantId: DataTypes.INTEGER // 於上方 associate 有設定關聯外鍵時可省略
  }, {
    sequelize,
    modelName: 'Comment',
    underscored: true,
    tableName: 'Comments'
  })
  return Comment
}
