
微信小程序仿阿姨帮
_______
微信小程序是什么？<br>
官方解释，微信小程序，简称小程序，是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或搜一下即可打开应用。简而言之，就是用户需要的时候打开，用完即走的一种应用。如果小程序能够兴起，我想到时候我们的手机将会变得很简单干净，因为你无需下载安装各种App！<br>
开发微信小程序你需要准备好这些工具：<br>
下载微信开发者工具，附上地址：https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html 下载好后就可以进行开发了，不过呢，如果要发布你的小程序呢，你要去申请AppId走各种流程，不过平时练练手可以选择无Appid进行开发，不过会有一些局限。具体开发详情你可以去https://mp.weixin.qq.com 这里了解。<br>
在创建了一个微信小程序后，会自动生成一些基本文件：<br>
* page文件夹 页面文件夹 包含你所有的页面文件,至少包含.js .wxml .wxs后缀文件，.json可选
* utlis文件夹
* app.js 控制全局的逻辑结构
* app.json 配置一些全局数据，所有页面都要在此处注册
* app.wxml 内容显示
* app.wxss 全局样式

好了，接下来进入主题，我做的小程序是模仿手机app版的阿姨帮软件，主要实现的功能有：<br>
* `地理定位`
* `地图选址`
* `预约服务`
* `下单`
* `查看订单`
* `页面跳转`
* `底栏切换良好交互`
* `图片轮播`
* `...`

首先先要解释我的数据来源，我使用的是用mock来模拟数据，http://www.easy-mock.com Easy Mock 是一个可视化工具，并且能快速生成模拟数据的服务，它能为我们提供一个数据接口url，这要我们就能够使用request发送数据请求了。<br>

功能实现
____
* 轮播图 & 底栏交互

先来看看主界面：<br>

 ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/ayibang.JPG) <br>
              
这个界面用到了微信小程序自带的轮播图组件以及tabbar组件，能够快速的实现了我们想要的效果，而这些用原生js或者jquery来coding是有一定麻烦的. 让我们来看看微信小程序是如何实现的吧：<br>

HTML结构<br>
```html
<swiper
  class="binner"
   vertical="{{vertical}}"
   autoplay="{{autoplay}}"
   interval="{{interval}}"
   duration="{{duration}}"
   indicator-dots="{{indicatorDots}}">
    <block wx:for="{{topimg}}" wx:key="item">
      <swiper-item>
        <image src="{{item.image}}" class="slide-image"></image>
      </swiper-item>
    </block>
    <view class="city" bindtap="bindViewTap" >
         <text class="current">{{city}}</text>
    </view>
  </swiper>
```
JS配置<br>
```javascript
Page({
  data: {
    indicatorDots:true,
    vertical:false,
    autoplay:true,
    interval:3000,
    duration:1200,
    ......
    }
  })
```
以上就是实现图片轮播效果的代码，使用swiper组件,在再js里做一些相关配置即可轻松实现。<br>

看看底栏切换交互的效果吧！<br>

![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/tabbar.gif) <br>

先暂且不管我制作的gif图有多渣，主要想体现的就是个各底部栏之间能进行切换，这个功能实现较简单，主要设置页面的路径，请参考一下代码<br>
```javascript
"tabBar":{
    "color":"#888",
    "selectedColor":"#00beaf",
    "borderStyle":"white",
    "backgroundColor":"#fff",
    "list":[{
      "pagePath":"pages/home/index",
      "iconPath":"images/icon5.png",
      "selectedIconPath":"images/icon1.png",
      "text":"阿姨帮"
      },
      {
        "pagePath":"pages/order/index",
        "iconPath":"images/icon2.png",
        "selectedIconPath":"images/icon6.png",
        "text":"订单"
      },
      {
        "pagePath":"pages/vip/index",
        "iconPath":"images/icon3.png",
        "selectedIconPath":"images/icon7.png",
        "text":"会员"
      },
      {
        "pagePath":"pages/my/index",
        "iconPath":"images/icon4.png",
        "selectedIconPath":"images/icon8.png",
        "text":"我的"
        }
    ]
  }
  ```
  
 接下来是非底栏的页面之间的交互，它的实现主要依赖wx.navigateTo()API<br>
 
  ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/pagechange.gif) <br>
  
微信小程序是没有a标签的，但是有wx.navigateTo API实现页面的跳转，有关页面的跳转的三种方式可以详看文档，后面还会用到wx.switchTab进行非底栏页面与底栏页面的切换。这个功能实现的key point在于我们要在某个组件上绑定事件，写法为 bindtap="bindViewTap"，然后在js里添上逻辑控制，代码参考：<br>
 ```javascript
  bindViewTap:function(e){
    wx.navigateTo({
        url: '../city/index'
    })
 ```
 <br>
 
* 地理定位 
 
来看看效果图吧 <br>
 
 
  ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/citychange.gif) <br>
  
当我们一开始进入应用时，页面会显示我们此时此刻所在的城市，然而在微信提供的wx.getLocation API中，它只会返回经纬度，不会讲具体的国家呀城市呀街道等信息反馈给你，所以我们需要借用百度地图、腾讯地图的API来逆地址解析出这些信息。我用的是百度地图的API,这里会有遇到一些坑，在后面会有介绍，具体代码如下：<br>

  ```javascript
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
 ```
你在gif图中也能看到，当你跳转到另一个页面，当你选中某一个城市时，主页的地址也要发生改变，这又是怎么做到的呢？<br>
这就跟本地存储有关了，我们学JS时知道locall storage能够长期的保持数据，我们不妨使用它来实现这种数据之间的传输。我在这调用了wx.setStorage和   wx.getStorage两个API，当我选中某个城市时，就把这个数据保存到数据库中（setstorage）,然后主页使用（getstorage）提取出数据为自己所用。这样想明白就会觉得也不难。看看主要代码实现吧：<br>
在city这个的index.js种下这颗“种子”<br>
 
 ```javascript
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
  }
  ```
  在home主页的Index.js中摘下“果实”<br>
  ```javascript
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
  }
  ```
  以上就是地理地位功能的实现，只要掌握好几个API其实什么问题都迎刃而解。<br>
  
* 预约服务

浏览一下效果图

![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/yuyue.gif) <br>
 
 

  
 到这里差不多也都介绍完了，最后我想分享我在过程中踩过的一些坑：<br>
 * 微信小程序开发中图片的样式是有默认值，宽320 高240 display:inline-block···所以有图片及得要自己给它添上样式，覆盖默认，以防影响！<br>
 * 在调用百度地图的API中，它会返回含有特殊符号的json字符串，我在这个坑里转了几个小时，度娘说是啥发送请求时自带什么bom头，删除就行，然而，我并没有搞   明白，我最后用的方法是把这个不太规矩的字符串通过一些字符串方法以及json,parse()方法把它转化成了json对象。<br>
 * 最后要讲的是一个细节问题，如果想要及时刷新页面的话，我们最好把数据接口放到onshow()方法里面，这样数据发生改变就能刷新页面的显示。<br>
 * 区分wx.navigateTo和wx.switchTab，前者是保留当前页面，跳转到应用内的某个页面（不在tabbar），后者是跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。当我们要从不在tabbar里的页面中跳转到tabbar页面时，除了选择左上角的返回键后，应该选择wx.switchTab,而不是wx.navigateTo。<br>
  <br>
  （待续···）
