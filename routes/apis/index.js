const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const restController = require('../../controllers/apis/restaurant-controller')
const commentController = require('../../controllers/apis/comment-controller')
const userController = require('../../controllers/apis/user-controller')

const { api: { authenticated, authenticatedAdmin }, passportAuth } = require('../../middlewares/auth-handler')
const { upload } = require('../../middlewares/multer')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passportAuth('local', { session: false }), userController.signIn)

router.get('/logout', userController.logout)

router.use(authenticated)

router.use('/admin', authenticatedAdmin, admin)

router.get('/users/top', userController.getTopUsers)
router.get('/users/:id/edit', userController.editUser)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', upload.single('image'), userController.putUser)

router.get('/restaurant/:id/dashboard', restController.getDashboard)
router.get('/restaurant/:id', restController.getRestaurant)
router.get('/restaurants/top', restController.getTopRestaurants)
router.get('/restaurants/feeds', restController.getFeeds)
router.get('/restaurants', restController.getRestaurants)

router.post('/comments/:userId', commentController.putCategory)
router.delete('/comments/:id', commentController.deleteCategory)

router.post('/favorites/:restaurantId', userController.addFavorite)
router.delete('/favorites/:restaurantId', userController.removeFavorite)

router.post('/likes/:restaurantId', userController.addLike)
router.delete('/likes/:restaurantId', userController.removeLike)

router.post('/following/:followingId', userController.addFollowing)
router.delete('/following/:followingId', userController.removeFollowing)

module.exports = router
