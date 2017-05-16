var app=getApp();
Page({
  data:{
    serverkind:'',
    serveraddr:'',
    date:'',
    time:'',
    area:'',
    sum:'',
  },
  pay:function(e){
    console.log(e.currentTarget.id);
    wx.setStorage({
      key:"id",
      data:e.currentTarget.id
    });
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 1000,
      success: setTimeout(function(){
                    wx.switchTab({ url: '../order/index' })
                }, 1000)
    });
  },
  onShow:function(){
    let that=this;
    // 调用getStorageAPI同步数据
    wx.getStorage({
      key: 'kind',
      success:function(res){
          console.log(res.data);
          that.setData({
            serverkind:res.data
          })
      }
    });
    wx.getStorage({
      key: 'order',
      success:function(res){
          console.log(res.data);
          that.setData({
            serveraddr:res.data.addr,
            date:res.data.date,
            time:res.data.time,
            area:res.data.area,
            sum:parseInt(res.data.area)*14+130
          })
      }
    });
  }
})
