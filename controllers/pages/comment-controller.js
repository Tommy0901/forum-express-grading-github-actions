const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data, id) => {
      if (err) return next(err)
      req.flash('success', '留言成功!')
      req.session.createdData = data
      res.redirect(`/restaurant/${id}`)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data, id) => {
      if (err) return next(err)
      req.flash('success', 'comment was successfully deleted!')
      req.session.deletedData = data
      res.redirect('back')
    })
  }
}
module.exports = commentController
