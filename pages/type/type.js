// pages/type/type.js
var sportTypeSelectedNum = 0
const Num2Sport = ["篮球", "足球", "网球", "羽毛球", "游泳", "健身","滑冰", "乒乓球", "体育舞蹈", "滑雪", "棒球", "橄榄球", "少儿体能", "马术"]
const Sport2Num = {
    "篮球": 0,
    "足球": 1,
    "网球": 2,
    "羽毛球": 3,
    "游泳": 4,
    "健身": 5,
    "滑冰": 6,
    "乒乓球": 7,
    "体育舞蹈": 8,
    "滑雪": 9,
    "棒球": 10,
    "橄榄球": 11,
    "少儿体能": 12,
    "马术": 13
}
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttonClicked: true,
        typeList: [],
        sportTypeList: [
            {
                "name": "篮球",
                "id": 0,
                "isSelected": true
            },
            {
                "name": "足球",
                "id": 1,
                "isSelected": false
            },
            {
                "name": "网球",
                "id": 2,
                "isSelected": false
            },
            {
                "name": "羽毛球",
                "id": 3,
                "isSelected": false
            },
            {
                "name": "游泳",
                "id": 4,
                "isSelected": false
            },
            {
                "name": "健身",
                "id": 5,
                "isSelected": false
            },
            {
                "name": "滑冰",
                "id": 6,
                "isSelected": false
            },
            {
                "name": "乒乓球",
                "id": 7,
                "isSelected": false
            },
            {
                "name": "体育舞蹈",
                "id": 8,
                "isSelected": false
            },
            {
                "name": "滑雪",
                "id": 9,
                "isSelected": false
            },
            {
                "name": "棒球",
                "id": 10,
                "isSelected": false
            },
            {
                "name": "橄榄球",
                "id": 11,
                "isSelected": false
            },
            {
                "name": "少儿体能",
                "id": 12,
                "isSelected": false
            },
            {
                "name": "马术",
                "id": 13,
                "isSelected": false
            }
        ],
        normalAdverList: []
    },

    // 选择左侧不同的运动项目
    selectSportType: function (options) {
        let currentTypeSelectedNum = options.target.id
        // 如果点的和现在显示的一样，直接返回
        if (sportTypeSelectedNum == currentTypeSelectedNum) {
            return
        }
        // 否则更新选择的项目
        this.data.sportTypeList[sportTypeSelectedNum].isSelected = false;
        this.data.sportTypeList[currentTypeSelectedNum].isSelected = true;
        sportTypeSelectedNum = currentTypeSelectedNum
        
        this.setData({
            sportTypeList: this.data.sportTypeList
        })
        this.getSportClass(Num2Sport[sportTypeSelectedNum])
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
        let currentTypeSelectedNum = Sport2Num[app.globalData.sportType]
        console.log(currentTypeSelectedNum)
        if (sportTypeSelectedNum == currentTypeSelectedNum) {
            this.getSportClass(app.globalData.sportType)
            return
        }
        // 否则更新选择的项目
        this.data.sportTypeList[sportTypeSelectedNum].isSelected = false;
        this.data.sportTypeList[currentTypeSelectedNum].isSelected = true;
        sportTypeSelectedNum = currentTypeSelectedNum
        this.setData({
            sportTypeList: this.data.sportTypeList
        })
        this.getSportClass(app.globalData.sportType)
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
        console.log(12312313131231)
        app.globalData.sportType = "篮球"
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
    //获得不同类别的课程
    getSportClass(sportType){
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                event: 'getSportClass',
                sportType: sportType
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
                } else{
                    let normalAdverMsg = res.data
                    app.globalData.sportType = sportType
                    var normalAdverList = [];
                    if (normalAdverMsg.length <= 0) {
                        wx.showToast({
                            title: '暂无相关培训班',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    normalAdverMsg.forEach(function (value) {
                        normalAdverList.push({
                            id: value[0],
                            name: value[1],
                            showImage: value[2],
                            price: value[3],
                            score: value[4]
                        })
                    });
                    this.setData({
                        normalAdverList: normalAdverList
                    })
                }
            }
        });
    },
    toClass(e) {
        console.log(123)
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        let classid = e.currentTarget.dataset.id
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