// pages/index/index.js


var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;
const NOTBEIJING = 3;
var normalAdverNum = 10;
const app = getApp();

Page({
    data: {
        searchHistory:[],
        searchContent:'',
        inSearch: false,
        buttonClicked: true,
        locationAuth: false,
        city: "未知位置",
        locationAuthType: UNPROMPTED,
        hasPush: false,
        advertisementList: [],
        typeList: [
            {
                description: "篮球",
                iconPath: "/images/index/basketball.png"
            },
            {
                description: "足球",
                iconPath: "/images/index/soccer.png"
            },
            {
                description: "网球",
                iconPath: "/images/index/tennis.png"
            },
            {
                description: "羽毛球",
                iconPath: "/images/index/badminton.png"
            },
            {
                description: "游泳",
                iconPath: "/images/index/swim.png"
            },
            {
                description: "健身",
                iconPath: "/images/index/body.png"
            },
            {
                description: "滑冰",
                iconPath: "/images/index/skate.png"
            },
            {
                description: "更多",
                iconPath: "/images/index/sportelse.png"
            }
        ],
        normalAdverList: [
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置sdk_key
        qqmapsdk = new QQMapWX({
            key: '5LSBZ-D7OHF-NX4J6-JZPXR-PKW6F-OTBC5'
        });
        this.getAdverNews();
        //获取用户位置权限
        wx.getSetting({
            success: res => {
                let that = this;
                let auth = res.authSetting['scope.userLocation']
                console.log(auth)
                let locationAuthType = auth ? AUTHORIZED
                    : (auth === false) ? UNAUTHORIZED : UNPROMPTED
                this.setData({
                    locationAuthType: locationAuthType
                })
                //如果授权了,获取当前城市
                if (auth) {
                    console.log(1)
                    this.getCity()
                }
                //权限未请求
                else if(auth == undefined){
                    console.log(2)
                    wx.authorize({
                        scope: 'userLocation',
                        success: function () {
                            console.log(3)
                            this.getCity()
                        },
                        fail: function () {
                            console.log(4)
                            that.setData({
                                locationAuthType: UNPROMPTED
                            })
                        }
                    })
                }
                //拒绝时显示拒绝拒绝画面
                else {
                    this.setData({
                        locationAuthType: UNAUTHORIZED
                    })
                }
            },
            fail: () => {
                this.setData({
                    locationAuthType: UNPROMPTED
                })
            }
        })
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
        normalAdverNum = 10;
        this.getNormalAdver()
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
        normalAdverNum = normalAdverNum + 5;
        this.getNormalAdver()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    clickAdverNews(e) {
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
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
                let newsMsg = JSON.parse(res.data)
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
                    advertisementList: newsList
                })

            },
            complete: () => {
                callback && callback()
            }
        })
    },
    //点击图片后获取用户位置权限
    getLocationAuth() {
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        if (this.data.locationAuthType == UNAUTHORIZED) {
            wx.openSetting({
                success: res => {
                    let locationAuth = res.authSetting['scope.userLocation']
                    if (locationAuth) {
                        this.getCity();
                    }
                }
            });
        }
        else {
            this.getCity();
        }
    },
    //通过腾讯地图 api 获取城市信息
    getCity() {
        wx.getLocation({
            success: res => {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: res => {
                        let city = res.result.address_component.city;
                        console.log("city", city)
                        this.setData({
                            city: city,
                            locationAuthType: AUTHORIZED
                        })

                        // if (city!="北京市"){
                        //     this.setData({
                        //         locationAuthType: NOTBEIJING
                        //     })
                        // }
                    }
                });
            },
            fail: () => {
                this.setData({
                    locationAuthType: UNAUTHORIZED,
                })
            }
        })
    },
    //获取下部商家信息并填充展示数据
    getNormalAdver() {
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                event: 'getNormalAdver',
                adverNum: normalAdverNum
            },
            method: "POST",
            success: res => {
                if (res.statusCode!=200){
                    wx.showToast({
                        title: '网络出现问题',
                        icon: 'none',
                        duration: 2000
                    })
                } else{
                    let normalAdverMsg = res.data

                    var normalAdverList = [];
                    if (normalAdverMsg.length <= 0) {
                        return;
                    }
                    if (normalAdverMsg.length < normalAdverNum - 5) {
                        normalAdverNum = normalAdverNum - 5;
                        wx.showToast({
                            title: '暂无更多培训班',
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
    //前往培训班详情页
    toClass(e) {
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        let classid = e.target.dataset.id
        console.log(classid)
        wx.navigateTo({
            url: "/pages/product/product?id=" + classid 
        })
    },
    //前往分类页面
    toType(e) {
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        let sportType = e.currentTarget.dataset.id
        app.globalData.sportType = sportType
        wx.switchTab({
            url: "/pages/type/type"
        })
    },
    focusInput:function(){
        this.setData({
            inSearch: true
        })
        var history = wx.getStorageSync('searchHistory')
        if(history){
            this.setData({
                searchHistory:history
            })

        } else{
            this.setData({
                searchHistory:[]
            })
        }
    },
    blurInput:function(){
        if(this.data.searchContent==""){
            this.setData({
                inSearch: false
            })
        }
    },
    inputeInput:function(res){
        this.setData({
            searchContent: res.detail.value
        })
    },
    confirmInput:function(){
        if (this.data.searchContent==""){
            wx.showToast({
                title: '输入有误',
            })
            return
        }
        var history = wx.getStorageSync('searchHistory')
        console.log(history)
        if (history) {
            var flag=false;
            for(var i=0;i<history.length;i++){
                if(history[i]==this.data.searchContent){
                    flag=true;
                    for(var j=i;j>0;j--){
                        history[j]=history[j-1]
                    }
                    history[0] = this.data.searchContent
                    break;
                }
            }
            console.log(flag)
            if(!flag){
                if(history.length<3){
                    for (var i = history.length;i>0;i--){
                        history[i]=history[i-1]
                    }
                    history[0] = this.data.searchContent
                    console.log(history)
                } else{
                    for(var i=2;i>0;i--){
                        history[i] = history[i - 1]
                    }
                    history[0] = this.data.searchContent
                }
            }
        } else {
            history=[]
            history[0]=this.data.searchContent
        } 
        wx.setStorageSync('searchHistory', history)
        this.searchClass(this.data.searchContent)
        this.setData({
            searchContent: "",
            inSearch: false
        })
    },
    searchClass:function(name){
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data:{
                event:'searchProduct',
                name: name
            },
            method:"POST",
            success: function(res){
                if(res.data=="POST error"){
                    wx.showToast({
                        title: '未找到相应课程',
                    })
                } else{
                    wx.navigateTo({
                        url: "/pages/product/product?id=" + res.data
                    })
                }
            }
        })
    },
    tapSearchHistory:function(e){
        if (!this.data.buttonClicked) { return }
        buttonClicked(this);
        console.log(e)
        name=e.currentTarget.dataset.name
        this.searchClass(name)
    },
    clearSearchHistory:function(){
        wx.setStorageSync('searchHistory', [])
        this.setData({
            searchHistory: []
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