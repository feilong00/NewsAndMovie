// pages/movie/movie-more/movie-more.js
var utils = require('../../../utils/utils');
var app = getApp();
var doubanBase = app.globalData.doubanBase;
//totalCount:当前总共加载多少 条数据
Page({
  data: {
    movies: [],
    totalCount: 0
  },
  onLoad: function (options) {
    var that = this;
    var category = options.id;
    var title = options.title;
    var dataUrl = doubanBase + "/v2/movie/" + category + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
    this.data.requestUrl = dataUrl;
    wx.setNavigationBarTitle({
      title: title
    });
    utils.http(dataUrl, that.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onScrollLower: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = this.data.movies;
    for (var index in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[index];
      var movieTitle = subject.title;
      if (movieTitle.length > 6) {
        movieTitle = movieTitle.substring(0, 6) + "...";
      }
      var temp = {
        stars: utils.convertToStarsArray(subject.rating.stars),
        movieTitle: movieTitle,
        average: subject.rating.average,
        movieId: subject.id,
        coverageUrl: subject.images.large
      };
      movies.push(temp);
    }
    this.data.totalCount += 20;
    this.setData({
      "movies": movies
    });
    wx.hideNavigationBarLoading();
  },
  onPullDownRefresh:function(){
    var refreshUrl = this.data.requestUrl+"?start=0&count=20";
    this.data.movies=[];
    this.data.totalCount = 0;
    utils.http(refreshUrl, processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-detail?id=' + movieId,
    })
  }
})