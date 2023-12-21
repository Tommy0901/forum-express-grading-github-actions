const { Restaurant, Category } = require('../models')

const limit = 12

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const { category, id, page } = req.query
    const categoryId = +id
    const currentPage = +page || 1;
    (async () => {
      try {
        const [restaurantsArr, restaurantCounts, categories] = await Promise.all([
          Restaurant.findAll({
            raw: true,
            nest: true,
            include: Category,
            ...categoryId ? { where: { categoryId } } : {},
            limit,
            offset: (currentPage - 1) * limit
          }),
          Restaurant.count(),
          Category.findAll({ raw: true })
        ])
        const restaurants = restaurantsArr.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        const totalPages = Math.ceil(restaurantCounts / limit)
        const pages = Array.from(Array(totalPages), (_, i) => i + 1)
        res.render('restaurants', {
          restaurants,
          categories,
          category,
          pages,
          prev: currentPage - 1 ? currentPage - 1 : currentPage,
          next: currentPage < totalPages ? currentPage + 1 : currentPage,
          currentPage,
          totalPages
        })
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
