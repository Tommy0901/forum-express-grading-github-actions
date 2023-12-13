const { getUser } = require('../helpers/auth-helpers.js')

module.exports = {
  messageHandler (req, res, next) {
    res.locals.success_msg = req.flash('success')
    res.locals.error_msg = req.flash('error')
    res.locals.user = getUser(req)
    next()
  }
}
