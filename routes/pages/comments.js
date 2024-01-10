const express = require('express')
const router = express.Router()

const commentController = require('../../controllers/pages/comment-controller')

router.post('/:userId', commentController.postComment)
router.delete('/:id', commentController.deleteComment)

module.exports = router
