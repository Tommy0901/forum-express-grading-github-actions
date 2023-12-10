const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller') // 新增，載入 controller
const userController = require('../controllers/user-controller') // 新增，載入 controller

const { generalErrorHandler } = require('../middlewares/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
