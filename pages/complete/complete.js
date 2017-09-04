//index.js
//获取应用实例
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

  url: app.url + 'wx/orders/',

  onLoad: function (options) {
    console.log('comlete ..... onLoad');
    console.log(options.order_id);
    this.data.order_id = options.order_id;

    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      console.log('get data from storage');
      // console.log(userInfo);
      this.setData({ userInfo: userInfo });
      this.getOrderAndDataList(userInfo.token, that.url + options.order_id + '/');
    }
    else
    {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        });
        this.getOrderAndDataList(that.data.userInfo.token, that.url + options.order_id + '/');
      });
    }
  },
  

  getOrderAndDataList: function(token, url)
  {
    console.log('getOrderAndDataList ... enter');
    console.log(token);
    console.log(url);
    var that = this;
    wx.request({
      url: url,
      dataType: 'json',
      method: 'GET',
      header: {
        'Authorization': 'Token ' + token,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          'title': res.data.title,
          'created': res.data.created,
        });
        wx.request({
          url: url + 'data-list/',
          dataType: 'json',
          method: 'GET',
          header: {
            'Authorization': 'Token ' + token,
          },
          success: function (res) {
            // console.log(res.data);
            for(var item in res.data){
              var tmp = res.data[item];
              that.data.dataList.push({ id: tmp.sequence, name: tmp.name, price: tmp.price, comments: tmp.price});
              that.setData({ dataList: that.data.dataList });
              //this.data.dataList.push({id:id, name:"", price:""});
            }
          },
          fail: function (res) {
            app.showAlert('network_error');
          },
        })
      },
      fail: function (res) {
        app.showAlert('network_error');
      },
    });
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

    var that = this;
    wx.showActionSheet({
      itemList: ['编辑', '删除', '暂停'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex);
        }

        if (res.tapIndex == 0)//编辑
        {
          wx.setStorageSync('edit_data',that.data);
          wx.navigateTo({
            url: '/pages/edit/edit?edit_data=' + 'edit_data',
            success: function (res) {
              // success
            },
            fail: function (res) {
              console.log('fail....');
              console.log(res);
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        }
        else
        {
          wx.removeStorageSync('edit_data');
          if (res.tapIndex == 1)//删除
          {

          }
        }
      }
    });
  },



  onShareAppMessage: function () {
    var data = JSON.stringify(this.data);
  },
})
