//index.js
const app = getApp()
const avatars = [];
const begin = new Date('2019/05/19 18:00');
const now = new Date();
const photos = new Array(20);

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    videos: new Array(20),
    photos,
    sweatyDays: Math.round((now.getTime() - begin.getTime())/24/3600/1000),
    notes: [
      {
        created_time: '2019年5月25日',
        content: '你是不是一点都不喜欢我',
      }, {
        created_time: '2019年6月8日',
        content: '凌晨两点钟，我在四楼的楼梯口终于亲吻了她，紧紧抱着怀里的人，就好像抱住了这个夏天所有美好的夜晚。（几分钟前的长椅上那个不让亲的summer差点把我急哭了。。）哈哈哈summer从来没说过喜欢我，但我知道她也需要我。我是个敢爱敢恨的人，我这么喜欢她，根本藏不住，在星空下陪她数星星，唱电影里的第一首情歌，唱小星星。还被她嘲笑我撑在椅子上看星星时的姿势太奇葩。这么美好的初夏，以往的生活里是不敢奢望的，没想到走出校园后，还能和summer一起拥有这样一个夜晚。谢谢你，我可爱的summer。',
      }, {
        created_time: '2019年6月22日',
        content: '今天视频第一次跟她生气了，她很用心地想哄好我，我这臭脾气就这样情绪很难走掉。后来summer就被我的臭脸弄生气了。。却很容易原谅了我，还说出她理解我对她的在乎。真心觉得通情达理又能自我治愈的summer有点让人心疼，以后都想好好保护她，不再让她孤单，每天都让她开心地笑，让她知道她在我眼里是多美好的存在。以后我做你的糖，张梦茹。',
      },
    ],
    activeMenu: 'notes',
    owner: {
      nickname: 'summer',
      avatar: '../../images/owner/avatar_01.jpg',
      backgroundImage: '../../images/owner/background_01.jpg',
      points: 920,
    },
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  // 上传多媒体资源
  uploadVoice: function () {
    // 选择声音
    wx.chooseMessageFile({
      count: 1,
      extension: ['m4a', 'mp3'],
      // sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })
console.log(res)
        const filePath = res.tempFiles[0].path

        // 上传图片
        const cloudPath = 'records/' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  handleMenuClick(e){
    var type = e.currentTarget.dataset.value;
    this.setData({activeMenu: type});
    switch(type){
      case 'videos':
        this.fetchVideosList();
        break;
      case 'photos':
        this.fetchPhotosList();
        break;
      case 'notes':
        this.fetchNotesList();
        break;
      default:
        break;
    }
  }
})
