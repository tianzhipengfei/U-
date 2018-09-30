// pages/myFavor/myFavor.js
var normalAdverNum = 20;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttonClicked: true,
        userName: '',
        userAvatar: '',
        normalAdverList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userName: options.userName,
            userAvatar: options.userAvatar
        })
        this.getNormalAdver()
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
        normalAdverNum = normalAdverNum + 20;
        this.getNormalAdver()
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
    getNormalAdver() {

        let thirdSession = wx.getStorageSync('thirdSession')
        let sessionKey = wx.getStorageSync('sessionKey')
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                event: 'getLike',
                data: thirdSession,
                key: sessionKey,
                AdverNum: normalAdverNum
            },
            method: "POST",
            success: res => {
                console.log(res)
                if (res.statusCode != 200) {
                    wx.showToast({
                        title: '网络出现问题',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    let normalAdverMsg = res.data
                    console.log(typeof(normalAdverMsg))
                    var normalAdverList = [];
                    if (normalAdverMsg.length <= 0) {
                        return;
                    }
                    if (normalAdverMsg.length < normalAdverNum - 20) {
                        normalAdverNum = normalAdverNum - 20;
                        wx.showToast({
                            title: '暂无更多收藏',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    normalAdverMsg.forEach(function (value) {
                        normalAdverList.push({
                            id: value[0],
                            name: value[1],
                            price: value[2],
                            score: value[3],
                            showImage: value[4],
                        })
                    });
                    this.setData({
                        normalAdverList: normalAdverList
                    })
                }
            }
        })
    },
    //前往培训班详情页
    toClass(e) {
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        let classid = e.target.dataset.id
        console.log(classid)
        wx.navigateTo({
            url: "/pages/product/product?id=" + classid
        })
    }
})
//防止高频点击
var buttonClicked = function (that) {
    that.setData({
        buttonClicked: false
    })
    setTimeout(function () {
        that.setData({
            buttonClicked: true
        })
    }, 1000);
}