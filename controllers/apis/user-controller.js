const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.json({ status: 'success', message: 'render signup page' })
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signInPage: (req, res) => {
    res.json({ status: 'success', message: 'render signin page' })
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  logout: (req, res) => {
    res.json({ status: 'success', message: '使用者請求登出!' })
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data, message) => {
      if (err) return next(err)
      data ? res.json({ status: 'success', data }) : res.json({ status: 'error', ...message })
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      if (err) return next(err)
      data ? res.json({ status: 'success', data }) : res.json({ status: 'error', message: "You haven't favorited this restaurant!" })
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => {
      if (err) return next(err)
      data ? res.json({ status: 'success', data }) : res.json({ status: 'error', message: "You haven't liked this restaurant!" })
    })
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => {
      if (err) return next(err)
      data ? res.json({ status: 'success', data }) : res.json({ status: 'error', message: "You haven't followed this user!" })
    })
  }
}
module.exports = userController
