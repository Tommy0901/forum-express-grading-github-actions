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
        const favoritedRestaurantsId = req.user.FavoritedRestaurants?.map(fr => fr.id)
        const likedRestaurantsId = req.user.LikedRestaurants?.map(lr => lr.id)
        const restaurants = restObject.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        res.render('restaurants', { restaurants, categories, name, ...getPagination(limit, page, restObject.count) })
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurant: (req, res, next) => {
    return (async () => {
      try {
        const restaurant = await Restaurant.findByPk(req.params.id, {
          include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }],
          order: [[Comment, 'createdAt', 'DESC']]
        }) // 接著操作 Sequelize 語法，不加 { raw: true, nest: true } ，另外 { raw: true } 本身也會破壞一對多的條件
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.increment('viewCount') // 幫 viewCount 欄位 + 1 ，改變第二個參數預設 { by: 1 } 可調整間距
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited: restaurant.FavoritedUsers.some(fu => fu.id === req.user.id),
          isLiked: req.user.LikedRestaurants?.some(lr => lr.id === +req.params.id)
        })
      } catch (error) {
        next(error)
      }
    })()
  },
  getDashboard: (req, res, next) => {
    return (async () => {
      try {
        const restaurant = await Restaurant.findByPk(req.params.id, {
          include: [Category, Comment, { model: User, as: 'FavoritedUsers' }]
        })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      } catch (error) {
        next(error)
      }
    })()
  },
  getFeeds: (req, res, next) => {
    const { name } = req.query;
    (async () => {
      try {
        const category = name ? await Category.findOne({ where: { name } }) : undefined
        const categoryId = category?.id
        const [restaurantsArr, comments, categories] = await Promise.all([
          Restaurant.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: { model: Category, ...name ? { where: { name } } : {} },
            raw: true,
            nest: true
          }),
          Comment.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{ model: Restaurant, include: Category, ...categoryId ? { where: { categoryId } } : {} }, User],
            raw: true,
            nest: true
          }),
          Category.findAll({
            raw: true
          })
        ])
        const restaurants = restaurantsArr.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        res.render('feeds', { restaurants, comments, categories })
      } catch (error) {
        next(error)
      }
    })()
  },
  getTopRestaurants: (req, res, next) => {
    return (async () => {
      try {
        const restaurantsArr = await Restaurant.findAll({ include: { model: User, as: 'FavoritedUsers' } })
        const restaurants = restaurantsArr
          .map(r => ({
            ...r.toJSON(),
            description: r.description.substring(0, 50),
            favoritedCount: r.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants.map(fr => fr.id).includes(r.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants })
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = restaurantController
