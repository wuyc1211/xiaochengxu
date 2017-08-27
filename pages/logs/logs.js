//logs.js
// var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    dataList: [],
    id: 0,
  },
  
  url : app.url + 'wx/orders',
  onHide: function()
  {
    console.log('onhide');
    var page = getCurrentPages().pop();
    if(page){
      page.onLoad();
      console.log('onload...');
      
    }
  },
  
  onUnload(){
    console.log('unload...');
  },

  onLoad: function () {
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      console.log('get data from storage');
      // console.log(userInfo);
      this.setData({ userInfo: userInfo });
      this.getOrderList(userInfo.token);
    }
    else {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        this.setData({
          userInfo: userInfo
        });
        this.getOrderList(this.data.userInfo.token);
      });
    }
  },

  getOrderList:function(token){
    var that = this;
    wx.request({
      url: this.url,
      dataType: 'json',
      method: 'GET',
      header: {
        'Authorization': 'Token ' + token,
      },
      success: function(res){
        console.log(res.data);
        for(var i in res.data){
          var item = res.data[i];
          that.data.dataList.push({num: that.data.id + 1, order_id: item.id, title: item.title, created: item.created, end: item.end });
          that.data.id += 1;
        }
        that.setData({ dataList: that.data.dataList });
      },
      fail: function(res){},
    })
  },
})
