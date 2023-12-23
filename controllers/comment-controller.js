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
  }
}
module.exports = commentController
