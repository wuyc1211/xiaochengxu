//logs.js
var util = require('../index/index.js')
var app = getApp()
Page({
  data: {
    // motto: 'Hello World',
    edit_start: false,
    order_id: '',
    userInfo: '',
    title: '',
    dataList: [
      // { id: 0, name: "", price: "", comments: "" },
    ]
  },
  
  url : app.url + 'wx/orders',

  onHide: function()
  {
  },
  
  onUnload(){
    console.log('unload...');
  },

  onLoad: function (options) {
    console.log(options.edit_data);
    var that = this;
    var edit_data = wx.getStorageSync(options.edit_data);
    console.log(edit_data);
    
    this.setData({title: edit_data.title});
    this.setData({dataList: edit_data.dataList});
    this.setData({ userInfo: edit_data.userInfo});
  },
})
