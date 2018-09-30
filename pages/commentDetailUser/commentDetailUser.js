// pages/commentDetailUser/commentDetailUser.js
var normalCommentNum = 20;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userName: '',
        userAvatar: '',
        commentList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userName: options.userName,
            userAvatar: options.userAvatar
        })
        this.getNormalComment()
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
        normalCommentNum = normalCommentNum + 20;
        this.getNormalComment()
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
    //获取下部商家信息并填充展示数据
    getNormalComment() {

        let thirdSession = wx.getStorageSync('thirdSession')
        let sessionKey = wx.getStorageSync('sessionKey')
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                event: 'getCommentByUser',
                data: thirdSession,
                key: sessionKey,
                commentNum: normalCommentNum
            },
            method: "POST",
            success: res => {
                if (res.statusCode != 200) {
                    wx.showToast({
                        title: '网络出现问题',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    let normalCommentMsg = res.data
                    console.log(normalCommentMsg)
                    var normalCommentList = [];
                    if (normalCommentMsg.length <= 0) {
                        this.setData({
                            commentList: []
                        })
                        return;
                    }
                    if (normalCommentMsg.length < normalCommentNum - 20) {
                        normalCommentNum = normalCommentNum - 20;
                        wx.showToast({
                            title: '暂无更多评论',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    normalCommentMsg.forEach(function (value) {
                        normalCommentList.push({
                            name: value[0],
                            score: value[1],
                            date: value[2].split(' ')[0],
                            dateDetail: value[2],
                            content: value[3],
                            classId: value[4]
                        })
                    });
                    this.setData({
                        commentList: normalCommentList
                    })
                }

            },
            fail: () => {
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: () => {

            }

        })
    },
    deleteComment: function (e) {
        let that = this
        console.log(e)
        wx.showModal({
            title: '',
            content: '确认要删除评论吗？',
            success: function(res){
                if (res.confirm) {
                    console.log('用户点击确定')
                    let date = e.currentTarget.dataset.date
                    let classId = e.currentTarget.dataset.id
                    let thirdSession = wx.getStorageSync('thirdSession')
                    let sessionKey = wx.getStorageSync('sessionKey')
                    wx.request({
                        url: 'https://www.tianzhipengfei.xin/saidian',
                        data: {
                            event: 'deleteComment',
                            date: date,
                            classId: classId,
                            data: thirdSession,
                            key: sessionKey
                        },
                        method: "POST",
                        success: res => {
                            console.log(res)
                        },
                        complete: function () {
                            that.getNormalComment()
                        }
                    })
                }
            }
        })
        
        

    }
})