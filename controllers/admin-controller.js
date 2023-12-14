const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { file } = req
    const { name, tel, address, openingHours, description } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.');
    (async () => {
      try {
        await Restaurant.create({ name, tel, address, openingHours, description, image: await localFileHandler(file) })
        req.flash('success', 'restaurant was successfully created!')
        res.redirect('/admin/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurants: (req, res, next) => {
    (async () => {
      try {
        const restaurants = await Restaurant.findAll({ raw: true })
        res.render('admin/restaurants', { restaurants })
      } catch (error) {
        next(error)
      }
    })()
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id, { raw: true })
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
        const restaurant = await Restaurant.findByPk(id, { raw: true })
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      } catch (error) {
        next(error)
      }
    })()
  },
  putRestaurant: (req, res, next) => {
    const { file } = req
    const { id } = req.params
    const { name, tel, address, openingHours, description } = req.body
    if (!name || !tel || !address) throw new Error('Restaurant needs name, tel and address.');
    (async () => {
      try {
        const [filePath, restaurant] = await Promise.all([localFileHandler(file), Restaurant.findByPk(id)])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image })
        req.flash('success', 'restaurant was successfully updated!')
        res.redirect('/admin/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const restaurant = await Restaurant.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.destroy()
        req.flash('success', 'restaurant was successfully deleted!')
        res.redirect('/admin/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = adminController
