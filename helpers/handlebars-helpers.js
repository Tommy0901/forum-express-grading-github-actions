const dayjs = require('dayjs') // 載入 dayjs 套件

module.exports = {
  currentYear () { return dayjs().year() }, // 取得當年年份作為 currentYear 的屬性值，並導出
  ifCond (a, b, options) { return a === b ? options.fn(this) : options.inverse(this) } // 可參考 HandlebarS 官網的 Block Helpers Conditonals；注意使用 this 不要搭配箭頭函式
}
