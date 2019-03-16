//wx-drawer
var common = require('../../utils/common.js')
var Bmob = require("../../utils/bmob.js");
var Promise = require('../../utils/es6-promise.js')
var util = require('../../utils/util.js');
var app = getApp()
var curIndex  = 0 ;
var that;
const MENU_WIDTH_SCALE = 0.82;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;

Page({ 
  data: {
    userInfo: [],
    dialog:false, 
    autoplay:false,
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true
      
    },
    buttonClicked: false, //是否点击跳转
    //--------首页显示内容---------
    postsList: [], //总的活动
    postsShowSwiperList: [], //轮播图显示的活动
    currentPage: 0, //要跳过查询的页数
    limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
    isEmpty: false, //当前查询出来的数据是否为空
    totalCount: 0, //总活动数量
    endPage: 0, //最后一页加载多少条
    totalPage: 0, //总页数
    curIndex: 0,
    windowHeight1: 0,
    windowWidth1: 0,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }, 

  onLoad(t) {
    var self = this;
    var currentTab = self.data.currentTab;
    if(currentTab == 0){
      self.fetchPostsData();
    }
    
    //this.getAll();
    try {
      let res = wx.getSystemInfoSync()
      self.windowWidth = res.windowWidth;
      self.data.ui.menuWidth = self.windowWidth * MENU_WIDTH_SCALE;
      self.data.ui.offsetLeft = 0;
      self.data.ui.windowWidth = res.windowWidth;
      self.setData({ ui: self.data.ui })
    } catch (e) {
    };
    wx.getSystemInfo({
      success: (res) => {
        self.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth,
          autoplay: true
        })
      }
    });
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },

  onShow: function (e) {
    this.getAll();
    //this.fetchPostsData();
    //this.onLoad();
    console.log('加载头像')
    var that = this;
    
  },

  //数据存储
  onSetData: function (data) {
    console.log(data.length);
    let page = this.data.currentPage + 1;
    //设置数据
    data = data || [];
    this.setData({
      postsList: page === 1 || page === undefined ? data : this.data.postsList.concat(data),
    });
    console.log(this.data.postsList, page);
  },

  //获取总的活动数
  getAll: function () {
    self = this;
    var Diary = Bmob.Object.extend("Events");
    var query = new Bmob.Query(Diary);
    query.equalTo("isShow",1); //只统计公开显示的活动
    query.count({
      success: function (count) {
        var totalPage = 0;
        var endPage = 0;
        if (count % self.data.limitPage == 0) {//如果总数的为偶数
          totalPage = parseInt(count / self.data.limitPage);
        } else {
          var lowPage = parseInt(count / self.data.limitPage);
          endPage = count - (lowPage * self.data.limitPage);
          totalPage = lowPage + 1;
        }
        self.setData({
          totalCount: count,
          endPage: endPage,
          totalPage: totalPage
        })
        console.log("共有" + count + " 条记录");
        console.log("共有" + totalPage + "页");
        console.log("最后一页加载" + endPage + "条");
      },
    });
  },

  //获取首页列表文章
  fetchPostsData: function (data) {
    var self = this;
    var molist = new Array();
    var userid = wx.getStorageSync("user_id");
    //查阅自己的订阅事件池
    var moreinfo = Bmob.Object.extend("Moreinfo");
    var query = new Bmob.Query(moreinfo);
    query.equalTo("users", userid);//这个用户的id
    query.first({
      success: function (res) {
        var eventArray = res.get("subevent");
        for (var i = eventArray.length - 1; i >= 0; i--) {//遍历出每一个活动id
          var eventid = eventArray[i];
          console.log("eventid 是" + eventid);
          var events = Bmob.Object.extend("Events");
          var query = new Bmob.Query(events);
          query.include("publisher");
          query.get(eventid, {
            success: function (result) {
              var publisherId = result.get("publisher").objectId;
              var title = result.get("title");
              console.log("title 是" + title);
              var price = result.get("price");
              var content = result.get("content");
              var acttype = result.get("acttype");
              var acttypename = getTypeName(acttype); //根据类型id获取类型名称
              var isShow = result.get("isShow");
              var peoplenum = result.get("peoplenum");
              var likenum = result.get("likenum");
              var isLike = 0;
              var id = result.id;
              var createdAt = result.createdAt;
              var pubtime = util.getDateDiff(createdAt);
              var _url
              var actpic = result.get("actpic");
              if (actpic) {
                _url = result.get("actpic")._url;
              } else {
                _url = "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/01/89a6eba340008dce801381c4550787e4.png";
              }
              var publisherName = result.get("publisher").nickname;
              var publisherPic = result.get("publisher").userPic;
              var jsonA;
              jsonA = {
                "title": title || '',
                "price": price || '',
                "content": content || '',
                "acttype": acttype || '',
                "acttypename": acttypename || '',
                "isShow": isShow,
                "peoplenum": peoplenum || '',
                "id": id || '',
                "publisherPic": publisherPic || '',
                "publisherName": publisherName || '',
                "publisherId": publisherId || '',
                "pubtime": pubtime || '',
                "actPic": _url || '',
                "likenum": likenum,
                "is_liked": isLike || ''
              }
              molist.push(jsonA);
            }
          });
        }
        console.log("num is " + self.data.currentPage);
      }
    }),
    setTimeout(function () {
      self.onSetData(molist, self.data.currentPage);  
      wx.hideLoading();
    }, 900);
    
  },

  //加载下一页
  loadMore: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    //一秒后关闭加载提示框
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    var self = this;
    self.setData({
      currentPage: self.data.currentPage + 1
    });
    console.log("当前页"+self.data.currentPage);
    //先判断是不是最后一页
    if (self.data.currentPage + 1 == self.data.totalPage){
      self.setData({
        isEmpty: true
      })
      if (self.data.endPage != 0) { //如果最后一页的加载不等于0
        self.setData({
          limitPage: self.data.endPage,
        })
      }
      this.fetchPostsData(self.data);
    }else{
      this.fetchPostsData(self.data);
    }
  },

  //点击刷新
  refresh: function () {
    this.setData({
      postsList: [], //总的活动
      postsShowSwiperList: [], //轮播图显示的活动
      currentPage: 0, //要跳过查询的页数
      limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
      isEmpty: false, //当前查询出来的数据是否为空
      totalCount: 0, //总活动数量
      endPage: 0, //最后一页加载多少条
      totalPage: 0, //总页数
      curIndex: 0,
      windowHeight1: 0,
      windowWidth1: 0,
    })
    this.onShow();
  },
 
  // 点击活动进入活动详情页面
  click_activity: function (e) {
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      let actid = e.currentTarget.dataset.actid;
      let pubid = e.currentTarget.dataset.pubid;
      let user_key = wx.getStorageSync('user_key');
      wx.navigateTo({
        url: '/pages/detail/detail?actid=' + actid + "&pubid=" + pubid
      });
    }
  },
})

//根据活动类型获取活动类型名称
function getTypeName(acttype) {
  var acttypeName = "";
  if (acttype == 1) acttypeName = "派发";
  else if (acttype == 2) acttypeName = "礼仪";
  else if (acttype == 3) acttypeName = "保安";
  else if (acttype == 4) acttypeName = "演员";
  else if (acttype == 5) acttypeName = "充场";
  else if (acttype == 6) acttypeName = "家教";
  else if (acttype == 7) acttypeName = "问卷";
  else if (acttype == 8) acttypeName = "促销";
  else if (acttype == 9) acttypeName = "其他";
  return acttypeName;
}