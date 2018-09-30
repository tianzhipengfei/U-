// pages/detailForProduct/product.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    commentList:[],
    like: 0,
    classid: 0,
    commentNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let classid =  options.id;
    this.setData({
        classid: classid
    })
    console.log("in product, classid is ", classid)
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
      this.getClassInfo()
      this.getCommentList()
      let thirdSession = wx.getStorageSync('thirdSession')
      let sessionKey = wx.getStorageSync('sessionKey')
      if (sessionKey && thirdSession) {
          this.searchLike(thirdSession, sessionKey)
      }
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
  
  //点击电话按钮打电话
  makePhoneCall: function(){
    if(this.data.product.phone){
        //假设只打记录的第一个电话
        let phoneList = this.data.product.phone.split(';');
        var phone = phoneList[0];
        for (var i = 0; i < phoneList.length; i++){
            if (phoneList[i].indexOf("400") != -1) {
                phone = phoneList[i];
                break;
            }
        }
        wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
        })
    } else{
        wx.showToast({
            title: '暂无商家电话',
            icon: 'none',
            duration: 1000
        })
    }
  },
  toComment: function () {
      let that = this
      let thirdSession = wx.getStorageSync('thirdSession')
      let sessionKey = wx.getStorageSync('sessionKey')
      if(thirdSession && sessionKey){
          wx.navigateTo({
              url:'/pages/comment/comment?productName='+that.data.product.name+'&productId='+ that.data.classid
          })
      } else{
          wx.showModal({
              title: '温馨提醒',
              content: '您还未登录，是否登录',
              showCancel: true,
              success:function(){
                  wx.switchTab({
                      url: '/pages/user/user',
                  })
                //   wx.navigateTo({
                //       url: '/pages/comment/comment?productName=' + that.data.product.name + '&productId=' + that.data.classid
                //   })
              }

          })
      }
  }, 
  getCommentList() {
      let that = this
      wx.request({
          url: 'https://www.tianzhipengfei.xin/saidian',
          data: {
              event: 'getCommentNumByClass',
              classId: that.data.classid,
          },
          method: "POST",
          success: res => {
              console.log(res.data)
              this.setData({
                  commentNum: res.data
              })
          }
      })
      wx.request({
          url: 'https://www.tianzhipengfei.xin/saidian',
          data: {
              event: 'getCommentByClass',
              classId: that.data.classid,
              commentNum: 3
          },
          method: "POST",
          success: res => {
              if (res.statusCode != 200) {
                  wx.showToast({
                      title: '加载评论失败',
                      icon: 'none',
                      duration: 2000
                  })
              } else {
                  let normalCommentMsg = res.data
                  console.log(normalCommentMsg)
                  console.log(typeof(normalCommentMsg))
                  
                  var normalCommentList = [];
                  if (normalCommentMsg.length <= 0) {
                      return;
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
  },
  like: function () {
      let that = this
      let thirdSession = wx.getStorageSync('thirdSession')
      let sessionKey = wx.getStorageSync('sessionKey')
      if (thirdSession && sessionKey) {
          this.setData({
              like: 1
          })
          wx.request({
              url: 'https://www.tianzhipengfei.xin/saidian',
              data: {
                  event: 'like',
                  data: thirdSession,
                  key: sessionKey,
                  classId: that.data.classid,
              },
              method: 'POST',
              success: res => {
                  console.log(res)
              }
          })
      } else {
          let that = this
          wx.showModal({
              title: '温馨提醒',
              content: '您还未登录，是否登录',
              showCancel: true,
              success: function () {
                  wx.switchTab({
                      url: '/pages/user/user',
                  })
              }

          })
      }
  },
  dislike: function () {
    this.setData({
        like: 0
      })
    let that = this
    let thirdSession = wx.getStorageSync('thirdSession')
    let sessionKey = wx.getStorageSync('sessionKey')
    wx.request({
        url: 'https://www.tianzhipengfei.xin/saidian',
        data: {
            event: 'dislike',
            data: thirdSession,
            key: sessionKey,
            classId: that.data.classid,
        },
        method: 'POST',
        success: res => {
            console.log(res)
        }
    })
  },
  searchLike: function (thirdSession, sessionKey){
      wx.request({
          url: 'https://www.tianzhipengfei.xin/saidian',
          data: {
              event: 'searchLike',
              data: thirdSession,
              key: sessionKey,
              classId: this.data.classid,
          },
          method: 'POST',
          success: res => {
              if(res.data){
                  this.setData({
                      like: 1
                  })
              }else{
                  this.setData({
                      like: 0
                  })
              }
          }
      })
  },
  getClassInfo:function(){
      wx.request({
          url: 'https://www.tianzhipengfei.xin/saidian',
          data: {
              event: 'getClassDetail',
              id: this.data.classid
          },
          method: "POST",
          success: res => {
              console.log(res.data[0])
              let classData = res.data[0];
              var address = [];
              let addressList = classData[5].split('[')[1].split(']')[0].split(';')
              var i = 0;
              addressList.forEach(function (value) {
                  address[i] = value.split(':')[1] + ': ' + value.split(':')[2];
                  i = i + 1;
              });
              console.log(addressList)
              this.setData({
                  product: {
                      showImage: classData[12],
                      name: classData[1],
                      score: classData[7],
                      score1: classData[8],
                      score2: classData[9],
                      score3: classData[10],
                      score4: classData[11],
                      address: address,
                      description: classData[3],
                      phone: classData[6]
                  }
              })
              console.log(this.data)
          }
      })
  },
  toCommentDetail(){
      wx.navigateTo({
          url: '/pages/commentDetail/commentDetail?className='+this.data.product.name+'&classId='+this.data.classid,
      })
  },
  deleteComment: function(){
      
  }
})