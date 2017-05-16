var app=getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    address:'',
    picker1Value:0,
    timeValue:util.formatTime2(new Date),
    dateValue:util.formatTime(new Date)
  },
  formSubmit:function(e){
    var that=this;
    var addr=e.detail.value.addr,
      area=e.detail.value.area,
      date=e.detail.value.date,
      time=e.detail.value.time;
    console.log(e.detail.value);
    wx.setStorage({
      key:"order",
      data:{
        addr,
        area,
        date,
        time
      }
    });
    wx.navigateTo({
      url:'../pay/index'
    })
  },
  getAddr: function(){
    var that = this;
    wx.chooseLocation({
    success: function(res){
    var point = {
    latitude: res.latitude,
    longitude: res.longitude
    };
    // console.log(res.name)
    that.setData({
    address : res.name || res.address
    });
  }
})
},
timePickerBindchange:function(e){
   this.setData({
     timeValue:e.detail.value
   })
 },
 datePickerBindchange:function(e){
   this.setData({
     dateValue:e.detail.value
   })
 }
})
