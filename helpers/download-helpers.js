const fs = require('fs') // 引入 fs 模組
const axios = require('axios')
const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
  projectId: 'silver-fragment-411909',
  keyFilename: '/home/welcome-rsa-key-20240205/download/silver-fragment-411909-86d979044673.json' // 替換成你的服務帳戶金鑰路徑
})

const bucketName = 'test_upload_image' // 替換成你的 GCS 存儲桶名稱

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
  responseUrlHandler (url) {
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
  },
  uploadImageFromUrlToGCS (downloadpath, fileNumber) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // 下載圖片
          const response = await axios.get(downloadpath, { responseType: 'arraybuffer' })
          // 上傳到 GCS
          await uploadToGCS(Buffer.from(response.data), `${fileNumber}.jpg`)
          resolve(console.log('Image uploaded to GCS'))
        } catch (err) {
          reject(err)
        }
      })()
    })
  },
  deleteFileInGCS (fileNumber) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await deleteFile(fileNumber)
          resolve(console.log('File deleted in GCS'))
        } catch (err) {
          reject(err)
        }
      })()
    })
  }
}

async function uploadToGCS (fileBuffer, remoteFilePath) {
  try {
    // 上傳到 GCS
    await storage.bucket(bucketName).file(remoteFilePath).save(fileBuffer)
    console.log(`File uploaded to GCS: ${remoteFilePath}`)
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`)
  }
}

async function deleteFile (fileNumber) {
  try {
    await storage.bucket(bucketName).file(`${fileNumber}.jpg`).delete()
    console.log(`File ${fileNumber}.jpg deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`)
  }
}
