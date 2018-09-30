// pages/commentDetail/commentDetail.js
var normalCommentNum = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    commentList: [],
    classid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let className=options.className
    let classid = options.classId
    console.log("lals", classid)
    this.setData({
        className: className,
        classid : classid
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
      console.log(this.data.classid)
      wx.request({
          url: 'https://www.tianzhipengfei.xin/saidian',
          data: {
              event: 'getCommentByClass',
              classId: this.data.classid,
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
                          avatar: value[1],
                          score: value[2],
                          date: value[3].split(' ')[0],
                          content: value[4]
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
  }
})