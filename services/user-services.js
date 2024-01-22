const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')

const { User, Restaurant, Comment, Favorite, Like, Followship } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    const isAdmin = req.user?.isAdmin
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password) throw new Error('Please enter name, email and password!')
    if (password !== passwordCheck) throw new Error('Passwords do not match!');
    (async () => {
      try {
        if (await User.findOne({ where: { email } })) throw new Error('Email already exists!')
        const createdUser = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
        const { password: removedPassword, ...user } = createdUser.toJSON()
        cb(null, { user }, isAdmin)
      } catch (err) {
        cb(err)
      }
    })()
  },
  signIn: (req, cb) => {
    const { id } = req.user;
    (async () => {
      try {
        const userData = await User.findByPk(id, { raw: true })
        const { password, ...user } = userData
        cb(null, { user })
      } catch (err) {
        cb(err)
      }
    })()
  },
  getUser: (req, cb) => {
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
        const { password, ...userData } = user.toJSON()
        const { ...userProfileData } = userData
        userProfileData.commentedRestaurants = userData.Comments
          ?.map(c => c.Restaurant)
          .filter(item => item !== null)
          .filter((item, index, self) => self.findIndex(obj => obj.id === item.id) === index)
        // userProfileData.commentedRestaurants = userData.Comments
        //   ?.reduce((acc, c) => { if (!acc.some(r => r.id === c.restaurantId)) acc.push(c.Restaurant); return acc }, [])
        userProfileData.isFollowed = userData.Followers?.some(f => f.id === req.user.id)
        cb(null, { userProfileData })
      } catch (err) {
        cb(err)
      }
    })()
  },
  editUser: (req, cb) => {
    const { id } = req.params
    if (+id !== req.user?.id) throw new Error('Permission denied!');
    (async () => {
      try {
        const userData = await User.findByPk(id, { raw: true })
        const { password, ...user } = userData
        cb(null, { user })
      } catch (err) {
        cb(err)
      }
    })()
  },
  putUser: (req, cb) => {
    const { file } = req
    const { id } = req.params
    if (+id !== req.user?.id) return cb(null, null, { message: 'Update failed! Insufficient permissions.' })
    const { name } = req.body
    if (!name) throw new Error('Please enter user name.');
    (async () => {
      try {
        const [filePath, userData] = await Promise.all([imgurFileHandler(file), User.findByPk(id)])
        if (!userData) throw new Error("This user didn't exist!")
        const updatedUser = await userData.update({ name, image: filePath || userData.image })
        const { password, ...user } = updatedUser.toJSON()
        cb(null, { user })
      } catch (err) {
        cb(err)
      }
    })()
  },
  addFavorite: (req, cb) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const [restaurant, favoriteData] = await Promise.all([
          Restaurant.findByPk(restaurantId),
          Favorite.findOne({ where: { userId, restaurantId } })
        ])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favoriteData) throw new Error('You have favorited this restaurant!')
        cb(null, { favorite: await Favorite.create({ userId, restaurantId }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  removeFavorite: (req, cb) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const favorite = await Favorite.findOne({ where: { userId, restaurantId } })
        cb(null, favorite ? { favorite: await favorite.destroy() } : null)
      } catch (err) {
        cb(err)
      }
    })()
  },
  addLike: (req, cb) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const [restaurant, likeData] = await Promise.all([
          Restaurant.findByPk(restaurantId),
          Like.findOne({ where: { userId, restaurantId } })
        ])
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (likeData) throw new Error('You have liked this restaurant!')
        cb(null, { like: await Like.create({ userId, restaurantId }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  removeLike: (req, cb) => {
    const { id: userId } = req.user
    const { restaurantId } = req.params;
    (async () => {
      try {
        const like = await Like.findOne({ where: { userId, restaurantId } })
        cb(null, like ? { like: await like.destroy() } : null)
      } catch (err) {
        cb(err)
      }
    })()
  },
  getTopUsers: (req, cb) => {
    (async () => {
      try {
        const users = await User.findAll({
          limit: 24,
          attributes: ['id', 'name', 'image', [sequelize.literal('(SELECT COUNT(`id`) FROM followships WHERE followships.following_id = User.id)'), 'followerCount']],
          order: [['followerCount', 'DESC']],
          raw: true
        })
        cb(null, {
          users: users.map(user => ({
            ...user,
            isFollowed: req.user?.Followings?.some(f => f.id === user.id)
          }))
        })
      } catch (err) {
        cb(err)
      }
    })()
  },
  addFollowing: (req, cb) => {
    const { id: followerId } = req.user
    const { followingId } = req.params;
    (async () => {
      try {
        const [user, followData] = await Promise.all([
          User.findByPk(followingId),
          Followship.findOne({ where: { followerId, followingId } })
        ])
        if (!user) throw new Error("user didn't exist!")
        if (followData) throw new Error('You are already following this user!')
        cb(null, { followship: await Followship.create({ followerId, followingId }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  removeFollowing: (req, cb) => {
    const { id: followerId } = req.user
    const { followingId } = req.params;
    (async () => {
      try {
        const followship = await Followship.findOne({ where: { followerId, followingId } })
        cb(null, followship ? { followship: await followship.destroy() } : null)
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = userServices
