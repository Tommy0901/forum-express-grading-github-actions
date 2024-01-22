const { User, Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  createRestaurant: (req, cb) => {
    (async () => {
      try {
        cb(null, { categories: await Category.findAll({ raw: true }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  postRestaurant: (req, cb) => {
    const { file } = req
    const { name, tel, address, openingHours, description, image, categoryId } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.')
    if (!categoryId) throw new Error('Plaese select one category.');
    (async () => {
      try {
        cb(null, {
          restaurant: await Restaurant.create(
            { name, tel, address, openingHours, description, ...image ? { image } : { image: await imgurFileHandler(file) }, categoryId }
          )
        })
      } catch (error) {
        cb(error)
      }
    })()
  },
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
  getRestaurant: (req, cb) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, {
          raw: true,
          nest: true,
          include: [Category]
        })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, { restaurant })
      } catch (err) {
        cb(err)
      }
    })()
  },
  editRestaurant: (req, cb) => {
    const { id } = req.params;
    (async () => {
      try {
        const [restaurant, categories] = await Promise.all([Restaurant.findByPk(id, { raw: true }), Category.findAll({ raw: true })])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, { restaurant, categories })
      } catch (err) {
        cb(err)
      }
    })()
  },
  putRestaurant: (req, cb) => {
    const { file } = req
    const { id } = req.params
    const { name, tel, address, openingHours, description, image, categoryId } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.')
    if (!categoryId) throw new Error('Plaese select one category.');
    (async () => {
      try {
        const [filePath, restaurant] = await Promise.all([imgurFileHandler(file), Restaurant.findByPk(id)])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, {
          restaurant: await restaurant.update(
            { name, tel, address, openingHours, description, ...image ? { image } : { image: filePath || restaurant.image }, categoryId }
          )
        })
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
        cb(null, { restaurant: await restaurant.destroy() })
      } catch (err) {
        cb(err)
      }
    })()
  },
  getUsers: (req, cb) => {
    (async () => {
      try {
        cb(null, { users: await User.findAll({ raw: true }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  patchUser: (req, cb, next) => {
    const { id } = req.params
    const { isAdmin } = req.body;
    (async () => {
      try {
        const userData = await User.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!userData) throw new Error("user didn't exist!")
        if (userData.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        const updatedData = await userData.update({ isAdmin })
        const { password, ...user } = updatedData.toJSON()
        cb(null, { user })
      } catch (error) {
        cb(error)
      }
    })()
  }
}
module.exports = adminServices
