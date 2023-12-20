const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    (async () => {
      try {
        const restaurants = Array.from(
          await Restaurant.findAll({
            raw: true,
            nest: true,
            include: Category
          }),
          r => ({ ...r, description: r.description.substring(0, 50) }))
        res.render('restaurants', { restaurants })
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, {
          raw: true,
          nest: true,
          include: Category
        })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant })
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = restaurantController
