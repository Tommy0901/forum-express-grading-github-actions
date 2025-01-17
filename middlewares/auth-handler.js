const authHelpers = require('../helpers/auth-helpers')
const passport = require('../config/passport')

module.exports = {
  api: {
    authenticated (req, res, next) {
      passport.authenticate('jwt', { session: false },
        (err, user) => {
          if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
          req.user = user
          next()
        }
      )(req, res, next)
    },
    authenticatedAdmin (req, res, next) {
      authHelpers.getUser(req)?.isAdmin
        ? next()
        : res.status(403).json({ status: 'error', message: 'permission denied' })
    }
  },
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
