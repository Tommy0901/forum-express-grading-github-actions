const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    return (async () => {
      await User.create({ name, email, password: await bcrypt.hash(password, 10) })
      return res.redirect('/signin')
    })()
  }
}
module.exports = userController
