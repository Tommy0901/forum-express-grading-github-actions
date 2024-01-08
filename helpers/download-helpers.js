const fs = require('fs') // 引入 fs 模組
const axios = require('axios')

module.exports = {
  downloadImageHandler (downloadpath, fileNumber) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await axios.get(downloadpath, { responseType: 'arraybuffer' })
          fs.writeFileSync(`public/upload/${fileNumber}.jpg`, Buffer.from(response.data))
          resolve(console.log(`Image downloaded and saved to upload/${fileNumber}.jpg`))
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  responseUrlHandler (url) { // file 是 multer 處理完的檔案
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' })
          const IncomingMessage = response.request.res
          resolve(IncomingMessage?.responseUrl || null)
        } catch (err) {
          reject(err)
        }
      })()
    })
  }
}
