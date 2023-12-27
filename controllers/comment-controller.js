const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const { id } = req.user;
    (async () => {
      try {
        const [user, restaurant] = await Promise.all([User.findByPk(id), Restaurant.findByPk(restaurantId)])
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await Comment.create({ text, restaurantId, userId: id })
        req.flash('success', '留言成功!')
        res.redirect(`/restaurant/${restaurantId}`)
      } catch (error) {
        next(error)
      }
    })()
  },
  deleteComment: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const comment = await Comment.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!comment) throw new Error("The comment didn't exist!")
        await comment.destroy() // const deletedComment = await comment.destroy()
        req.flash('success', 'comment was successfully deleted!')
        res.redirect('back') // res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = commentController
