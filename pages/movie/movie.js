// pages/movie/movie.js
var utils = require('../../utils/utils');
var app = getApp();
var doubanBase = app.globalData.doubanBase;
Page({

  data: {
    "in_theaters": {},
    "coming_soon": {},
    "top250": {},
    "containerShow": true,
    "searchPanelShow": false,
    "searchResult":{}
  },
  onLoad: function (options) {
    var that = this;
    var inTheatersUrl = doubanBase + "/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
    var comingSoonUrl = doubanBase + "/v2/movie/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
    var top250Url = doubanBase + "/v2/movie/top250?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
    this.getMovieListData(inTheatersUrl,"in_theaters","正在热映");
    this.getMovieListData(comingSoonUrl,"coming_soon","即将上映");
    this.getMovieListData(top250Url,"top250","top250");
  },
  onCancelImgTap:function(){
    this.setData({
      "containerShow": true,
      "searchPanelShow": false,
      "searchResult": {}
    })
  },
  onMoreTap: function (event) {
    var moiveCategory = event.currentTarget.dataset.category;
    var moviesTitle = event.currentTarget.dataset.title;
    wx.navigateTo({
      "url": "/pages/movie/movie-more/movie-more?id=" + moiveCategory + "&title=" + moviesTitle
    })
  },
  getMovieListData: function (url, key, title) {
    var that = this;
    utils.http(url, function (data) {
      that.processDoubanData(data, key, title)
    });
  },
  processDoubanData: function (moviesDouban, key, title) {
    var movies = [];
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
    var readyData = {};
    readyData[key] = {
      "movies": movies,
      "title": title,
      "category": key
    };
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },
  onBindFocus: function () {
    this.setData({
      "containerShow": false,
      "searchPanelShow": true
    })
  },
  onBindSearch:function(event){    
    var text = event.detail.value;
    var searchUrl = doubanBase +"/v2/movie/search?q="+text;
    this.data.searchUrl = searchUrl;
    this.getMovieListData(searchUrl,"searchResult","");    
    wx.showNavigationBarLoading();
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-detail?id='+movieId,
    })
  }
})