const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const { User, Restaurant } = require('../models')
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      (async () => {
        try {
          const user = await User.findOne({
            // attributes: ['id', 'name', 'email', 'password'], // 設定 passport.serializeUser 資料取得的欄位
            where: { email },
            raw: true
          })
          user
            ? (await bcrypt.compare(password, user.password))
                ? done(null, user)
                : done(null, false, {
                  type: 'error', // 此行可省略，因為 type 預設名稱即為 error
                  message: 'email 或密碼錯誤'
                })
            : done(null, false, { message: 'email 或密碼錯誤' })
        } catch (err) {
          done(err)
        }
      })()
    }
  )
)

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  const { id } = jwtPayload;
  (async () => {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      done(null, user) // 後續 jwt 會協助將資料 user 轉成 JSON 格式
    } catch (err) {
      done(err)
    }
  })()
}))

passport.serializeUser((user, done) => {
  const { id } = user
  done(null, id) // id 將作為 passport.deserializeUser 搜尋使用者資料的索引值
})

passport.deserializeUser((id, done) => {
  (async () => {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      done(null, user.toJSON())
    } catch (err) {
      done(err)
    }
  })()
})

module.exports = passport
