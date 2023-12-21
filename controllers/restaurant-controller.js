const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const { category, id } = req.query
    const categoryId = parseInt(id);
    (async () => {
      try {
        const [restaurantsArr, categories] = await Promise.all([
          Restaurant.findAll({ raw: true, nest: true, include: Category, ...categoryId ? { where: { categoryId } } : {} }),
          Category.findAll({ raw: true })
        ])
        const restaurants = restaurantsArr.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        res.render('restaurants', { restaurants, categories, category })
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
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
    const { id } = req.params;
    (async () => {
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
