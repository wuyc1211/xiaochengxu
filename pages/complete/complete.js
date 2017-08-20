//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // motto: 'Hello World',
  edit_start: false
  },

  onLoad: function () {
    console.log('onLoad');
    var data = wx.getStorageSync("userData");
    if (!data)
    {
      console.log("load缓存数据失败.");
      return;
    }
    this.setData(data);
    console.log(this.data);
  },
  
  payment_start: function(event) {
    //
    if (this.data.edit_start){
      this.setData({edit_start:false});
      return;
    }
    console.log("payment_start.");
    console.log(event)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var appid = "wx2ad9452a111262bd";
    var nonceStr = String(Math.random());
  },
  
  payment_edit: function(event){
    this.setData({ edit_start: true });
    console.log('payment_edit');
    wx.showActionSheet({
      itemList: ['禁止', '删除'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    });
  },

  onShareAppMessage: function () {
    var data = JSON.stringify(this.data);
    //console.log(data);

    
    
  },
})
