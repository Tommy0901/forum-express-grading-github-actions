const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    (async () => {
      try {
        const restaurants = await Restaurant.findAll({ raw: true })
        res.render('admin/restaurants', { restaurants })
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = adminController
