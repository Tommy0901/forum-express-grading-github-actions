const bcrypt = require('bcryptjs')

const { User, Restaurant, Comment, Favorite, Like, Followship } = require('../models')

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
        const user = await User.findByPk(id, {
          include: [
            { model: Comment, include: Restaurant },
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' }
          ]
        })
        user.dataValues.commentedRestaurants = user.toJSON().Comments
          ?.map(c => c.Restaurant).filter((item, index, self) => self.findIndex(obj => obj.id === item.id) === index)
        // user.dataValues.commentedRestaurants = user.toJSON().Comments
        //   ?.reduce((acc, c) => { if (!acc.some(r => r.id === c.restaurantId)) acc.push(c.Restaurant); return acc }, [])
        user.dataValues.isFollowed = user.toJSON().Followers?.some(f => f.id === req.user.id)
        res.render('users/profile', { userProfileData: user.toJSON() })
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
  },
  getTopUsers: (req, res, next) => {
    (async () => {
      try {
        const userDataArr = await User.findAll({ include: { model: User, as: 'Followers' } })
        const users = userDataArr
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings?.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users })
      } catch (error) {
        next(error)
      }
    })()
  },
  addFollowing: (req, res, next) => {
    const { id: followerId } = req.user
    const { followingId } = req.params;
    (async () => {
      try {
        const [user, follow] = await Promise.all([
          User.findByPk(followingId),
          Followship.findOne({ where: { followerId, followingId } })
        ])
        if (!user) throw new Error("user didn't exist!")
        if (follow) throw new Error('You are already following this user!')
        await Followship.create({ followerId, followingId })
        req.flash('success', 'this user has been successfully followed!')
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  },
  removeFollowing: (req, res, next) => {
    const { id: followerId } = req.user
    const { followingId } = req.params;
    (async () => {
      try {
        await Followship.destroy({ where: { followerId, followingId } })
          ? req.flash('success', 'this user has been successfully unfollowed!')
          : req.flash('error', "You haven't followed this user!")
        res.redirect('back')
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = userController
