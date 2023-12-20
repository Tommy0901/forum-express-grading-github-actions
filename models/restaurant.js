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
      Restaurant.belongsTo(models.Category, {
        foreignKey: 'categoryId' // 此參數可以省略，因為未設定時，會利用關聯對象的 model 名稱(category) 加上 id 作為 FK
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
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    underscored: true
  })
  return Restaurant
}
