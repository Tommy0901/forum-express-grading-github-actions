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
  }
}
module.exports = adminServices
