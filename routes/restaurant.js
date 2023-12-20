const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/:id', restController.getRestaurant)

module.exports = router
