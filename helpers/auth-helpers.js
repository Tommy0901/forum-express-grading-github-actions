const jwt = require('jsonwebtoken')

module.exports = {
  getUser (req) { return req.user || null },
  ensureAuthenticated (req) { return req.isAuthenticated() },
  jwtPayload (req) {
    const { authorization } = req.headers
    const token = authorization?.split(' ')[1]
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => err ? undefined : decoded)
  }
}
