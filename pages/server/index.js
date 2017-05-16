//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    name:[],
    list0:[],
    list1:[]
  },
  order:function(e){
    console.log(e.target.dataset.text);
    wx.setStorage({
      key:'kind',
      data:e.target.dataset.text
    })
    if(e.target.dataset.text === "擦玻璃"){
      wx.navigateTo({
        url: '../cleanwindow/index'
      })
    }
  },
  onLoad:function(){
    wx.request({
      url:'http://easy-mock.com/mock/5911a42cacb959185b0c4201/more/server',
      method:'GET',
      data:{},
      datatype:'json',
      header:{
        'Accept':'application/json'
      },
      success:(res) => {
        // console.log(res.data.title);
        this.setData({
          name:res.data
        })
      }
    });
    wx.request({
      url:'http://easy-mock.com/mock/5911a42cacb959185b0c4201/more/item',
      method:'GET',
      data:{},
      datatype:'json',
      header:{
        'Accept':'application/json'
      },
      success:(res) => {
        console.log(res.data);
        this.setData({
          list0:res.data.list0,
          list1:res.data.list1,
        })
      }
    })
  }
})
