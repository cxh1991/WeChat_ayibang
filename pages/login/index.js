var app = getApp()
Page({
  config:{
    telephone:'13133743126',
    yzm:'123456'
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title:'快速登录'
    })
  },
  formSubmit:function(e){
    var that=this;
    console.log(e.detail.value.yzm);
    if(e.detail.value.yzm.length==0){
      wx.showModal({
      title: '密码不得为空',
      showCancel:false
    })
  }
  if(e.detail.value.phone==that.config.telephone && e.detail.value.yzm==that.config.yzm){
    wx.showModal({
      title: '登录成功',
      showCancel:false
   })
}else{
  wx.showModal({
    title: '验证码错误',
    showCancel:false
  })
}
  }
})
