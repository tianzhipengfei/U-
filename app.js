//app.js
App({
  onLaunch: function () { 
           
  },
  globalData: {
    userInfo: null,
    sportType: "篮球"
  },
  myLogin: function () {
        console.log(123)
        wx.login({
            success: res => {
                console.log("login", res)
                let code = res.code
                wx.getUserInfo({
                    success: res => {
                        let userInfo = res.encryptedData
                        console.log(userInfo)
                        let iv = res.iv
                        wx.request({
                            url: 'https://www.tianzhipengfei.xin/saidian',
                            data: {
                                event: 'userLogin',
                                code: code,
                                userInfo: userInfo,
                                iv: iv
                            },
                            method: "POST",
                            success: res => {
                                console.log(res)
                                console.log(typeof (res.data))
                                let data = res.data
                                var temp1 = data.split(',')[0]
                                var temp2 = data.split(',')[1]
                                var key = ""
                                var data1 = ""
                                if (temp1.indexOf('key') > 0) {
                                    key = temp1.split(':')[1]
                                    data1 = temp2.split(':')[1]
                                } else {
                                    data1 = temp1.split(':')[1]
                                    key = temp2.split(':')[1]
                                }
                                wx.setStorageSync('thirdSession', data1)
                                wx.setStorageSync('sessionKey', key)
                                console.log(345)
                                console.log(data1, key)

                            }
                        })
                    }
                })
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
  }
})

