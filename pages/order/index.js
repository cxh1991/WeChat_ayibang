//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    serverkind:'',
    serveraddr:'',
    date:'',
    time:'',
    area:'',
    sum:'',
    id:'',
    display1:'',
    display2:''
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title:'我的订单'
    })
  },
  onShow:function(){
    let that=this;
    // wx.removeStorage({
    //   key: 'id'
    // });
    wx.getStorage({
      key:'id',
      success:function(res){
        that.setData({
          id:res.data
        });
        console.log(that.data.id);
        if(that.data.id === res.data){
          that.setData({
            display1:'block',
            display2:'none'
          });
        }else{
          that.setData({
            display1:'none',
            display2:'block'
          });
        }
      },
      fail:function(){
        that.setData({
          id:0
        });
        console.log(that.data.id);
        if(that.data.id === 0){
          that.setData({
            display1:'none',
            display2:'block'
          });
        }else{
          that.setData({
            display1:'block',
            display2:'none'
          });
        }
      }
    })
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
