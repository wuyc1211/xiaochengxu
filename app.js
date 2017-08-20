//app.js
App({
  onLaunch: function () {
    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var data = wx.getStorageSync("userData");
    //if (data) {
      if(0){
      console.log('get data from storage');
      console.log(data);
      this.globalData = data;
    }
    else
    {
      console.log('get user infor star.....');
      this.getUserInfo();
    }
    
  },
  getUserInfo:function(cb){
    var that = this
    
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({       
        success: function (res) {
          console.log('login wecat...');
          // console.log(res.code)
          // code = res.code;
          // console.log('code: ' + code);
          var appid = 'wx2ad9452a111262bd'; //wxde61aa7a61ed908c
          var secret = 'fed9baf081b964f578dbc05a67a14118'; //;
          var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret +
           '&js_code=' + res.code + '&grant_type=authorization_code';
          //调用获取用户openid接口
           wx.request({
             url: url,
             header: {
               'content-type': 'application/json'
             },
             success: function(res_req){
               console.log('login wechat success');
                console.log(res_req.data);
                //获取用户详细信息
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo;
                    // that.globalData.encryptedData = res.encryptedData;
                    that.globalData.openid = res_req.data.openid;
                    that.globalData.session_key = res_req.data.session_key;
                    // console.log(that.globalData);
                    // typeof cb == "function" && cb(that.globalData.userInfo);
                    //获取token
                    console.log('get user infor success');
                    var data = JSON.stringify(that.globalData);
                    console.log(data);
                    wx.request({
                      url: 'http://localhost:8000/wx/get-token/',
                      data: {
                        "data": data,
                        "from": "abcljailsfuioweijfjlkj34894jdjfsdffsdfzzz"
                      },
                      method: 'POST',
                      dataType: 'json',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        console.log('get token from server: ' + res.data.token);
                        that.globalData.token = res.data.token;
                        //存储到缓存
                        wx.setStorage({
                          key: 'userData',
                          data: that.globalData,
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
                      }
                    });
                  },
                  fail: function (res) {
                    console.log('fail to login')
                  }
                });
             }
           });

          // 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session',
          //   data:{
          //   }
          // });

          
        },
        fail: function(res){
          console.log('微信登录失败！');
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})