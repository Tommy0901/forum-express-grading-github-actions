const express = require('express')
const router = express.Router()

const restController = require('../../controllers/pages/restaurant-controller')

router.get('/:id', restController.getRestaurant)
router.get('/:id/dashboard', restController.getDashboard)

module.exports = router
