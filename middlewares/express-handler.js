const express = require('express')
const { urlencoded, static: staticHandler, json } = express

module.exports = {
  urlencodedHandler: urlencoded({ extended: true }),
  jsonHandler: json(),
  staticHandler
}
