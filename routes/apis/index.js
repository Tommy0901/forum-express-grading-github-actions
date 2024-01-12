const express = require('express')
const [router, users, restaurant, restaurants, comments, favorites, likes, following] = Array.from({ length: 8 }, () => express.Router())

const admin = require('./modules/admin')

const restController = require('../../controllers/apis/restaurant-controller')
const commentController = require('../../controllers/apis/comment-controller')
const userController = require('../../controllers/apis/user-controller')

const { api: { authenticated, authenticatedAdmin }, passportAuth } = require('../../middlewares/auth-handler')
const { upload } = require('../../middlewares/multer')

router.post('/signup', userController.signUp)

router.post('/signin', passportAuth('local', { session: false }), userController.signIn)

router.use(authenticated)

router.use('/admin', authenticatedAdmin, admin)

router.use('/users',
  users.get('/top', userController.getTopUsers),
  users.get('/:id/edit', userController.editUser),
  users.get('/:id', userController.getUser),
  users.put('/:id', upload.single('image'), userController.putUser)
)

router.use('/restaurant',
  restaurant.get('/:id/dashboard', restController.getDashboard),
  restaurant.get('/:id', restController.getRestaurant)
)

router.use('/restaurants',
  restaurants.get('/top', restController.getTopRestaurants),
  restaurants.get('/feeds', restController.getFeeds),
  restaurants.get('/', restController.getRestaurants)
)

router.use('/comments',
  comments.post('/:userId', commentController.postComment),
  comments.delete('/:id', commentController.deleteComment)
)

router.use('/favorites',
  favorites.post('/:restaurantId', userController.addFavorite),
  favorites.delete('/:restaurantId', userController.removeFavorite)
)

router.use('/likes',
  likes.post('/:restaurantId', userController.addLike),
  likes.delete('/:restaurantId', userController.removeLike)
)

router.use('/following',
  following.post('/:followingId', userController.addFollowing),
  following.delete('/:followingId', userController.removeFollowing)
)

module.exports = router
