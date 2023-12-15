const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middlewares/auth-handler')

const root = require('./root')
const admin = require('./modules/admin')
const signUp = require('./signup')
const signIn = require('./signin')
const logOut = require('./logout')
const restaurants = require('./restaurants')

router.use('/', root)
router.use('/admin', authenticatedAdmin, admin)
router.use('/signup', signUp)
router.use('/signin', signIn)
router.use('/logout', logOut)
router.use('/restaurants', authenticated, restaurants)

module.exports = router
