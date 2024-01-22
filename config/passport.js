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

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    (async () => {
      try {
        const userData = await User.findOne({
          attributes: ['id', 'name', 'email', 'password'], // 設定 passport.serializeUser 資料取得的欄位
          where: { email },
          raw: true
        })
        const { password: userPassword, ...user } = userData
        user
          ? (await bcrypt.compare(password, userPassword))
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
  }))

passport.use(new JwtStrategy(jwtOptions,
  (jwtPayload, done) => {
    const { id } = jwtPayload;
    (async () => {
      try {
        const userData = await User.findByPk(id, {
          include: [
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: Restaurant, as: 'LikedRestaurants' },
            { model: User, as: 'Followings' },
            { model: User, as: 'Followers' }
          ]
        })
        const { password, ...user } = userData.toJSON()
        done(null, user)
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
      const userData = await User.findByPk(id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      const { password, ...user } = userData.toJSON()
      done(null, user)
    } catch (err) {
      done(err)
    }
  })()
})

module.exports = passport
