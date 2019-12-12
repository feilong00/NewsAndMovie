Page({
  data: {

  },
  onLoad: function () {
    //获取用户的昵称和头像
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var nickName = res.userInfo.nickName;
        var avatarUrl = res.userInfo.avatarUrl;
        that.setData({
          "nickName": nickName,
          "avatarUrl": avatarUrl
        })
      }
    })
  },
  onTap: function () {
    // wx.navigateTo({
    //   url: '/pages/news/news'
    //})
    wx.switchTab({
      url: '/pages/news/news',
    })
  }
})
