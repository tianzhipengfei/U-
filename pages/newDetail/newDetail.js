// pages/detail/detail.js
var newID = 0;


Page({
    data: {
        contentList: [],
        countNum: "",
        title: "",
        date: "",
        generateOk: false,
    },
    onLoad(options) {
        var newID = options.id ? options.id: 0;
        let adver = options.adver
        console.log(newID, adver)
        if(adver == 1){
            this.getAdverNews(newID);
        } else {
            this.getNews(newID);
        }
        setTimeout(() => {
            this.setData({
                generateOk: true
            })
        }, 800)

    },
    getNews(newsID) {
        console.log(newsID)
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                "event": "getNewsDetail",
                "id": newsID
            },
            method: "POST",
            success: res => {
                let result = res.data[0];
                console.log(result)
                if(result!='P'){
                    this.setData({
                        title: result[0],
                        date: result[2]+" "+result[1],
                        countNum:"阅读" + result[5],
                        contentList: JSON.parse(result[4]),
                        generateOK: true
                    })
                } else{
                    this.setData({
                        contentList: [
                            {
                                "type": "image",
                                "src": "/images/newsDetail/404-bg.jpg",
                                "id": 2
                            },
                            {
                                "type": "strong",
                                "text": "&nbsp;你来到了没有知识的荒原 :(",
                                "id": 1
                            }
                        ],
                        countNum: "阅读 " + 0,
                        title: "404 Not Found",
                        date: "Futrue"
                    })
                }
            },
            fail: () => {
                this.setData({
                    contentList: [
                        {
                            "type": "image",
                            "src": "/images/newsDetail/404-bg.jpg",
                            "id": 2
                        },
                        {
                            "type": "strong",
                            "text": "&nbsp;你来到了没有知识的荒原 :(",
                            "id": 1
                        }
                    ],
                    countNum: "阅读 " + 0,
                    title: "404 Not Found",
                    date: "Futrue"
                })
            }
        })
    },
    getAdverNews(newsID) {
        console.log(newsID)
        wx.request({
            url: 'https://www.tianzhipengfei.xin/saidian',
            data: {
                "event": "getAdverNewsDetail",
                "id": newsID
            },
            method: "POST",
            success: res => {
                let result = res.data[0];
                console.log(result)
                if (result != 'P') {
                    this.setData({
                        title: result[0],
                        date: result[2] + " " + result[1],
                        countNum: "阅读" + result[5],
                        contentList: JSON.parse(result[4]),
                        generateOK: true
                    })
                } else {
                    this.setData({
                        contentList: [
                            {
                                "type": "image",
                                "src": "/images/newsDetail/404-bg.jpg",
                                "id": 2
                            },
                            {
                                "type": "strong",
                                "text": "&nbsp;你来到了没有知识的荒原 :(",
                                "id": 1
                            }
                        ],
                        countNum: "阅读 " + 0,
                        title: "404 Not Found",
                        date: "Futrue"
                    })
                }
            },
            fail: () => {
                this.setData({
                    contentList: [
                        {
                            "type": "image",
                            "src": "/images/newsDetail/404-bg.jpg",
                            "id": 2
                        },
                        {
                            "type": "strong",
                            "text": "&nbsp;你来到了没有知识的荒原 :(",
                            "id": 1
                        }
                    ],
                    countNum: "阅读 " + 0,
                    title: "404 Not Found",
                    date: "Futrue"
                })
            }
        })
    }
})