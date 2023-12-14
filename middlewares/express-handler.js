const express = require('express')
const { urlencoded, static: staticHandler } = express

module.exports = {
  urlencodedHandler: urlencoded({ extended: true }),
  staticHandler
}
