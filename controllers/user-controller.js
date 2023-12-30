const bcrypt = require('bcryptjs')

const { User, Restaurant, Favorite, Like } = require('../models')

const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const isAdmin = req.user?.isAdmin
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password) throw new Error('Please enter name, email and password!')

    if (password !== passwordCheck) throw new Error('Passwords do not match!');

    (async () => {
      try {
        if (await User.findOne({ where: { email } })) throw new Error('Email already exists!')
        await User.create({ name, email, password: await bcrypt.hash(password, 10) })
        req.flash('success', '註冊成功!')
        res.redirect(isAdmin ? '/admin/users' : '/signin')
      } catch (error) {
        next(error)
      }
    })()
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    const { id } = req.user;
    (async () => {
      try {
        const user = await User.findByPk(id, { raw: true })
        req.flash('success', '登入成功!')
        res.redirect(user.isAdmin ? '/admin/restaurants' : '/restaurants')
      } catch (error) {
        next(error)
      }
    })()
  },
  logout: (req, res) => {
    req.logout(error => {
      if (error) throw new Error('Logout failed. Please try again!')
      else req.flash('success', '登出成功!')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const userProfileData = await User.findByPk(id, { raw: true })
        res.render('users/profile', { userProfileData })
      } catch (error) {
        next(error)
      }
    })()
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    if (+id !== req.user.id) throw new Error('Permission denied!');
    (async () => {
      try {
        const user = await User.findByPk(id, { raw: true })
        res.render('users/edit', { user })
      } catch (error) {
        next(error)
      }
    })()
  },
  putUser: (req, res, next) => {
    const { file } = req
    const { id } = req.params
    if (+id !== req.user.id) {
      req.flash('error', 'Update failed! Insufficient permissions.')
      return res.redirect(`/users/${id}`)
    }
    const { name } = req.body
    if (!name) throw new Error('Please enter user name.');
    (async () => {
      try {
        const [filePath, user] = await Promise.all([localFileHandler(file), User.findByPk(id)])
        if (!user) throw new Error("The user didn't exist!")
        await user.update({ name, image: filePath || user.image })
        req.flash('success', 'user profile was successfully updated!')
        res.redirect(`/users/${id}`)
      } catch (error) {
        next(error)
      }
    })()
  },
  addFavorite: (req, res, next) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const [restaurant, favorite] = await Promise.all([
          Restaurant.findByPk(restaurantId),
          Favorite.findOne({ where: { userId, restaurantId } })
        ])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        await Favorite.create({ userId, restaurantId })
        req.flash('success', 'this restaurant has been successfully bookmarked!')
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  },
  removeFavorite: (req, res, next) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        await Favorite.destroy({ where: { userId, restaurantId } })
          ? req.flash('success', 'this restaurant has been successfully removed from bookmarks!')
          : req.flash('error', "You haven't favorited this restaurant!")
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  },
  addLike: (req, res, next) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const [restaurant, like] = await Promise.all([
          Restaurant.findByPk(restaurantId),
          Like.findOne({ where: { userId, restaurantId } })
        ])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        await Like.create({ userId, restaurantId })
        req.flash('success', 'this restaurant has been successfully liked!')
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  },
  removeLike: (req, res, next) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        await Like.destroy({ where: { userId, restaurantId } })
          ? req.flash('success', 'this restaurant has been successfully unliked!')
          : req.flash('error', "You haven't liked this restaurant!")
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = userController
