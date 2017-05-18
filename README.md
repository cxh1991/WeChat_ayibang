# WeChat_ayibang
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

首先先要解释我的数据来源，我使用的是用mock来模拟数据，详情看http://www.easy-mock.com Easy Mock是一个可视化工具，能快速生成模拟数据的服务，它能为我们提供一个数据接口url，这要我们就能够使用request发送数据请求了。其次要解释的是用户登录问题，我选择的使用微信账号登录，使用小程序自带的wx.getUseInfo()应用接口来获取用户的信息，当然它首先会调用wx.login接口，询问用户是否给予权限。先就交代这两点，让我们正式进入主题：<br>

功能实现
____
* 轮播图 & 底栏交互 & 页面跳转

先来看看主界面：<br>

 ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/ayibang.JPG) <br>
              
这个界面用到了微信小程序自带的轮播图(swiper)组件以及底栏(tabbar)组件，能够快速的实现我们想要的图片轮播和底栏切换的效果，而这些用原生js或者jquery来coding都是很麻烦的. 让我们来看看微信小程序是如何实现的吧：<br>

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
以上就是实现图片轮播效果的代码，使用滑块视图容器swiper组件,它拥有vertical(是否垂直放置图片）、autoplay(是否自动切换）、interval(自动切换时间间隔)、duration(滑动动画时长)、durationindicator-dot(是否显示面板指示点)等属性，再在js里对这些属性做相关的设置。此外，在组件上还用到了列表渲染wx:for，将图片的src属性绑定在一个数组上，使用数组中各项的数据重复渲染swiper组件<br>

看看底栏切换交互的效果吧！<br>

![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/tabbar.gif) <br>

先暂且不管我制作的gif图有多渣，主要想体现的就是个各底部栏之间能进行切换，这个功能实现较简单，主要在tabBar里设置样式、页面路径、图片路径，用列表list来渲染,详细请参考以下代码<br>
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
  
 接下来是非底栏的页面之间的交互，它的实现主要依赖wx.navigateTo导航接口<br>
 
  ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/pagechange.gif) <br>
  
微信小程序是没有a标签的，但是有wx.navigateTo API实现页面的跳转，有关页面的跳转的三种方式可以详看文档，后面还会用到wx.switchTab进行非底栏页面与底栏页面的切换。这个功能实现的重点在于我们要在某个组件上绑定事件，写法为 bindtap="bindViewTap"，然后在js里添上逻辑控制，代码参考：<br>
 ```javascript
  bindViewTap:function(e){
    wx.navigateTo({
      //跳转到城市列表的页面
        url: '../city/index' 
    })
 ```
 <br>
 
* 地理定位 
 
来看看效果图吧 <br>
 
 
  ![Image text](https://github.com/Sukura7/wechat-ayibang/blob/master/images/citychange.gif) <br>
  
当我们一开始进入应用时，页面会显示我们此时此刻所在的城市，然而在微信提供的wx.getLocation API中，它只会返回经纬度，不会将具体的国家呀城市呀街道等信息反馈给你，所以我们需要借用百度地图、腾讯地图的API来逆地址解析出这些信息。我用的是百度地图的API,这里会有遇到一些坑，在后面会有介绍，具体代码如下：<br>

  ```javascript
  loadCity:function(longitude,latitude){
    var page =this;
    wx.request({
     //baidu地图逆地址解析API
      url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location='+latitude+','+longitude+'&output=json&pois=1',
      data: {},
      header:{
        'Content-Type':'application/json'
      },
      success: function(res){
        // success
        console.log(res);
        var str1=res.data;
        //坑 此时返回的并不是JSON对象，要进行相关转换！
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
你在gif图中也能看到，你跳转到另一个页面后，当你选中某一个城市时，主页的地址也要发生改变，这又是怎么做到的呢？<br>
这就跟本地存储有关了，我们学JS时知道localStorage能够长期的保持数据，我们不妨使用它来实现这种数据之间的传输。微信小程序与之等效的是Storage本地存储,我在这调用了wx.setStorage和wx.getStorage两个API，当我选中某个城市时，就把这个数据保存（setstorage）到数据库中,然后主页使用提取（getstorage）出数据为自己所用。这样想明白就会觉得也不难。看看主要代码实现吧：<br>
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

在此先申明，这里并没有实现所有的服务功能，我只实现了擦玻璃这项服务的预约、下单，其他的服务实现的代码都类似，我就没有所有的都展开写，如果有时间，会一一完善，所以就先凑合着看看吧！<br>
浏览一下效果图<br>

![Image text](https://github.com/Sukura7/WeChat_ayibang/blob/master/images/yuyue.gif) <br>

实现此过程挺基础的，就是页面之间的切换，相关代码如下：<br>
```javascript
gotoserver:function(e){
    wx.navigateTo({
      url: '../server/index' //跳转到服务项目页面
    })
  }
order:function(e){
    console.log(e.target.dataset.text);
    wx.setStorage({
      key:'kind',
      data:e.target.dataset.text
    })
    if(e.target.dataset.text === "擦玻璃"){ //判断用户是否选择了擦玻璃，是就跳转到下单页面
      wx.navigateTo({
        url: '../cleanwindow/index'
      })
    }
  }
 ```
 
* 地图选址
 
看图说话<br>

 ![Image text](https://github.com/Sukura7/WeChat_ayibang/blob/master/images/chooseaddr.JPG) <br>
 
 这里用到了微信小程序提供的wx.chooseLocation({})接口，它可以调用到腾讯地图打开你所在位置的地图，用户可以手动选择位置，核心代码如下：<br>
 ```javascript
 getAddr: function(){
    var that = this;
    wx.chooseLocation({
    success: function(res){
    var point = {
    latitude: res.latitude,
    longitude: res.longitude
    };
    // console.log(res.name)
    //设置位置的名字
    that.setData({
    address : res.name || res.address
    });
  }
})
},
 ```
 
* 下单

看看效果图<br>

![Image text](https://github.com/Sukura7/WeChat_ayibang/blob/master/images/xiadan.gif) <br>

看图可以知道，下单之前，要选好服务地址，上面已经介绍了，使用的是微信自带的api接口(wx.chooseLocation()),然后是一个输入框输入清洗玻璃的面积，根据这个输入，可以计算出用户需要支付的总费用，接下来就是选择服务时间，这里用到的picker组件，picker是从底部弹起的滚动选择器，现支持三种选择器，分别是普通选择器，时间选择器，日期选择器，默认是普通选择器，可以通过mode来区分，这里设置成mode=date,mode=time.下单的实现用到了表单的提交事件，通过form-type为submit的按钮来提交表单触发formsubmit事件,请注意，一定要给表单组件加上name属性，由此来进行赋值。来看看具体实现的代码吧：<br>
HTML结构 具体参考源码<br>
```html
<form action="" class="oform" bindsubmit="formSubmit">
    <view class="address" bindtap="getAddr">
      <input class="addr" name="addr" value="{{address}}"/>
    </view>
    <view class="area ">
      <input type="num" name="area" class="input" placeholoder="请输入玻璃的面积"/>
    </view>
    <view class="time">
        <picker mode="date" name="date" value="{{dateValue}}" start="{{dateValue}}" end="2999-12-12" bindchange="datePickerBindchange">
	        服务日期选择: {{dateValue}}
        </picker>
        <picker mode="time" name="time" value="{{timeValue}}" start="00:00" end="24:00" bindchange="timePickerBindchange">
          服务时间选择: {{timeValue}}
        </picker>
     </view>
      <button class="finish" form-type="submit">下单</button>
 </form>
```
JS逻辑结构<br>
```javascript
//在util.js里文件里定义了两个方法，分别是获取当前的日期和当前的时间，这里要导入使用到
var util = require('../../utils/util.js')
//表单的formSubmit事件可以获取到input、picker等组件的值，以便存储到Storage里面
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
  //获取用户选择的时间和日期
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
```

* 查看订单

眼见为实<br>

![Image text](https://github.com/Sukura7/WeChat_ayibang/blob/master/images/noorder.JPG) <br>

![Image text](https://github.com/Sukura7/WeChat_ayibang/blob/master/images/order.JPG) <br>

由图可知道，订单的显示有两种状态，一是没有订单时的显示，二是支付后的显示情况。状态切换的思想：其实在html结构里分别用div包含了两种不同状态的页面，只是用display来控制状态的显示，而这个状态取决于在本地存储里能不能找到id。id是什么呢? id就是你下单时产生的一个id号，如果用getStorage能够捕获到这个id,则说明用户已经下单，那么这时候没有订单的div我们把它的display属性设置为none不可见，而将显示订单详情的div设为block可见。核心代码：<br>
```javascript
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
```

 到这里差不多也都介绍完了，最后我想分享我在过程中踩过的一些坑：<br>
 * 微信小程序开发中图片的样式是有默认值，宽320 高240 display:inline-block···所以有图片及得要自己给它添上样式，覆盖默认，以防影响！<br>
 * 在调用百度地图的API中，它会返回含有特殊符号的json字符串，我在这个坑里转了几个小时，度娘说是啥发送请求时自带什么bom头，删除就行，然而，我并没有搞   明白，我最后用的方法是把这个不太规矩的字符串通过一些字符串方法以及json,parse()方法把它转化成了json对象。<br>
 * 最后要讲的是一个细节问题，如果想要及时刷新页面的话，我们最好把数据接口放到onshow()方法里面，这样数据发生改变就能刷新页面的显示。<br>
 * 区分wx.navigateTo和wx.switchTab，前者是保留当前页面，跳转到应用内的某个页面（不在tabbar），后者是跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。当我们要从不在tabbar里的页面中跳转到tabbar页面时，除了选择左上角的返回键后，应该选择wx.switchTab,而不是wx.navigateTo。<br>
  <br>
 (更多的服务功能及充值功能将继续完善，see you later!)<br>
  喜欢就送我小星星哟~~
