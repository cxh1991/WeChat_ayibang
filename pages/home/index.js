//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots:true,
    vertical:false,
    autoplay:true,
    interval:3000,
    duration:1200,
    topimg:[],
    city:'',
    topimg:'',
    serverlist:[],
    title:'',
    desc:'',
    clean:[],
    image:'',
    hot:'',
    recomlist:[]
  },
  bindViewTap:function(e){
    wx.navigateTo({
        url: '../city/index'
    })
  },
  gotoserver:function(e){
    wx.navigateTo({
      url: '../server/index'
    })
  },
  // onShow函数页面显示的时候调用，将数据接口放到此处可以实现页面的刷新
  onShow:function(){
    let that=this;
    // 调用getStorageAPI同步数据
    wx.getStorage({
      key: 'city',
      success:function(res){
          console.log(res.data);
          that.setData({
            city:res.data
          })
      }
    })
  },
  onLoad:function(){
    var page=this;
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
        // wx.setStorage({
        //   key:"city",
        //   data:city
        // })
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
    wx.request({
      url:'http://www.easy-mock.com/mock/5906811e7a878d73716e32c9/viplist/home',
      method:'GET',
      data:{},
      header:{
        'Accept':'application/json'
      },
      success:(res) => {
        console.log(res);
        this.setData({
          topimg:res.data.topimg,
          serverlist:res.data.serverlist,
          title:res.data.title,
          desc:res.data.desc,
          image:res.data.image,
          clean:res.data.clean,
          hot:res.data.hot,
          recomlist:res.data.recomlist
        })
      }
    })
  }
})
