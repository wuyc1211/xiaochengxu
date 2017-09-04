//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // motto: 'Hello World',
    userInfo: '',
    token: '',
    //openid: '',
    title: '',
    id: 0,
    dataList:[
       {id:0, name:"", price:"", comments:""},
      // {id:2, name:"2", "type":"text"},
    ]
  },

  addNewItem:function(){
    console.log('addNewItem');
    // console.log(this.data.dataList);
    var id = this.data.id + 1;
    this.data.dataList.push({id:id, name:"", price:""});
    this.setData({id: id, dataList: this.data.dataList});
    // console.log(this.data.dataList);
  },

  removeItem: function (e) {
    console.log("iconClick");
    console.log(this.data.dataList);
    if (this.data.dataList.length < 1) 
    {
      return;
    }
    if (this.data.dataList.length > 1)
    {
      this.data.dataList.pop();
      this.data.id -= 1;
      this.setData({ dataList: this.data.dataList, id: this.data.id});
    }

  },

  //事件处理函数
  bindViewTap: function() {
    // wx.navinavigateTo({
    //   url: '../logs/logs'
    // })
  },

  onLoad: function (options) 
  {
      wx.removeStorageSync("userInfo");
      console.log('index.js: onload() start ...');
      console.log(options);
      if ('edit_data' in options)
      {
        console.log('edit_data=' + options.edit_data);
        var edit_data = wx.getStorageSync(options.edit_data);
        return;
      }
      


      var that = this;
      var userInfo = wx.getStorageSync("userInfo");
      if (userInfo) {
      // if (0) {
        console.log('get data from storage');
        console.log(userInfo);
        this.setData({ userInfo: userInfo});
      }
      else {
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
            userInfo: userInfo
          });
          //存储到缓存
          wx.setStorage({
            key: 'userInfo',
            data: userInfo,
            success: function (res) {
              // success
            },
            fail: function (res) {
              console.log('set storage fail');
              // console.log(res.det)
            },
            complete: function (res) {
              // complete
            }
          });
        });
        
      }
  },

  onShareAppMessage: function () {
    return {
      title: '微信群收款',
      path: 'pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },

  confirmDataList: function(event){
    console.log("confirmDataList");
    if (!this.data.title || (this.data.dataList.length < 1)){
      app.showAlert();
      return;
    }
    for (var i = 0; i < this.data.dataList.length; i++){
      if(!this.data.dataList[i].name || !this.data.dataList[i].price){
        app.showAlert();
        return;
      }
    }

    var order = {
      title: this.data.title,
      end: '2020-01-01 00:00'
    };
    var order_data = JSON.stringify(order);
    var data_list = JSON.stringify(this.data.dataList);

    var that = this;
    wx.request({
      url: 'http://localhost:8000/wx/create-order/',
      data: {
        "order_data": order_data,
        "data_list": data_list,
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + that.data.userInfo.token,
      },
      success: function(res) {
        console.log('submit to server succuss,get return data:');
        console.log('order id=', res.data.id);
        console.log(res.statusCode);
        if (res.statusCode == '201')
        {
          // app.globalData.order_id = res.data.id
          wx.navigateTo({
            url: '/pages/complete/complete?order_id=' + res.data.id,
            success: function (res) {
              // success
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          });
        }
        else
        {
          app.showAlert('network_error');
        }
      },
      fail: function(res){
        //show error box
        app.showAlert('network_error');
      },
    });
    
  },

  bindKeyInputTitle: function (event) {
    console.log(event.detail.value);
    var value = event.detail.value;
    this.data.title = value;
  },

  bindKeyInputName: function(event){
    console.log(event.detail.value);
    var id = event.currentTarget.id;
    this.data.dataList[id].name = event.detail.value;
  },

  bindKeyInputPrice: function(event){
    console.log(event.detail.value);
    var value = event.detail.value;
    if (value == null || value == undefined || value == '') value ="0.0";
    var f = parseFloat(value);
    console.log("转化为数字:" + f);
    var that = this;
    if (isNaN(f)) {
      wx.showModal({
        content: '输入价格错误',
        title: '提示',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            var id = event.currentTarget.id;
            that.data.dataList[id].price = ""
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    var id = event.currentTarget.id;
    this.data.dataList[id].price = f;
    //this.setData({ name: event.detail.value });
    
    // this.setData({dataList:this.data.dataList});
  },
  
  bindKeyInputComments: function (event) {
    var value = event.currentTarget.value;
    console.log("bindKeyInputComments:" + value);
    var id = event.currentTarget.id;
    this.data.dataList[id].comments = value; 
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
  },

  

  typeClick: function(e){
    console.log(e);
  }
})
