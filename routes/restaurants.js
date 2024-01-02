const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/feeds', restController.getFeeds)
router.get('/top', restController.getTopRestaurants)
router.get('/', restController.getRestaurants)

module.exports = router
