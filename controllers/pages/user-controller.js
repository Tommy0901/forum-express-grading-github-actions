const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data, isAdmin) => {
      if (err) return next(err)
      req.flash('success', '註冊成功!')
      req.session.createdData = data
      res.redirect(isAdmin ? '/admin/users' : '/signin')
    })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => {
      if (err) return next(err)
      req.flash('success', '登入成功!')
      res.redirect(data.user.isAdmin ? '/admin/restaurants' : '/restaurants')
    })
  },
  logout: (req, res) => {
    req.logout(error => {
      if (error) throw new Error('Logout failed. Please try again!')
      req.flash('success', '登出成功!')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.render('users/edit', data))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    userServices.putUser(req, (err, data) => {
      if (err) return next(err)
      if (!data) {
        req.flash('error', 'Update failed! Insufficient permissions.')
        res.redirect('back')
      }
      req.flash('success', 'user profile was successfully updated!')
      req.session.updatedData = data
      res.redirect(`/users/${id}`)
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => {
      if (err) return next(err)
      req.flash('success', 'this restaurant has been successfully bookmarked!')
      req.session.createdData = data
      res.redirect('back')
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      if (err) return next(err)
      if (!data) {
        req.flash('error', "You haven't favorited this restaurant!")
        res.redirect('back')
      }
      req.flash('success', 'this restaurant has been successfully removed from bookmarks!')
      req.session.deletedData = data
      res.redirect('back')
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => {
      if (err) return next(err)
      req.flash('success', 'this restaurant has been successfully liked!')
      req.session.createdData = data
      res.redirect('back')
    })
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => {
      if (err) return next(err)
      if (!data) {
        req.flash('error', "You haven't liked this restaurant!")
        res.redirect('back')
      }
      req.flash('success', 'this restaurant has been successfully unliked!')
      req.session.deletedData = data
      res.redirect('back')
    })
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.render('top-users', data))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, data) => {
      if (err) return next(err)
      req.flash('success', 'this user has been successfully followed!')
      req.session.createdData = data
      res.redirect('back')
    })
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => {
      if (err) return next(err)
      if (!data) {
        req.flash('error', "You haven't followed this user!")
        res.redirect('back')
      }
      req.flash('success', 'this user has been successfully unfollowed!')
      req.session.deletedData = data
      res.redirect('back')
    })
  }
}
module.exports = userController
