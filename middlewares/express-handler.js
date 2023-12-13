const express = require('express')
const { urlencoded } = express

module.exports = {
  urlencodedHandler: urlencoded({ extended: true })
}
