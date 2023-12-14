const fs = require('fs') // 引入 fs 模組

module.exports = {
  localFileHandler (file) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      const fileName = `upload/${file.originalname}`;
      (async () => {
        try {
          const data = await fs.promises.readFile(file.path)
          await fs.promises.writeFile(fileName, data)
          resolve(`/${fileName}`)
        } catch (eroror) {
          reject(eroror)
        }
      })()
    })
  }
}
