const express = require('express')
const router = express.Router()

const commentController = require('../controllers/comment-controller')

router.post('/:id', commentController.postComment)
router.delete('/:id', commentController.deleteComment)

module.exports = router
