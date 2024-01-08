const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  postRestaurant: (req, cb) => {
    const { file } = req
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.');
    (async () => {
      try {
        cb(null, {
          restaurant: await Restaurant.create(
            { name, tel, address, openingHours, description, image: await imgurFileHandler(file), categoryId }
          )
        })
      } catch (error) {
        cb(error)
      }
    })()
  },
  getRestaurants: (req, cb) => {
    (async () => {
      try {
        const restaurants = await Restaurant.findAll({
          raw: true,
          nest: true,
          include: [Category]
        })
        cb(null, { restaurants })
      } catch (err) {
        cb(err)
      }
    })()
  },
  deleteRestaurant: (req, cb) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        cb(null, { restaurant: await restaurant.destroy() })
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = adminServices
