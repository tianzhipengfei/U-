// pages/news/news.js


var newsNum = 10;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttonclicked: true,
        topNewsList: [],
        normalNewsList: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        newsNum = 10;
        this.getAdverNews();
        this.getLatestNews();
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
        newsNum = newsNum + 5;
        this.getLatestNews()
        console.log(newsNum)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    clickNews(e) {
        console.log(e.currentTarget.dataset.id);
        let id = e.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({
            url: '/pages/newDetail/newDetail?id=' + id + '&adver=0'
        })
    },
    clickAdverNews(e) {
        console.log(e.currentTarget.dataset.id);
        let id = e.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({
            url: '/pages/newDetail/newDetail?id=' + id + '&adver=1'
        })
    },
    getAdverNews(callback) {
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                "event": "getAdverNews"
            },
            method: "POST",
            success: res => {
                let newsMsg = res.data
                console.log(newsMsg)
                var newsList = [];
                newsMsg.forEach(function (value) {
                    newsList.push({
                        id: value[0],
                        title: value[1],
                        date: value[2],
                        source: value[3],
                        firstImage: value[4]
                    })
                });
                this.setData({
                    topNewsList: newsList
                })

            },
            complete: () => {
                callback && callback()
            }
        })
    },
    getLatestNews(callback) {
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                "event": "getNews",
                "adverNum": newsNum
            },
            method: "POST",
            success: res => {
                let newsMsg = res.data
                console.log(newsMsg)
                if (newsMsg.length < newsNum - 5) {
                    newsMsg.length = newsNum - 5;
                    wx.showToast({
                        title: '暂无更多资讯',
                        icon: 'none',
                        duration: 2000
                    })
                }
                var newsList = [];
                newsMsg.forEach(function (value) {
                    newsList.push({
                        id: value[0],
                        title: value[1],
                        date: value[3]+" | "+value[2],
                        source: value[3],
                        firstImage: value[4]
                    })
                });
                this.setData({
                    normalNewsList: newsList
                })

            },
            complete: () => {
                callback && callback()
            }
        })
    }
})

var buttonClicked = function (that) {
    that.setData({
        buttonClicked: false
    })
    setTimeout(function () {
        that.setData({
            buttonClicked: true
        })
    }, 500);
}