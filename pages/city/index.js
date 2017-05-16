var app=getApp()
let pageConfig={
  data:{
    city:'',
    now:'',
    hot:'',
    hotcitys:[],
    catagory:[]
  },
  onLoad:function(options){
    this.loadInfo();
  },
  bindViewTap:function(e){
    // console.log(e.target.dataset.text);
    var city=e.target.dataset.text;
    // setStorage API设置本地存储
    wx.setStorage({
      key:"city",
      data:city
    });
    wx.switchTab({
      url: '../home/index'
    })
  },
  loadInfo:function(){
    var page=this;
    wx.request({
      url:'http://www.easy-mock.com/mock/5906811e7a878d73716e32c9/viplist/citylist',
      method:'GET',
      data:{},
      header:{
        'Accept':'application/json'
      },
      success:(res) => {
        console.log(res);
        this.setData({
          now:res.data.now,
          hot:res.data.hot,
          hotcitys:res.data.hotcitys,
          catagory:res.data.catagory
        })
      }
    });

    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        // success
        var longitude=res.longitude;
        var latitude=res.latitude;
        page.loadCity(longitude,latitude);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
   })
  },
  // 微信的getLocation API只获得经纬度，要想得到城市、国家等具体
  // 信息要用到百度、腾讯地图的逆地址解析，这里用的是百度
  loadCity:function(longitude,latitude){
    var page =this;
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location='+latitude+','+longitude+'&output=json&pois=1',
      data: {},
      header:{
        'Content-Type':'application/json'
      },
      success: function(res){
        // success
        console.log(res);
        var str1=res.data;
        var str2=str1.replace("renderReverse&&renderReverse(","");
        var str3=str2.substring(0,str2.length-1);
        var cityresult=JSON.parse(str3);
        console.log(typeof(cityresult));
        var city1=cityresult.result.addressComponent.city;
        var city=city1.replace("市","");
        page.setData({
          city:city
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
};
Page(pageConfig);
