const express = require('express')
const session = require('express-session')
const { engine: handlebars } = require('express-handlebars')
const flash = require('connect-flash')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('.hbs', handlebars({ extname: '.hbs' })) // 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.set('view engine', '.hbs') // 設定使用 Handlebars 做為樣板引擎
app.set('views', './views') // 參考之前作法加入此行程式碼

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: 'false', saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
  console.log(`Express server is running on http://localhost:${port}`)
})

module.exports = app
