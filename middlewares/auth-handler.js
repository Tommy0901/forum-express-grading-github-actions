const authHelpers = require('../helpers/auth-helpers')
const passport = require('../config/passport')

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
        : res.redirect('back')
      : res.redirect('/')
  },
  passportAuth (strategy, option) {
    return passport.authenticate(strategy, option)
  }
}
