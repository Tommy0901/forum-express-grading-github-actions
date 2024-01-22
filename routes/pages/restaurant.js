const express = require('express')
const router = express.Router()

const restController = require('../../controllers/pages/restaurant-controller')

router.get('/:id/dashboard', restController.getDashboard)
router.get('/:id', restController.getRestaurant)

module.exports = router
