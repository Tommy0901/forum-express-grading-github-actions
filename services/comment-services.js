const { User, Restaurant, Comment } = require('../models')

const commentServices = {
  postComment: (req, cb) => {
    const { restaurantId, text } = req.body
    const { userId } = req.params;
    (async () => {
      try {
        const [user, restaurant] = await Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (!text) return
        cb(null, { comment: await Comment.create({ text, restaurantId, userId }, { raw: true }) }, restaurantId)
      } catch (err) {
        cb(err)
      }
    })()
  },
  deleteComment: (req, cb) => {
    const { id } = req.params;
    (async () => {
      try {
        const comment = await Comment.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!comment) throw new Error("The comment didn't exist!")
        cb(null, { comment: await comment.destroy() })
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = commentServices
