const session = require('express-session')
const SESSION_SECRET = 'secret'

module.exports = {
  sessionHandler: session({ secret: SESSION_SECRET, resave: 'false', saveUninitialized: false })
}
