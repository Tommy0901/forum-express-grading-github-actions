const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
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
            order: [['id', 'DESC']],
            include: { model: Category, ...name ? { where: { name } } : {} },
            limit,
            offset
          }),
          Category.findAll({ raw: true })
        ])
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants?.map(fr => fr.id) || []
        const likedRestaurantsId = req.user?.LikedRestaurants?.map(lr => lr.id) || []
        const restaurants = restObject.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        cb(null, {
          restaurants,
          categories,
          name,
          ...getPagination(limit, page, restObject.count)
        })
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = restaurantServices
