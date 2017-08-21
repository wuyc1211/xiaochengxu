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
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      console.log('get data from storage');
      console.log(userInfo);
      this.setData({ userInfo: userInfo, order_id: app.globalData.order_id });
    }
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
