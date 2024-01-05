const adminServices = require('../../services/admin-services')
const { Restaurant, User, Category } = require('../../models')
const { localFileHandler } = require('../../helpers/file-helpers')

const adminController = {
  createRestaurant: (req, res, next) => {
    (async () => {
      try {
        const categories = await Category.findAll({ raw: true })
        res.render('admin/create-restaurant', { categories })
      } catch (error) {
        next(error)
      }
    })()
  },
  postRestaurant: (req, res, next) => {
    const { file } = req
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.');
    (async () => {
      try {
        await Restaurant.create({ name, tel, address, openingHours, description, image: await localFileHandler(file), categoryId })
        req.flash('success', 'restaurant was successfully created!')
        res.redirect('/admin/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, {
          raw: true,
          nest: true,
          include: [Category]
        })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      } catch (error) {
        next(error)
      }
    })()
  },
  editRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const [restaurant, categories] = await Promise.all([Restaurant.findByPk(id, { raw: true }), Category.findAll({ raw: true })])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      } catch (error) {
        next(error)
      }
    })()
  },
  putRestaurant: (req, res, next) => {
    const { file } = req
    const { id } = req.params
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.');
    (async () => {
      try {
        const [filePath, restaurant] = await Promise.all([localFileHandler(file), Restaurant.findByPk(id)])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image, categoryId })
        req.flash('success', 'restaurant was successfully updated!')
        res.redirect('/admin/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res, next) => {
    (async () => {
      try {
        const users = await User.findAll({ raw: true })
        res.render('admin/users', { users })
      } catch (error) {
        next(error)
      }
    })()
  },
  patchUser: (req, res, next) => {
    const { id } = req.params
    const { isAdmin } = req.body;
    (async () => {
      try {
        const user = await User.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!user) throw new Error("user didn't exist!")
        await user.update({ isAdmin })
        req.flash('success', "user's role was successfully updated!")
        res.redirect('/admin/users')
      } catch (error) {
        next(error)
      }
    })()
  },
  registerUser: (req, res) => {
    res.render('admin/enroll-user')
  }
}
module.exports = adminController
