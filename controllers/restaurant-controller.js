const { User, Restaurant, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const DEFAULT_LIMIT = 9

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const { name } = req.query
    const page = +req.query.page || 1
    const limit = +req.query.limit || DEFAULT_LIMIT
    const offset = getOffset(limit, page);
    (async () => {
      try {
        const [restObject, categories] = await Promise.all([
          Restaurant.findAndCountAll({
            raw: true,
            nest: true,
            include: { model: Category, ...name ? { where: { name } } : {} },
            limit,
            offset
          }),
          Category.findAll({ raw: true })
        ])
        const restaurants = restObject.rows.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        res.render('restaurants', { restaurants, categories, name, ...getPagination(limit, page, restObject.count) })
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, { include: [Category, { model: Comment, include: User }] }) // 接著操作 Sequelize 語法，不加 { raw: true, nest: true }
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
