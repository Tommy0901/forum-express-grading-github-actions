const adminServices = require('../../services/admin-services')

const adminController = {
  createRestaurant: (req, res, next) => {
    adminServices.createRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editRestaurant: (req, res, next) => {
    adminServices.editRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  registerUser: (req, res, next) => {
    res.json({ status: 'success', message: 'redirect to Add User page' })
  }
}
module.exports = adminController
