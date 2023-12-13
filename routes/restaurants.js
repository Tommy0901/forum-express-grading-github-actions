const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/', restController.getRestaurants)

module.exports = router
