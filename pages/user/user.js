// pages/user/user.js
let app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: [],
        userPoint: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    getPoint: function (thirdSession, sessionKey){
        let that = this
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                event: 'getUserPoint',
                thirdSession: thirdSession,
                sessionzKey: sessionKey
            },
            method: 'POST',
            success: res => {
                let userPoint = res.data
                console.log(typeof (userPoint))
                console.log(userPoint)
                let point = userPoint.split('(')[1].split(',')[0]
                that.setData({
                    userPoint: '积分: '+point
                })
            },
            fail: function () {
                that.setData({
                    userPoint: '暂时无法获得积分'
                })
                console.log('服务器问题')
            }
        })
    },

    bindGetUserInfo: function (e) {
        let that = this
        console.log(e.detail.userInfo)
        if (e.detail.userInfo){
            this.setData({
                userInfo: e.detail.userInfo,
                canIUse: false
            })
            let userInfo = e.detail.userInfo
            let thirdSession = wx.getStorageSync('thirdSession')
            let sessionKey = wx.getStorageSync('sessionKey')
            console.log('key: ', sessionKey)
            if (thirdSession && sessionKey) {
                this.getPoint(thirdSession, sessionKey);
                console.log("in bindtap")
                that.setData({
                    userInfo: userInfo,
                    canIUse: false
                })
            } else {
                app.myLogin();
                that.setData({
                    userPoint: '积分: 0',
                    userInfo: userInfo,
                    canIUse: false
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */

    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this
        this.setData({
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
        })
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res)
                            let userInfo = res.userInfo
                            let thirdSession = wx.getStorageSync('thirdSession')
                            let sessionKey = wx.getStorageSync('sessionKey')
                            console.log('key: ', sessionKey)
                            if (thirdSession && sessionKey) {
                                that.getPoint(thirdSession, sessionKey);
                                console.log("in onshow")
                                that.setData({
                                    userInfo: userInfo,
                                    canIUse: false
                                })
                            } else {
                                app.myLogin();
                                let thirdSession = wx.getStorageSync('thirdSession')
                                let sessionKey = wx.getStorageSync('sessionKey')
                                console.log("1", thirdSession)
                                console.log("2", sessionKey)
                                that.setData({
                                    userPoint: '0',
                                    userInfo: userInfo,
                                    canIUse: false
                                })
                            }

                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    myOrder: function() {
        wx.showToast({
            title: '订单功能稍后推出',
            duration: 3000
        })
    },

    myComment: function () {
        let thirdSession = wx.getStorageSync('thirdSession')
        let sessionKey = wx.getStorageSync('sessionKey')
        if (thirdSession && sessionKey) {
            wx.navigateTo({
                url: '/pages/commentDetailUser/commentDetailUser?userName=' + this.data.userInfo.nickName + '&userAvatar=' + this.data.userInfo.avatarUrl
            })
        } else {
            wx.showToast({
                title: '请先登录',
                duration: 3000
            })
        }
    },

    myFavor: function () {
        let thirdSession = wx.getStorageSync('thirdSession')
        let sessionKey = wx.getStorageSync('sessionKey')
        if (thirdSession && sessionKey) {
            wx.navigateTo({
                url: '/pages/myFavor/myFavor?userName=' + this.data.userInfo.nickName + '&userAvatar=' + this.data.userInfo.avatarUrl
            })
        } else {
            wx.showToast({
                title: '请先登录',
                duration: 3000
            })
        }
    },

    toBeStore: function() {
        wx.navigateTo({
            url: '/pages/toBeStore/toBeStore',
        })
    }
})