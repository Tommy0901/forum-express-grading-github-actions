const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middlewares/auth-handler')

const root = require('./root')
const admin = require('./modules/admin')
const signUp = require('./signup')
const signIn = require('./signin')
const logOut = require('./logout')
const users = require('./users')
const comments = require('./comments')
const restaurant = require('./restaurant')
const restaurants = require('./restaurants')

router.use('/', root)
router.use('/admin', authenticatedAdmin, admin)
router.use('/signup', signUp)
router.use('/signin', signIn)
router.use('/logout', logOut)
router.use('/users', authenticated, users)
router.use('/comments', authenticated, comments)
router.use('/restaurant', authenticated, restaurant)
router.use('/restaurants', authenticated, restaurants)

module.exports = router
