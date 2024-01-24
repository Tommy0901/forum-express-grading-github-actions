const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')

const { upload } = require('../../../middlewares/multer')

router.get('/restaurant/create', adminController.createRestaurant)
router.get('/restaurant/:id/edit', adminController.editRestaurant)
router.delete('/restaurant/:id', adminController.deleteRestaurant)
router.put('/restaurant/:id', upload.single('image'), adminController.putRestaurant)
router.get('/restaurant/:id', adminController.getRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants', adminController.getRestaurants)

router.get('/users/new', adminController.registerUser)
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

module.exports = router
