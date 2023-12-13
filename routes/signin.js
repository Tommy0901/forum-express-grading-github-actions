const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const { passportAuthLocal } = require('../middlewares/auth-handler')

router.get('/', userController.signInPage)
router.post('/', passportAuthLocal, userController.signIn)

module.exports = router
