const express = require('express')
const router = express.Router()

const userController = require('../../controllers/pages/user-controller')
const { passportAuth } = require('../../middlewares/auth-handler')

router.get('/', userController.signInPage)
router.post('/', passportAuth('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

module.exports = router
