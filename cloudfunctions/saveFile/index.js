// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'record' })

const db = cloud.database()

// 云函数入口函数
const collections = {
  video: 'videos',
  image: 'images'
}
exports.main = async (data, context) => {
  if(!data.fileID) return false
  return db.collection(collections[data.type]).add({
    data: data
  })
}