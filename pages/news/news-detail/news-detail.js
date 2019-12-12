// pages/news/news-detail/news-detail.js
var newsData = require('../../../data/news-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newsId = options.id;
    var newData = newsData.newsList[newsId];
    this.setData({
      "newData": newData,
      "newsId": newsId
    });
    var newsCollected = wx.getStorageSync('newsCollected');
    if (newsCollected) {
      //是否存在本页面的数据缓存
      //如果不存在：取出的就是false
      //如果存在：true，false
      //就是取出渲染
      var newsItemCollected = newsCollected[newsId];
      this.setData({
        collected: newsItemCollected
      })

    } else {
      //根本没有key:newsCollected的缓存
      var newsCollected = {};
      newsCollected[newsId] = false;
      wx.setStorageSync('newsCollected', newsCollected)
    };

    if (app.globalData.isPlayingMusic && app.globalData.currentMusicNewsId == newsId){
      this.setData({
        isPlayingMusic:true
      })
    };
    this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    var that = this;


    wx.onBackgroundAudioPlay(function(){      
      var pages = getCurrentPages();
      var currentPage = pages[pages.length-1];
      if (currentPage.data.newsId===that.data.newsId){
        if (app.globalData.currentMusicNewsId==that.data.newsId){
          that.setData({
            isPlayingMusic: true
          });
        }
      }
      app.globalData.isPlayingMusic = true;     
      
    });


    wx.onBackgroundAudioPause(function(){
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.newsId === that.data.newsId) {
        if (app.globalData.currentMusicNewsId == that.data.newsId) {
          that.setData({
            isPlayingMusic: false
          });
        }
      }
      app.globalData.isPlayingMusic = false;      
    });

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.isPlayingMusic = false;  
      app.globalData.currentMusicNewsId = null;
    });
  },

  onColletionTap:function () {
    this.showToast();
    // this.showModal();
  },
  showToast: function () {
    this.setData({
      collected: !this.data.collected
    });
    wx.showToast({
      title: this.data.collected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    });
    var newsCollected = wx.getStorageSync('newsCollected');
    newsCollected[this.data.newsId] = this.data.collected;
    wx.setStorageSync("newsCollected", newsCollected);
  },
  showModal: function () {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: that.data.collected ? "取消收藏该文章" : "收藏该文章",
      success: function (res) {
        if (res.confirm) {
          that.setData({
            collected: !that.data.collected
          })
          var newsCollected = wx.getStorageSync('newsCollected');
          newsCollected[that.data.newsId] = that.data.collected;
          wx.setStorageSync("newsCollected", newsCollected);
        }
      }
    })
  },
  onShareTap: function () {
    var itemList = ['分享到微信好友', '分享到朋友圈', '分享到QQ', "分享到微博"];
    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success: function (res) {
        var index = res.tapIndex;
        if(index){
          wx.showModal({
            title: itemList[index],
            content: '请点击右上角菜单的“转发”按钮进行分享',
          })
        }
      }
    })
  },
  onMusicTap:function(){    
    if (this.data.isPlayingMusic){
      //如果原来在播放，我就暂停
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }else{
      var that = this;
      //如果原来没有播放，我接着播放
      wx.playBackgroundAudio({
        dataUrl: that.data.newData.music.url,
        title: that.data.newData.music.title,
        coverImgUrl: that.data.newData.music.coverImg
      });
      this.setData({
        isPlayingMusic:true
      })
    }
    app.globalData.currentMusicNewsId = this.data.newsId;

  },
  // 定义页面的转发功能
  onShareAppMessage: function () {
    return {
      title: this.data.newData.title,
      desc: "[喜洋洋的喜悦]",
      path: "/pages/news/news-detail/news-detail?id=" + this.data.newsId
    }
  }
})