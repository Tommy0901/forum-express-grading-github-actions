const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const passport = require('../config/passport')
const passportAuthLocal = passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true })

module.exports = {
  authenticated (req, res, next) {
    ensureAuthenticated(req)
      ? next()
      : res.redirect('/signin')
  },
  authenticatedAdmin (req, res, next) {
    ensureAuthenticated(req)
      ? getUser(req).isAdmin
        ? next()
        : res.redirect('back')
      : res.redirect('/')
  },
  passportAuthLocal
}
