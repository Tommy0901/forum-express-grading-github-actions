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
      Comment.belongsTo(models.User) // 省略第2個參數 { foreignKey: 'userId' } 的設定
      Comment.belongsTo(models.Restaurant) // 省略第2個參數 { foreignKey: 'restaurantId' } 的設定
    }
  }
  Comment.init({
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER, // 修改這裡
    restaurantId: DataTypes.INTEGER // 修改這裡
  }, {
    sequelize,
    modelName: 'Comment',
    underscored: true,
    tableName: 'Comments'
  })
  return Comment
}
