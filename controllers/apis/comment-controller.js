const commentServices = require('../../services/comment-services')

const categoryController = {
  putCategory: (req, res, next) => {
    commentServices.postComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteCategory: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = categoryController
