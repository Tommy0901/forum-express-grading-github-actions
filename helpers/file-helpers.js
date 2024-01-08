const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')

module.exports = {
  localFileHandler (file) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      (async () => {
        try {
          await fs.promises.writeFile(`public/upload/${file.originalname}`, await fs.promises.readFile(file.path))
          resolve(`/upload/${file.originalname}`)
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  imgurFileHandler (file) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      (async () => {
        try {
          const img = await imgur.uploadFile(file.path)
          resolve(img?.link || null)
        } catch (err) {
          reject(err)
        }
      })()
    })
  }
}
