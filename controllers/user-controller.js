const bcrypt = require('bcryptjs')

const { User, Restaurant, Comment } = require('../models')

const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const isAdmin = req.user?.isAdmin
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password) throw new Error('Please enter name, email and password!')

    if (password !== passwordCheck) throw new Error('Passwords do not match!');

    (async () => {
      try {
        if (await User.findOne({ where: { email } })) throw new Error('Email already exists!')
        await User.create({ name, email, password: await bcrypt.hash(password, 10) })
        req.flash('success', '註冊成功!')
        res.redirect(isAdmin ? '/admin/users' : '/signin')
      } catch (error) {
        next(error)
      }
    })()
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout(error => {
      if (error) throw new Error('Logout failed. Please try again!')
      else req.flash('success', '登出成功!')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    return (async () => {
      try {
        const user = await User.findByPk(req.params.id, { include: { model: Comment, include: Restaurant } })
        user.dataValues.commentedRestaurants = user.toJSON().Comments
          ?.map(c => c.Restaurant).filter((item, index, self) => self.findIndex(obj => obj.id === item.id) === index)
        res.render('users/profile', { user: user.toJSON() })
      } catch (error) {
        next(error)
      }
    })()
  },
  editUser: (req, res, next) => {
    return (async () => {
      try {
        const user = await User.findByPk(req.params.id, { raw: true })
        res.render('users/edit', { user })
      } catch (error) {
        next(error)
      }
    })()
  },
  putUser: (req, res, next) => {
    const { file } = req
    if (+req.params.id !== req.user.id) {
      req.flash('error', 'Update failed! Insufficient permissions.')
      return res.redirect(`/users/${req.params.id}`)
    }
    if (!req.body.name) throw new Error('Please enter user name.')
    return (async () => {
      try {
        const [filePath, user] = await Promise.all([localFileHandler(file), User.findByPk(req.params.id)])
        if (!user) throw new Error("The user didn't exist!")
        await user.update({ name: req.body.name, image: filePath || user.image })
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = userController
