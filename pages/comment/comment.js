// pages/comment/comment.js
var productID = -1
var userID = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: [0,0,0,0,0],
    productName: '',
    content : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let productName = options.productName
    this.setData({
        productName: productName
    })
    productID = options.productId
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
  change:function (e){
    //   console.log(e)
    let id = e.target.dataset.id
    console.log(id)
    this.data.score[parseInt(id/10)]=id%10+1
    this.setData({
        score: this.data.score
    })
  },
  submitComment: function(){
      let thirdSession = wx.getStorageSync('thirdSession')
      let sessionKey = wx.getStorageSync('sessionKey')
      console.log('before submint: ',this.data.content)
      wx.request({
          url:'https://www.tianzhipengfei.xin/saidian',
          data:{
              'event': 'submitComment',
              'score1': this.data.score[1],
              'score2': this.data.score[2],
              'score3': this.data.score[3],
              'score4': this.data.score[4],
              'scoreTotal': this.data.score[0],
              'productId': productID,
              'content': this.data.content,
              'data': thirdSession,
              'key': sessionKey
          },
          method: 'POST',
          success: function(res){
              console.log("after submit comment, recieve: ",res)
          },
          complete: function(){
              wx.navigateBack({
                  alpha: 1
              })
          }
      })
  }, 
  changeContent: function(e){
    //   console.log(e)
    this.setData({
        content: e.detail.value
    })
  }
})