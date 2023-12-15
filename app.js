const express = require('express')
const { engine: handlebars } = require('express-handlebars')
const flash = require('connect-flash')
const passport = require('./config/passport')
const helpers = require('./helpers/handlebars-helpers.js')
const routes = require('./routes')

const { sessionHandler } = require('./middlewares/session-handler')
const { messageHandler } = require('./middlewares/message-handler')
const { urlencodedHandler, staticHandler } = require('./middlewares/express-handler')
const { generalErrorHandler } = require('./middlewares/error-handler')
const { methodOverrideHandler } = require('./middlewares/methodOverride-handler')

const app = express()
const port = process.env.PORT || 3000

app.engine('.hbs', handlebars({ extname: '.hbs', helpers })) // 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.set('view engine', '.hbs') // 設定使用 Handlebars 做為樣板引擎
app.set('views', './views') // 參考之前作法加入此行程式碼

app.use(
  urlencodedHandler,
  methodOverrideHandler,
  sessionHandler,
  passport.initialize(),
  passport.session(),
  flash(),
  messageHandler,
  staticHandler('public'),
  routes,
  generalErrorHandler
)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
  console.log(`Express server is running on http://localhost:${port}`)
})

module.exports = app
