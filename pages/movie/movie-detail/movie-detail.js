// pages/movie/movie-detail/movie-detail.js
var utils = require('../../../utils/utils.js');
var app = getApp();
var doubanBase = app.globalData.doubanBase;
Page({
  data: {

  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = doubanBase+"/v2/movie/subject/"+ movieId;
    utils.http(url, this.processDoubanData);
  },
  processDoubanData:function(data){    
    if(!data){
      return
    }
    var director = {
      avatar:"",
      name:"",
      id:""
    }
    if(data.directors[0]!=null){
      if (data.directors[0].avatars!=null){
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie={
      movieImg: data.images ? data.images.large:"",
      country:data.countries[0],
      title:data.title,
      originalTitle:data.original_title,
      year:data.year,
      wishCount:data.wish_count,
      commentCount:data.comments_count,
      score:data.rating.average,
      stars: utils.convertToStarsArray(data.rating.stars),
      director: director,
      generes:data.genres.join('、'),
      casts:utils.convertToCastString(data.casts),
      castsInfo: utils.convertToCastInfos(data.casts),
      summary:data.summary
    };
    console.log(movie)
    this.setData({
      movie:movie
    })
  }
})

