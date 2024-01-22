const express = require('express')
const router = express.Router()

const userController = require('../../controllers/pages/user-controller')

router.get('/', userController.logout)

module.exports = router
