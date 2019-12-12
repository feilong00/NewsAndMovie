function http(url,callBack){
    wx.request({
        url: url,
        method:"GET",
        header: {
            'Content-Type': 'json'
        },
        success: function(res) {
            callBack(res.data)
        }
    })
}
function convertToStarsArray(stars){
    var num = stars.toString().substring(0,1);
    var array=[];
    for(var i=1;i<=5;i++){
        if(i<=num){
            array.push(1)
        }else{
            array.push(0)
        }
    }
    return array;
}
function convertToCastString(arr){
    var castString="";
    for(var index in arr){
      castString+=arr[index].name+'/'
    }
    return castString.substring(0, castString.length-1);
}
function convertToCastInfos(arr){
  var castsArray = []
  for(var index in arr){
    var cast = {
      img: arr[index].avatars ? arr[index].avatars.large:"",
      name:arr[index].name
    }
    castsArray.push(cast)
  }
  return castsArray;
}
module.exports={
    "http":http,
    "convertToStarsArray":convertToStarsArray,
    "convertToCastString":convertToCastString,
    "convertToCastInfos": convertToCastInfos
};