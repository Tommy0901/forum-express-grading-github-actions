const authHelpers = require('../helpers/auth-helpers')
const passport = require('../config/passport')
const passportAuthLocal = passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true })

module.exports = {
  authenticated (req, res, next) {
    authHelpers.ensureAuthenticated(req)
      ? next()
      : res.redirect('/signin')
  },
  authenticatedAdmin (req, res, next) {
    authHelpers.ensureAuthenticated(req)
      ? authHelpers.getUser(req).isAdmin
        ? next()
        : res.redirect('/')
      : res.redirect('/signin')
  },
  passportAuthLocal
}
