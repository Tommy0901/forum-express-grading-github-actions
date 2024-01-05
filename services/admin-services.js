const { Restaurant, Category } = require('../models')

const adminServices = {
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
        const deletedRestaurant = await restaurant.destroy()
        req.flash('success', 'restaurant was successfully deleted!')
        cb(null, { deletedRestaurant })
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = adminServices
