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
    const { id } = req.params
    return (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, { include: Category }) // 接著操作 Sequelize 語法，不加 { raw: true, nest: true }
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.increment('viewCount')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      } catch (error) {
        next(error)
      }
    })()
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, {
          raw: true,
          nest: true,
          include: Category
        })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = restaurantController
