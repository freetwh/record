// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  uploadFile (file) {
    let fileObject = {
      time: file.time,
      type: file.type,
    }
    console.log(file)
    let filePath = file.path
    // 上传图片
    let cloudPath = 'records/' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
    return new Promise(function (resolve, reject) {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          fileObject.fileID = res.fileID
          resolve(wx.cloud.callFunction({ name: 'saveFile', data: fileObject }))
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  handleUploadVideo(){
      let _this = this
      // 选择视频
      wx.chooseMessageFile({
        count: 9,
        // extension: ['m4a', 'mp4'],
        success: function (res) {
          wx.showLoading({
            title: '上传中',
          })
          console.log(res)
          
          wx.cloud.init({ env: 'record' })
          let files = res.tempFiles
          for(let i = 0; i < files.length; i++) {
            let file = files[i]
            _this.uploadFile(file).then(res=>{
              console.log(res)
              let pages = getCurrentPages()
              currentPage = pages[pages.length - 1]
              currentPage.route !== 'pages/index/index' && wx.navigateTo({
                url: '../index/index'
              })
            }, err => {
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            })
          }
        },
        fail: e => {
          console.error(e)
        }
      })
  },
  handleUploadImage() {
    console.log('ready for images')
  },
  handleUploadNote() {
    console.log('ready for videos')
  }
})