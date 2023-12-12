const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

module.exports = {
  authenticated (req, res, next) {
    return ensureAuthenticated(req)
      ? next()
      : res.redirect('/signin')
  },
  authenticatedAdmin (req, res, next) {
    return ensureAuthenticated(req)
      ? getUser(req).isAdmin
        ? next()
        : res.redirect('back')
      : res.redirect('/')
  }
}
