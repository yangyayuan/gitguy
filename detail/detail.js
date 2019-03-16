var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
var Promise = require('../../utils/es6-promise.js')
import { $wuxButton } from '../../components/wux'
var app = getApp();
var that; 
var optionId; //活动的Id
var publisherId; //活动发布者的Id 
var sharerId;//活动的分发者ID 
var joinpId; //如果当前用户已经加入，该活动在联系表中的
var eventMoreId; //当前活动的活动扩展表Id
var commentlist;//评论
var joinlist;//加入者列表
var likerlist;//点赞者列表
let commentText; //评论输入框内
Page({
  data: {
    qrurl: "",
    painting: {},
    shareImage: '',

    hidden: true,
    accounts: ["微信号", "QQ号", "手机号"],
    accountIndex: 0,
    actStatusArray:["报名中","进行中","已结束"],
    statusIndex:0,
    realname: "",
    realnumber: "" ,
    realinfo: "",
    contactValue: "",
    showTopTips: false, //是否显示提示
    TopTips: '', //提示的内容
    linkmainHe: false,
    linkjoinHe: false,
    //----------------
    tag_select: 0,
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    joinList: [],
    likerList: [],
    nameList: [],
    noticeList: [],
    agree: 0,
    favo: 0,
    join: 0,
    issharer: 0,
    isMe: false,
    isToResponse: false,
    islogin: false,
    ishere: true,
    price: "",
    agelimit: "",
    rice: "",
    content: "",

    status: 0,//tab切换按钮
    adminId: "",
    adminname: "",
    //adcontactWay: "",
    adcontactValue: "",
    showCommentDialog: false,//评论输入框显示
    commentInputHolder: "请输入评论内容",//评论输入框提示
    //----------------------------------
    index: 2, 
    opened: !1,
    myphoto: "",
    mysecurity: "",
    mycard: "",
    style_img: ''
  },

  //点击分享者按钮进入详情页  可以关注分享着 可以查看分享者之前发布的消息。类似公众号
  subject:function(e){
    wx.navigateTo({ 
      url: '/pages/my/mylaunch/mylaunch?pubid=' + publisherId,
    })
  },

  eventDraw(e) {
    var formId = e.detail.formId;//获取加入者的formid
    console.log("海报得到的formid是" + formId);
    util.dealFormIds(formId);
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    var that = this;
    var acttypename = that.data.acttypename;  //类型
    var hours = that.data.hours;  //时长
    var price = that.data.price;  //价格
    var agelimit = that.data.agelimit;
    //生成小程序页面二维码
    var path = '/pages/detail/detail?actid=' + optionId + "&pubid=" + publisherId + "&shid=" + wx.getStorageSync('user_id');
    var width = 180;
    var type = 1;
    Bmob.generateCode({ "path": path, "width": width, "type": type }).then(function (obj) {
      var qrurl = obj.url;
      that.setData({
        painting: {
          width: 375,
          height: 555,
          clear: true,
          views: [
            {
              type: 'image',
              url: '../static/images/qrbg.jpg',
              top: 0,
              left: 0,
              width: 375,
              height: 555
            },
            {
              type: 'image',
              url: qrurl,
              top: 470,
              left: 170,
              width: 50,
              height: 50
            },
            {
              type: 'text',
              content: acttypename + "通告",
              fontSize: 38,
              lineHeight: 36,
              color: '#ffffff',
              textAlign: 'left',
              top: 18,
              left: 120,
              width: 300,
              MaxLineNumber: 2,
              breakWord: true,
              bolder: true
            },
            {
              type: 'text',
              content: "时薪:" + price,
              fontSize: 33,
              lineHeight: 33,
              color: '#ffffff',
              textAlign: 'left',
              top: 68,
              left: 30,
              width: 300,
              MaxLineNumber: 3,
              breakWord: true,
              bolder: true
            },
            {
              type: 'text',
              content: "要求:" + agelimit,
              fontSize: 35,
              lineHeight: 33,
              color: '#ffffff',
              textAlign: 'left',
              top: 188,
              left: 30,
              width: 300,
              MaxLineNumber: 5,
              breakWord: true,
              bolder: true
            },
            {
              type: 'text',
              content: "工作内容:" + hours,
              fontSize: 35,
              lineHeight: 33,
              color: '#ffffff',
              textAlign: 'left',
              top: 308,
              left: 30,
              width: 300,
              MaxLineNumber: 5,
              breakWord: true,
              bolder: true
            },
            {
              type: 'text',
              content: "长按二维码识别报名活动",
              fontSize: 23,
              lineHeight: 33,
              color: '#ffffff',
              textAlign: 'left',
              top: 520,
              left: 68,
              width: 300,
              MaxLineNumber: 2,
              breakWord: true,
              bolder: true
            }
          ]
        },
        // hidden: false
      })
    }
    )
    
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          hidden: true
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        hidden: false
      })
    }
  },



  //关闭二维码弹窗
  closeCode: function () {
    this.setData({
      codeHehe: false
    })
  },
  //打开活动群二维码弹窗
  showqrcode: function () {
    this.setData({
      qrcodeHe: true
    })
  },

  //关闭活动群二维码弹窗
  closeqrcode: function () {
    this.setData({
      qrcodeHe: false
    })
  },

  //获取转发按钮的formid
  sharebtn: function(e){
    let formId = e.detail.formId;
    console.log('form发生了submit事件，推送码为：', formId)
    //如果当前用户是发布者或者分享者时上传formid
    //如果当前用户是普通用户时不上传formid
    if (this.data.join == 3 || this.data.issharer == 3) {
      util.dealFormIds(formId);
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.checkSettingStatu();//检查是否有授权
    this.initButton()//初始化按钮
    that = this;

    var openid = wx.getStorageSync("user_openid");//获取用户的openid
    optionId = options.actid;//上个页面传来的活动ID
    publisherId = options.pubid;//上个页面传来的发布者ID
    if (options.shid) {//分享者的userid 判断sharerid是否存在用来后续做领队订阅号和推荐系统用
      sharerId = options.shid;
    }
    console.log('this is options.actid=' + options.actid);
    console.log('this is options.pubid=' + options.pubid);
    //console.log('this is options.sharername=' + options.shid);
    var buttons2 = new Array()
    that.setData({
      optionId: optionId,
      publisherId: publisherId,
      sharerId: sharerId,
      myphoto: "",
      mysecurity: "",
      mycard: "",
      isSrc: false,
      isSrcc: false,
      isSrccc: false,
    });  
    wx.getStorage({ //判断当前发布人是不是自己，是自己就转换为发布者模式
      key: 'user_id',//获取用户的user-id
      success: function (ress) {
        if (publisherId == ress.data || sharerId == ress.data) {//如果userid和发布者ID一样
          that.setData({
            favo: 3, //表示无法收藏
            join: 3, //已经无法加入
            isMe: true,
          })
          console.log("这是我的发起");
        }else{

        }
      },
    });
    //判断当前用户是否是分享者来控制按钮是否显示
    var Contacts = Bmob.Object.extend("Contacts");
    var query = new Bmob.Query(Contacts);
    query.equalTo("event", optionId);
    query.equalTo("currentUser", wx.getStorageSync("user_id"));
    query.first({
      success: function (res) {
        var isshare = res.get("isshare");
        if(isshare == "1"){
          that.setData({
            issharer: 3,
          })
        }
        var isjoin = res.get("ispass");//判断是否被拒绝来决定加入按钮状态  为1时 加入活动  为0时退出活动
        if(isjoin == 0){
          that.setData({
            join: 0,
          })
        }
      }
    });
    //判断是否登陆来决定是否显示报名模块
    wx.getStorage({
      key: 'my_nick',
      success: function(res) {
        that.setData({
          islogin: true,
          ishere: false
        })
        console.log(res)
      },
      error:function(result,error){//未登录
        that.setData({
          islogin: false,
          ishere: true
        })
      }
    });
    var realname = wx.getStorageSync("realname");
    var realnumber = wx.getStorageSync("realnumber");
    that.setData({
      realname: realname,
      realnumber: realnumber
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()//隐藏消息提示窗口
    console.log("onReady进行中");
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    console.log("onshow进行中")
    //this.checkSettingStatu();//检查是否有授权
    var myInterval = setInterval(getReturn, 500);//半秒定时查询
    function getReturn() {
      wx.getStorage({
        key: 'user_id',//获取userid
        success: function (ress) {
          console.log("onshow里面的userid是"+ress.data);
          if (ress.data) {
            clearInterval(myInterval); //清除定时器
            //确定收藏状态与加入状态
            if (that.data.isMe == false) {//如果这条发起不是自己发的，是报名者时
              var userQuery = new Bmob.Query(Bmob.User);
              userQuery.equalTo("objectId", ress.data);//这个用户的userid和用户表里面的objectid相等时
              userQuery.find({
                success: function (result) {
                  if (result[0]){
                  var favoArray = result[0].get("eventFavo");
                  }
                  if (result[0]) {
                  var joinArray = result[0].get("eventJoin");
                  }
                  var isFavo = false;
                  var isJoin = false;
                  if (favoArray != null) {
                    if (favoArray.length > 0) {
                      for (var i = 0; i < favoArray.length; i++) {
                        if (favoArray[i] == optionId) {
                          favoArray.splice(i, 1);
                          isFavo = true;
                          break;
                        }
                      }
                    }
                  }
                  if (joinArray != null) {
                    if (joinArray.length > 0) {
                      for (var i = 0; i < joinArray.length; i++) {
                        if (joinArray[i] == optionId) {
                          joinArray.splice(i, 1);
                          isJoin = true;
                          break;
                        }
                      }
                    }
                  }
                  if (isFavo == "1") {
                    that.setData({
                      favo: 1
                    })
                  } else if (isFavo == "0") {
                    that.setData({
                      favo: 0
                    })
                  }
                  if (isJoin == "1") {
                    that.setData({
                      join: 1
                    })
                  } else if (isJoin == "0") {
                    that.setData({
                      join: 0
                    })
                  }
                },
                error: function (error) {
                  console.log(error)
                }
              });
            }
            //查询活动信息
            var Diary = Bmob.Object.extend("Events");
            var query = new Bmob.Query(Diary);
            query.equalTo("objectId", optionId);//上个页面传过来的id和活动的id相同时
            query.include("publisher");
            query.find({
              success: function (result) {
                var title = result[0].get("title");
                console.log("查询到这个活动的标题是"+title);
                var content = result[0].get("content");
                var publisher = result[0].get("publisher");
                var acttype = result[0].get("acttype");
                var acttypename = getTypeName(acttype);
                var isShow = result[0].get("isShow");
                var price = result[0].get("price");
                var agelimit = result[0].get("agelimit")
                var rice = result[0].get("rice");
                var hours = result[0].get("hours");
                var createdAt = result[0].createdAt;
                var pubtime = util.getDateDiff(createdAt); 
                var peoplenum = result[0].get("peoplenum");
                var joinnumber = result[0].get("joinnumber"); //已经加入的人数
                var publisherName = publisher.myname;
                var objectIds = publisher.id; 
                var publisherPic;
                var url;
                if (publisher.userPic) {
                  publisherPic = publisher.userPic;
                }
                else {
                  publisherPic = "/static/images/icon/user_defaulthead@2x.png";
                }
                if (publisher.id == ress.data) {
                  that.setData({
                    isMine: true
                  })
                };
                 that.setData({
                  listTitle: title,
                  listContent: content,
                  publishTime: pubtime,
                  acttype: acttype,
                  acttypename: acttypename,
                  price: price,
                  agelimit: agelimit,
                  hours: hours,
                  rice: rice,
                  publisherName: publisherName,
                  peoplenum: peoplenum,
                  isShow: isShow,
                  joinnumber: joinnumber,
                  publisherPic: publisherPic,
                  objectIds: objectIds,
                  loading: true
                })
                that.commentQuery(result[0]);
                // that.joinDetail(result[0]);
                //that.likerDetail(result[0]);
                that.eventMore(result[0]);
              },
              error: function (error) {
                that.setData({
                  loading: true
                })
                console.log(error);
              }
            })
          }
        },
      })
    }
  },
  

  
  //--------------查询活动扩展信息------------------
  eventMore: function (event) {
    var Diary = Bmob.Object.extend("EventMore");
    var query = new Bmob.Query(Diary);
    query.equalTo("event", event);
    query.find({
      success: function (result) {
        var id = result[0].id;
        var eventMoreId = id;
        var statusname = result[0].get("Statusname");
        var actstatus = result[0].get("Status");
        var url;
        var qrcode = result[0].get("qrcode");
        if (qrcode) {
          url = result[0].get("qrcode")._url;
        }
        else {
          url = null;
        }
        that.setData({
          eventMoreId: id,
          statusname: statusname,
          actstatus: actstatus,
          statusIndex: actstatus,
          qrcode: url,
        })
      }
    })
  },
  //----------------------------------
  //查询评论
  commentQuery: function (event) {
    var self = this;
    commentlist = new Array();
    var Comments = Bmob.Object.extend("Comments");
    var queryComment = new Bmob.Query(Comments);
    queryComment.equalTo("event", event);
    queryComment.limit(self.data.comPage);
    queryComment.skip(self.data.comPage * self.data.comCurPage);
    queryComment.descending("createAt");
    queryComment.include("publisher");
    queryComment.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          var id = result[i].id;
          var pid = result[i].get("olderComment"); //被评论的评论
          var uid = result[i].get("publisher").objectId; //评论人的id
          var content = result[i].get("content");
          var created_at = result[i].createdAt;
          var pubtime = util.getDateDiff(created_at);
          var olderUserName;
          var userPic = result[i].get("publisher").userPic;
          var nickname = result[i].get("publisher").nickname;
          if (pid) {
            pid = pid.id;
            olderUserName = result[i].get("olderUserName");
          }
          else {
            pid = 0;
            olderUserName = "";
          }
          var jsonA;
          jsonA = {
            "id": id || '',
            "content": content || '',
            "pid": pid || '',
            "uid": uid || '',
            "created_at": pubtime || '',
            "pusername": olderUserName || '',
            "username": nickname || '',
            "avatar": userPic || '',
          }
          commentlist.push(jsonA)
          that.setData({
            commentList: commentlist,
            
            loading: true
          })
        }
      },
      error: function (error) {
        common.dataLoadin(error, "loading");
        console.log(error);
      }
    });
  },

  //-----------------------------------------------------------
  showCommentDialog: function (e) {//显示我要评论弹窗
    this.setData({
      showCommentDialog: true,
      commentInputHolder: typeof e == 'string' ? e : "请输入评论内容",
    })
  },
  hideCommentDialog: function () {//隐藏我要评论弹窗
    this.setData({
      showCommentDialog: false,
      isToResponse: false
    });
  },

  commentText: function (e) {//评论内容赋值
    commentText = e.detail.value
  },

  //点击评论itam
  commentTap: function (e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let commentActions;
    if (item.uid == wx.getStorageSync('user_id')) {//自己的评论，可以删除
      commentActions = ["删除"]
    } else {
      commentActions = ["回复"]
    }
    wx.showActionSheet({
      itemList: commentActions,
      success: function (res) {
        let button = commentActions[res.tapIndex];
        if (button == "回复") {
          that.setData({
            pid: item.uid,
            isToResponse: true,
            responseName: item.username
          })

          that.showCommentDialog("回复" + item.username + "：");
        } else if (button == "删除") {
          //删除评论
          var Comments = Bmob.Object.extend("Comments");
          var comment = new Bmob.Query(Comments);
          comment.get(item.id, {
            success: function (result) {
              result.destroy({
                success: function (res) {
                  common.dataLoading("删除成功", "success");
                  console.log("删除成功");

                },
                error: function (res) {
                  console.log("删除评论错误");
                }
              })
            }
          })
          //活动表中评论数量-1
          var Events = Bmob.Object.extend("Events");
          var queryEvents = new Bmob.Query(Events);
          queryEvents.get(optionId, {
            success: function (object) {
              // object.set("commentnum", object.get("commentnum") - 1);
              // object.save();
            }
          })
          that.onShow();
        }
      }
    });
  },

  //评论活动
  publishComment: function (e) {
    let that = this;
    var isReply = false;
    if (!commentText || commentText.length == 0) {
      this.setData({
        showTopTips: true,
        TopTips: '请输入评论内容'
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    } else {
      that.setData({
        isdisabled: true,
        commentLoading: true
      })
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          that.setData({
            commentLoading: false
          })
          var queryUser = new Bmob.Query(Bmob.User);
          //查询单条数据,第一个参数是这条数据的objectId的值
          queryUser.get(ress.data, {
            success: function (userObject) {
              //查询成功,调用get 方法获取对应属性的值
              var Comments = Bmob.Object.extend("Comments");
              var comment = new Comments();
              var Events = Bmob.Object.extend("Events");
              var event = new Events();
              event.id = optionId;
              var me = new Bmob.User();
              me.id = ress.data;
              comment.set("publisher", me);
              comment.set("event", event);
              comment.set("content", commentText);
              console.log("commentText=" + commentText);
              if (that.data.isToResponse) { //如果是回复的评论
                isReply = true;
                var olderName = that.data.responseName;
                var Comments1 = Bmob.Object.extend("Comments");
                var comment1 = new Comments1();
                comment1.id = that.data.pid; //评论的评论Id
                comment.set("olderUserName", olderName);
                comment.set("olderComment", comment1);
              }
              //添加数据,第一个路口参数是null
              comment.save(null, {
                success: function (res) {
                  var queryEvents = new Bmob.Query(Events);
                  //查询单条数据,敌一个参数就是这条数据的objectId
                  queryEvents.get(optionId, {
                    success: function (object) {
                      // object.set("commentnum", object.get("commentnum") + 1);
                      // object.save();

                      var isme = new Bmob.User();
                      isme.id = ress.data;
                      var value = wx.getStorageSync("my_avatar")
                      var my_username = wx.getStorageSync("my_username")

                      var Plyre = Bmob.Object.extend("Plyre");
                      var plyre = new Plyre();
                      console.log("isReply=" + isReply);
                      if (isReply) {//如果是回复评论，则消息通知行为存4
                        plyre.set("behavior", 4); //消息通知方式
                        plyre.set("noticetype", "回复");
                      } else {//如果不是回复评论，则是评论活动，消息通知行为存3
                        plyre.set("behavior", 3); //消息通知方式
                        plyre.set("noticetype", "评论");
                      }
                      plyre.set("bigtype", 1)//动态大类,消息类
                      plyre.set("avatar", value);
                      plyre.set("username", my_username);
                      plyre.set("uid", isme);
                      plyre.set("wid", optionId);
                      plyre.set("fid", publisherId);
                      plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
                      //添加数据
                      plyre.save(null, {
                        success: function (result) {
                          //添加成功
                          console.log("isReply3=" + isReply);
                          if (isReply) {
                            common.dataLoading("回复成功", "success");
                            console.log("回复成功");
                          } else {
                            common.dataLoading("评论成功", "success");
                            console.log("评论成功");
                          }
                        },
                        error: function (result, error) {
                          console.log("评论失败");
                        }
                      });
                      that.setData({ commentText: ''})
                      that.hideCommentDialog();
                      that.onShow();
                    },
                    error: function (object, error) {
                      //查询失败
                      console.log(error);
                    }
                  });
                  that.setData({
                    publishContent: "",
                    isToResponse: false,
                    responeContent: "",
                    
                    isdisabled: false,
                    commentLoading: false
                  })
                },
                error: function (gameScore, error) {
                  common.dataLoading(error, "loading");
                  that.setData({
                    publishContent: "",
                    isToResponse: false,
                    responeContent: "",
                    isdisabled: false,
                    commentLoading: false
                  })
                }
              });
            },
            error: function (object, error) {
              console.log(error);
            }
          });
        },
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  bindKeyInput: function (e) {
    this.setData({
      publishContent: e.detail.value
    })
  },
  //查看发起大图
  seeActBig: function (e) {
    wx.previewImage({
      current: that.data.listPic, // 当前显示图片的http链接
      urls: [that.data.listPic] // 需要预览的图片http链接列表
    })
  },
  //查看发起大图
  seeqrCodeBig: function (e) {
    wx.previewImage({
      current: that.data.qrcode, // 当前显示图片的http链接
      urls: [that.data.qrcode] // 需要预览的图片http链接列表
    })
  },

  joincal:function(){
    var Caldata = Bmob.Object.extend("Caldata");
    var caldata = new Caldata();
    caldata.set("userid", wx.getStorageSync('user_id'));
    caldata.set("actid", optionId);
    caldata.set("actday", that.data.endtime);
    caldata.set("title", that.data.listTitle);
    caldata.save(null, {
      success: function (result) {
        console.log("日记创建成功, objectId:" + result.id);
      },
    });
  },

  delcal:function(){
    var Caldata = Bmob.Object.extend("Caldata");
    var caldata = new Bmob.Query(Caldata);
    caldata.equalTo("userid", wx.getStorageSync('user_id'));
    caldata.equalTo("actid", optionId);
    caldata.destroyAll({
      success:function(){
        common.dataLoading("移除日程成功", "success");
      },
    });
  },


  jihezhuangtai:function(){
    var that = this;
    var publisherId = that.data.publisherId;
    console.log("9876" + optionId);
    wx.navigateTo({
      url: '/pages/showinmap/showinmap?actid=' + optionId + "&pubid=" + publisherId,
    })
  
  },

  //跳转到人员审核
  pass: function () {
    var that = this;
    var publisherId = that.data.publisherId;
    console.log("88888888888888888888888888888888888888888888" + optionId);
    wx.navigateTo({
      url: '/pages/pass/pass?actid=' + optionId + "&pubid=" + publisherId,
    })

  },

  //跳转到人员管理
  manager: function () {
    var that = this;
    var publisherId = that.data.publisherId;
    console.log("88888888888888888888888888888888888888888888" + optionId);
    wx.reLaunch({
      url: '/pages/manager/manager?actid=' + optionId + "&pubid=" + publisherId,
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var optionId = that.data.optionId;
    var publisherId = that.data.publisherId;
    // console.log("名字是是是是"+this.data.price);
    // console.log("名字是是是是" + this.data.hours);
    // console.log("名字是是是是" + this.data.endtime);
    //如果当前用户是发布者或分享者时   就把shid设置为当前用户  
    //如果当前用户是普通用户时        就把shid设置onload得到的shareid
    if (this.data.join == 3 || this.data.issharer == 3) {
      var cshid = wx.getStorageSync('user_id');
    }else{
      var cshid = that.data.sharerId;//普通用户
    }

    return {
      title: this.data.price,  
      path: '/pages/detail/detail?actid=' + optionId + "&pubid=" + publisherId + "&shid=" + cshid,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
          
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'fail'
        });
      }
    }
  },


  //是否为空
  isEmptyObject: function (e) {
    var t;
    for (t in e)
      return !1;
    return !0
  },
  // 检测授权状态
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (that.isEmptyObject(authSetting)) {
          // 新用户的提醒
            wx.showModal({
              title: '您好，新朋友',
              content: '如需查看活动详细信息,请点击确定后登陆，最后重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../start/start?actid=' + optionId + "&pubid=" + publisherId,
                  });
                }
              }
            })
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 不是第一次授权但是授权关闭的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '您好，新朋友',
              content: '如需查看活动详细信息,请点击确定后登陆，最后重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../start/start?actid=' + optionId + "&pubid=" + publisherId,
                  });
                }
              }
            })
          }
        }
      }
    });
  },


  //-----------------加入与收藏------------
  //现在加入功能
  click_join: function (event) {
    var join = that.data.join;
    if (that.data.peoplenum > 0 && (that.data.peoplenum - that.data.joinnumber) <= 0) { //如果人加入满了
      wx.showModal({
        title: '温馨提示',
        content: '此活动参加人数已满',
        showCancel: true,
      })
    } else if (join == "3") { //如果是自己的发起,弹出改变活动状态的弹窗
      this.setData({ 
        showStuDialog: true
      });
    } else if (join == "0") {//如果没有加入，弹出联系表单  跳转到报名页面
      this.setData({
        showDialog: !this.data.showDialog
      });
    } else if (join == "1") { //如果已经加入，则不弹出表单，点击取消加入（删除有关消息）
      wx, wx.showModal({
        title: '温馨提示',
        content: '确定退出活动吗？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {//如果点击确认
            that.setData({ 
              status: 0
            });

            //先删除联系表里的数据
            wx.getStorage({
              key: 'user_id',
              success: function (ress) {
                var me = new Bmob.User();
                me.id = ress.data;
                var Events = Bmob.Object.extend("Events");
                var event = new Events();
                event.id = optionId;
                var Diary = Bmob.Object.extend("Contacts");
                var query = new Bmob.Query(Diary);
                query.equalTo("currentUser", me);
                query.equalTo("event", event);
                query.destroyAll({
                  success: function () {
                    //删除成功
                    console.log("删除联系表中的数据成功");
                    that.setData({
                      join: 0,
                    })
                  },
                  error: function (err) {
                    console.log("删除联系表中的数据失败");
                    // 删除失败
                  }
                })
                //取消加入之后生成消息存在表中，默认未未读
                var isme = new Bmob.User();
                isme.id = ress.data;
                var value = wx.getStorageSync("my_avatar")
                var my_username = wx.getStorageSync("my_username")
                var Plyre = Bmob.Object.extend("Plyre");
                var plyre = new Plyre();
                plyre.set("behavior", 6); //消息通知方式
                plyre.set("noticetype", "取消参加");
                plyre.set("bigtype", 2)//动态大类,消息类
                plyre.set("avatar", value); //我的头像
                plyre.set("username", my_username); // 我的名称
                plyre.set("uid", isme);
                plyre.set("wid", optionId); //活动ID
                plyre.set("fid", publisherId); //
                plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
                plyre.save();
                //将取消参加的人的消息写入活动表中,并更新参加人数
                var Diary = Bmob.Object.extend("Events");
                var queryLike = new Bmob.Query(Diary);
                queryLike.equalTo("objectId", optionId);
                queryLike.find({
                  success: function (result) {
                    var joinArray = result[0].get("joinArray");
                    for (var i = 0; i < joinArray.length; i++) {
                      if (joinArray[i] == ress.data) {
                        joinArray.splice(i, 1);
                        result[0].set('joinnumber', result[0].get('joinnumber') - 1);
                        break;
                      }
                    }
                    result[0].save();
                  }
                })
              },
            })

            //从用户表中删除加入信息
            wx.getStorage({
              key: 'my_username',
              success: function (ress) {
                var my_username = ress.data;
                wx.getStorage({
                  key: 'user_openid',
                  success: function (res) { //将该文章的Id添加到我的收藏中，或者删除
                    var openid = res.data;
                    var user = Bmob.User.logIn(openid, openid, {
                      success: function (user) {
                        var joinArray = user.get("eventJoin");
                        if (joinArray.length > 0) {
                          for (var i = 0; i < joinArray.length; i++) {
                            if (joinArray[i] == optionId) { //如果我已经收藏这个活动,再次点击应该是取消收藏
                              joinArray.splice(i, 1);
                              break;
                            }
                          }
                        }
                        user.set("eventJoin", joinArray);
                        
                        user.save(null, {
                          success: function () {
                            common.dataLoading("取消参加成功", "success");
                          },
                          error: function (error) {
                            console.log("取消参加失败");
                          }
                        })
                        that.onShow();
                      }
                    });
                  },
                })
              },
            })

            
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  //关闭弹出联系表单
  closeJoin: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  
  //关闭修改联系信息弹窗
  closeUpdJoin: function () {
    this.setData({
      showUpdDialog: false
    });
  },

  //关闭弹出改变状态表单
  closeChange: function () {
    this.setData({
      showStuDialog: false
    });
  },

  //改变发起状态index
  changeStatus:function(e){
    this.setData({
      statusIndex: e.detail.value
    })
  },

  //改变联系方式
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value
    })
  },
  //改变修改信息时的联系方式
  updjoinChange: function (e) {
    this.setData({
      jocountIndex: e.detail.value
    })
  },

//改变活动进行状态操作
  stuSubmit:function(event){
    var statusIndex = that.data.statusIndex;
    if (statusIndex == 0) {
      var Statusname = "报名中";
    } else if (statusIndex == 1) {
      var Statusname = "进行中";
    } else if (statusIndex == 2) {
      var Statusname = "已结束";
    }
    var Diary = Bmob.Object.extend("EventMore");
    var query = new Bmob.Query(Diary);

    query.get(eventMoreId, {
      success: function (result) {
        result.set("Status", Number(statusIndex));
        result.set("Statusname", Statusname);
        result.save();
        if (Statusname=="已结束"){ //如果活动状态为已结束，该活动将撤离首页
          var Events = Bmob.Object.extend("Events");
          var evnet = new Bmob.Query(Events);
          
          evnet.get(optionId, {
            success: function (result) {
              result.set("isShow", 0);
              result.set("Status", 1);//1代表活动结束标志
              result.save();
              console.log("撤离成功");
            },
            error: function (object, error) {
              console.log("撤离失败" + error);
            }
          });
        }

        if (Statusname == "报名中") { //
          var Events = Bmob.Object.extend("Events");
          var evnet = new Bmob.Query(Events);
          
          evnet.get(optionId, {
            success: function (result) {
              
              result.set("Status", 0);//0代表报名中
              result.save();
              console.log("撤离成功");
            },
            error: function (object, error) {
              console.log("撤离失败" + error);
            }
          });
        }

        that.setData({
          showStuDialog: false
        })
        console.log("改变状态成功");
        common.dataLoading("改变成功", "success");
      }, 
      error: function (object, error) {
        console.log("改变状态失败"+error);
      }
    });
    that.onShow();
  },

  //加入操作
  joinSubmit: function (event) {
    var that = this;
    var formId = event.detail.formId;//获取加入者的formid并与报名者openid关联
    console.log("这里的formid是" + formId);
    util.dealFormIds(formId);
    // let data = {
    //   formid: formId,
    //   expiretime: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    // }
    var join = that.data.join;
    if (join == "0") { // 未加入，点击加入
      that.setData({
        join: 1
      })
    }
    else if (join == "1") { //已加入，点击取消加入
      that.setData({
        join: 0
      })
    }
    var realname = event.detail.value.realname;
    var realnumber = event.detail.value.realnumber;
    var realinfo = event.detail.value.realinfo;
    var wxReg = new RegExp("^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$");
    var qqReg = new RegExp("[1-9][0-9]{4,}");
    var phReg = new RegExp("0?(13|14|15|17|18|19)[0-9]{9}");
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
    if (realname == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入真实姓名'
      });
    } else if (realname != "" && !nameReg.test(realname)) {
      this.setData({
        showTopTips: true,
        TopTips: '真实姓名一般为2-4位汉字'
      });
    } else if (realnumber == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入联系方式'
      });
    } else {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var checkArray = new Array;
          var Contacts = Bmob.Object.extend("Contacts");
          var contact = new Contacts();
          var Events = Bmob.Object.extend("Events");
          var event = new Events();
          event.id = optionId;
          console.log("当前事件的eventid是" + event.id);

          var moreinfoid = wx.getStorageSync('moreinfoid');
          var Moreinfo = Bmob.Object.extend("Moreinfo");
          var info = new Moreinfo();
          info.id = moreinfoid;

          var me = new Bmob.User();
          me.id = ress.data;

          var pub = new Bmob.User();
          pub.id = publisherId;

          var sharer = new Bmob.User();
          sharer.id = sharerId; 

          //var value = wx.getStorageSync("my_avatar");
          contact.set("publisher", pub);//活动发起者
          contact.set("currentUser", me);//当前用户
          contact.set("moreinfo", info);//当前用户的更多资料
          contact.set("event", event);//当前事件
          contact.set("checkout", checkArray);//
          contact.set("isshare", "6");
          contact.set("ispass", 2);//占位
          //contact.set("title", that.data.listTitle);//当前事件的名称
          contact.set("sharer", sharer);//分享者
          if (that.data.isSrc == true) {
            var name = that.data.myphoto; //上传图片的别名
            var myphoto = new Bmob.File(name, that.data.myphoto);
            myphoto.save();
            contact.set("myphoto", myphoto);
          }
          if (that.data.isSrcc == true) {
            var mysecurityname = that.data.mysecurity; //上传保安证图片的别名
            var mysecurityphoto = new Bmob.File(mysecurityname, that.data.mysecurity);
            mysecurityphoto.save();
            contact.set("mysecurity", mysecurityphoto);
          }
          if (that.data.isSrccc == true) {
            var mycardname = that.data.mycard; //上传证图片的别名
            var mycardphoto = new Bmob.File(mycardname, that.data.mycard);
            mycardphoto.save();
            contact.set("mycard", mycardphoto);
          }
          contact.save(null, {
            success: function () {
              that.setData({
                showDialog: !that.data.showDialog
              })
              console.log("写入联系表成功");
            },
            error: function (error) {
              console.log(error);
            }
          });


          //查询当前联系人的moreinfo表ID把当前联系人的个人资料保存在maorinfo表中  以及把关系保存在contacts表中
          console.log("userid is " + ress.data);
          var Moreinfo = Bmob.Object.extend("Moreinfo");
          var query = new Bmob.Query(Moreinfo);
          query.equalTo("users", ress.data);
          query.first({
            success: function (result) {
              var objectid = result.id;
              result.set("realname", realname); //加入的人的真实姓名
              result.set("realnumber",realnumber);
              result.set("realinfo",realinfo);
              result.save();
              that.setData({
                "objectid": objectid,
                "realname": realname,
                "realnumber": realnumber,
                "realinfo": realinfo,
              });
              wx.setStorage({
                key: 'realname',
                data: realname,
              });
              wx.setStorage({
                key: 'realnumber',
                data: realnumber,
              });
              wx.setStorage({
                key: 'realinfo',
                data: realinfo,
              });
            }
          });


          //加入之后生成消息存在表中，默认未未读
          var isme = new Bmob.User();
          isme.id = ress.data;
          var value = wx.getStorageSync("my_avatar")
          var my_username = wx.getStorageSync("my_username")
          var Plyre = Bmob.Object.extend("Plyre");
          var plyre = new Plyre();
          plyre.set("behavior", 5); //消息通知方式
          plyre.set("noticetype", "参加活动");
          plyre.set("bigtype", 2)//动态大类,消息类
          plyre.set("avatar", value); //我的头像
          plyre.set("username", my_username); // 我的名称
          plyre.set("uid", isme);
          //plyre.set('contactinfo',isme)
          plyre.set("wid", optionId); //活动ID
          plyre.set("fid", publisherId); //
          console.log("fids=" + publisherId);
          plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
          plyre.save();
          //将参加的人的消息写入活动表中,并更新参加人数
          var Diary = Bmob.Object.extend("Events");
          var queryLike = new Bmob.Query(Diary);
          queryLike.equalTo("objectId", optionId);
          queryLike.find({
            success: function (result) {
              var joinArray = result[0].get("joinArray");
              joinArray.push(ress.data);
              result[0].set('joinnumber', result[0].get('joinnumber') + 1);
              result[0].save();
            }
          });


          //报名成功后发模板消息给分享者，在page路径中传入报名者的id和这个事件的id
          var userid = ress.data;//当前用户ID
          let actid = optionId;//当前活动ID
          let pubid = publisherId;//发布者ID
          let shid = sharerId;//分享者ID
          //给分享者发消息
          var moreinfo = Bmob.Object.extend("Moreinfo");
          var query = new Bmob.Query(moreinfo);
          query.equalTo("users", shid);//这个粉丝的id
          query.include("users");
          query.first({
            success: function (res) {//取出这个分享者的formid和openid向这个粉丝发送模板消息

              var formidArray = res.get("formId");
              var openid = res.get("users").userData.openid;
              console.log("idss=" + formidArray);
              console.log("idsssss=" + openid);
              var tmp = parseInt(new Date().getTime() / 1000);
              if (formidArray[0].expiretime < tmp || formidArray[0].formid.split(',')[0] == "undefined" || formidArray[0].formid == "") {
                formidArray.shift();//删除数组第一项后继续取出当前数组的第一项
                var formId = formidArray[0].formid.split(',').shift();//取出当前数组的第一个formid
                //从formid数组中删除第一个元素并保留当前数组转换成字符串
                let data = {
                  formid: formidArray[0].formid.split(',').slice(1).toString(),
                  expiretime: formidArray[0].expiretime
                }
                formidArray.splice(0, 1, data);
              } else {//把字符串转换成数组然后删除第一个元素保存数组再转换成字符串保存当前数组
                var formId = formidArray[0].formid.split(',').shift();//取出当前数组的第一个formid
                //从formid数组中删除第一个元素并保留当前数组转换成字符串
                let data = {
                  formid: formidArray[0].formid.split(',').slice(1).toString(),
                  expiretime: formidArray[0].expiretime
                }
                formidArray.splice(0, 1, data);
              };
              //发送模板消息
              var temp = {
                "touser": openid,//这里是填写分享者的openid
                "template_id": "Caw00l_0eeznvUqN-_PlTkncFLmMTMCa4g4K02YvEJQ",//这里填写模板ID，可以在小程序后台配置
                "page": "pages/review/review?actid=" + actid + "&joinerid=" + userid + "&pubid=" + pubid,//点击后跳转的页面需要活动ID和报名者id即当前用户ID
                "form_id": formId,//这里填写发起者的formid
                "data": {
                  "keyword1": {
                    "value": realname
                  },
                  "keyword2": {
                    "value": that.data.listTitle
                  }
                },
                "emphasis_keyword": ""
              }
              Bmob.sendMessage(temp).then(function (obj) {
                console.log('发送成功')
              },
                function (err) {
                  // console.log("发送失败");
                  // console.log(err)
                  common.showTip('发送失败' + err)
                });
              res.set("formId", formidArray);
              res.save();
            }
          });



        },
      })

      
    wx.getStorage({
      key: 'user_openid',
      success: function (res) {
        var openid = res.data;
        var user = Bmob.User.logIn(openid, openid, {
          success: function (user) {
            var joinArray = user.get("eventJoin");
            var isJoin = false;
            if (joinArray == null) {
              joinArray = [];
            }
            if (joinArray.length > 0) {
              for (var i = 0; i < joinArray.length; i++) {
                if (joinArray[i] == optionId) {
                  joinArray.splice(i, 1);
                  isJoin = true;
                  break;
                }
              }
              if (isJoin == false) {
                joinArray.push(optionId);
              }
            } else {
              joinArray.push(optionId);
            }
            user.set("eventJoin", joinArray);
            user.set("myname", realname);//上传我的名字
            user.save(null, {
              success: function () {
                if (isJoin == false) {
                  common.dataLoading("提交成功,请等待审核", "success");
                } else if (isJoin == true) {
                  common.dataLoading("取消参加成功", "success");
                }
              },
              error: function (error) {//参加失败后从联系人表中删除这个人的信息  不发送申请通知
                console.log("参加失败");
                console.log(error);
                console.log("参加失败");
                common.dataLoading("参加失败", "success");
              }
            })
            that.onShow();
          }
        });
      },
    })        
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  //修改联系信息操作
  updSubmit: function (event) {//已经废弃UI
    var jocountIndex = that.data.jocountIndex;
    var realname = event.detail.value.joinname;
    var realhight = event.detail.value.joinhight;
    var realnumber = event.detail.value.joinnumber;
    var contactValue = event.detail.value.jocontactValue;
    var wxReg = new RegExp("^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$");
    var qqReg = new RegExp("[1-9][0-9]{4,}");
    var phReg = new RegExp("0?(13|14|15|17|18|19)[0-9]{9}");
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
    if (realname == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入真实姓名'
      });
    } else if (realname != "" && !nameReg.test(realname)) {
      this.setData({
        showTopTips: true,
        TopTips: '真实姓名一般为2-4位汉字'
      });
    } else if (realnumber == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入联系方式'
      });
    } else {
      var Contacts = Bmob.Object.extend("Contacts");
      var contact = new Bmob.Query("Contacts");
      contact.get(joinpId, {
        success: function (result) {
          result.set("realname", realname);
          result.set("realhight", realhight);
          result.set("realnumber", realnumber);
          result.set("ispass", 2);//占位
          result.save({
            success: function () {
              //加入之后生成消息存在表中，默认未未读
              var isme = new Bmob.User();
              isme.id = wx.getStorageSync("user_id");
              var value = wx.getStorageSync("my_avatar")
              var my_username = wx.getStorageSync("my_username")
              var Plyre = Bmob.Object.extend("Plyre");
              var plyre = new Plyre();
              plyre.set("behavior", 7); //消息通知方式
              plyre.set("noticetype", "修改信息");
              plyre.set("bigtype", 1)//动态大类,通知类
              plyre.set("avatar", value); //我的头像
              plyre.set("username", my_username); // 我的名称
              plyre.set("uid", isme);
              plyre.set("wid", optionId); //活动ID
              plyre.set("fid", publisherId); //
              console.log("fid=" + publisherId)
              plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
              plyre.save();
              console.log("修改成功");
              common.dataLoading("修改成功", "success");
            }, error: function (error) {
              console.log("修改失败");
            }
          });
          that.onShow();
        },
      })
      that.setData({
        showUpdDialog: false
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  //点击收藏或取消收藏
  click_favo: function (event) {
    var favo = that.data.favo;
    if (favo == "3") { //当活动是当前用户发起时 
      var Diary = Bmob.Object.extend("Events");
      var query = new Bmob.Query(Diary);
      if (that.data.actstatus != 2 && that.data.isShow == 1){ //如果当前活动未结束且已经在首页展示
        wx.showModal({
          title: '是否撤离首页?',
          content: '撤离后您的发起将不会在首页展示',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              query.get(optionId, {
                success: function (result) {
                  result.set("isShow", 0);
                  result.save();
                  console.log("撤离成功");
                  common.dataLoading("撤离成功", "success");
                },
                error: function (object, error) {
                  console.log("撤离失败" + error);
                }
              });
              that.onShow();
            }
          }
        })
      } else if (that.data.actstatus != 2 && that.data.isShow == 0) {//如果当前活动未结束且未在首页展示
        wx.showModal({
          title: '是否公开发起?',
          content: '公开后您的发起将会在首页展示',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              query.get(optionId, {
                success: function (result) {
                  result.set("isShow", 1);
                  result.save();
                  console.log("公开成功");
                  common.dataLoading("公开成功", "success");
                },
                error: function (object, error) {
                  console.log("公开失败" + error);
                }
              });
              that.onShow();
            }
          }  
        })
       
      } else if (that.data.actstatus == 2){ //如果当前活动已结束
        wx.showModal({
          title: '温馨提示',
          content: '已结束的发起不能公开到首页',
        })
        return;
      }
    } else if (favo == "0") {
      that.setData({
        favo: 1
      })
    } else if (favo == "1") {
      that.setData({
        favo: 0
      })
    }
    if(favo != "3"){ //如果当前用户不是活动发起者
      wx.getStorage({
        key: 'my_username',
        success: function (ress) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (res) { //将该文章的Id添加到我的收藏中，或者删除
              var openid = res.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (user) {
                  var user_id = wx.getStorageSync("user_id");
                  var favoArray = user.get("eventFavo");
                  var isFavo = false;
                  if (favoArray == null) {
                    favoArray = [];
                  }
                  if (favoArray.length > 0) {
                    for (var i = 0; i < favoArray.length; i++) {
                      if (favoArray[i] == optionId) { //如果我已经收藏这个活动,再次点击应该是取消收藏
                        favoArray.splice(i, 1);
                        isFavo = true;
                        that.downFavo(user_id); //删除收藏表里的数据
                        break;
                      }
                    }
                    if (isFavo == false) { //如果没有收藏过，点击收藏
                      favoArray.push(optionId);
                      that.upFavo(user_id); //收藏表里添加数据
                    }
                  } else {
                    favoArray.push(optionId);
                    that.upFavo(user_id); //收藏表里添加数据
                  }
                  user.set("eventFavo", favoArray);
                  user.save(null, {
                    success: function () {
                      if (isFavo == false) {
                        common.dataLoading("收藏成功", "success");
                      } else if (isFavo == true) {
                        common.dataLoading("取消收藏成功", "success");
                      }
                    },
                    error: function (error) {
                      console.log("失败");
                    }
                  })
                }
              });
            },
          })
        },
      })
    }
  },
  //***************************************************************************** */
  //收藏向Favos 表中添加数据
  upFavo: function (userid) {
    var Favos = Bmob.Object.extend("Favos");
    var favo = new Favos();
    var me = new Bmob.User();
    me.id = userid;
    var Events = Bmob.Object.extend("Events");
    var event = new Events();
    event.id = optionId;
    favo.set("favor", me);
    favo.set("event", event);
    favo.save(null, {
      success: function () {
        console.log("写入收藏表成功");
      },
      error: function (error) {
        console.log("写入收藏表失败");
        console.log(error);
      }
    });
  },
  //取消收藏向 Favos 表中删除数据
  downFavo: function (userid) {
    var me = new Bmob.User();
    me.id = userid;
    var Events = Bmob.Object.extend("Events");
    var event = new Events();
    event.id = optionId;
    var Favos = Bmob.Object.extend("Favos");
    var favo = new Bmob.Query(Favos);
    favo.equalTo("favor", me);
    favo.equalTo("event", event);
    favo.destroyAll({
      success: function () {
        console.log("删除收藏表中的数据成功");
      },
      error: function (error) {
        console.log("删除收藏表的数据失败");
        console.log(error);
      }
    })
  },

  //-----------------------------------------------------------------------------
  //删除活动
  deleteEvent: function () {
    wx.showModal({
      title: '是否删除该活动?',
      content: '删除后将不能恢复',
      showCancel: true,
      confirmColor: "#a07c52",
      cancelColor: "#646464",
      success: function (res) {
        if (res.confirm) {
          //删除此活动后返回上一页
          var Diary = Bmob.Object.extend("Events");
          var queryEvent = new Bmob.Query(Diary);
          queryEvent.get(optionId, {
            success: function (result) {
              result.destroy({
                //删除成功
                success: function (myObject) {
                  common.dataLoading("删除成功", "success", function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                },
                //删除失败
                error: function (myObject, error) {
                  console.log(error);
                }
              })
            },
            error: function (object, error) {
              console.log(error);
            }
          });
        } else {

        }
      }
    })
  },
  //----------------------悬浮按钮操作--------------------------------------
  initButton(position = 'bottomRight') {
    this.setData({
      opened: !1,
    })

    this.button = $wuxButton.init('br', {
      position: position,
      buttons: [
        {
          label: "群二维码",
          icon: "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/02/e049248040b452cd805877235b8b9e0c.png",
        },
        {
          label: "修改信息",
          icon: "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/02/9134d4a24058705f80a61ec82455fe47.png",
        },
      ],
      buttonClicked(index, item) {
        if (index === 0) {//跳转到上传二维码页面
          let actid = optionId;
          let pubid = publisherId;
            wx.navigateTo({
              url: '/pages/updqr/updqr?actid=' + actid + "&pubid=" + pubid,
            })

          // if (that.data.qrcode == null) { //如果该活动没有上传群二维码
          //   if (that.data.isMe) { //如果是当前用户的发起
          //     wx.showModal({
          //       title: '温馨提示',
          //       content: '该功能正在开发中',
          //       //content: '您还未上传群二维码，如需上传，请点击修改信息',
          //     })
          //   } else {
          //     wx.showModal({
          //       title: '温馨提示',
          //       content: '该功能正在开发中',
          //       //content: '该活动暂未上传群二维码，您可联系发起者建群上传',
          //     })
          //   }
          // } else {//如果该活动上传了群二维码
          //   that.showqrcode();
          // }



        }
        else if (index === 1) {
          let actid = optionId;
          let pubid = publisherId;
          if (that.data.isMe) { //如果是当前用户的发起
            wx.navigateTo({
              url: '/pages/updAct/updAct?actid=' + actid + "&pubid=" + pubid,
            })
          } else {
            that.setData({
              showUpdDialog: true
            })
          }
        }
        return true
      },
      callback(vm, opened) {
        vm.setData({
          opened,
        })
      },
    })
  },
  switchChange(e) {
    e.detail.value ? this.button.open() : this.button.close()
  },
  pickerChange(e) {
    const index = e.detail.value
    const position = this.data.types[index]
    this.initButton(position)
  },

  //上传个人照片
  uploadPic: function () { //选择图标
  var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc: true,
          myphoto: tempFilePaths
        })
      }
    })
  },

  //删除图片
  clearPic: function () { //删除图片
    var that = this;
    that.setData({
      isSrc: false,
      myphoto: ""
    })
  },

  //上传保安证
  uploadmysecurityPic: function () { //选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrcc: true,
          mysecurity: tempFilePaths
        })
      }
    })
  },

  //删除图片
  clearmysecurityPic: function () { //删除图片
    var that = this;
    that.setData({
      isSrcc: false,
      mysecurity: ""
    })
  },

  //上传证
  uploadmycardPic: function () { //选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrccc: true,
          mycard: tempFilePaths
        })
      }
    })
  },

  //删除图片
  clearmycardPic: function () { //删除图片
    var that = this;
    that.setData({
      isSrccc: false,
      mycard: ""
    })
  },

  onGotUserInfo: function (e) {
    var that = this;
    wx.getStorage({
      key: 'user_openid',
      success: function(res) {
        var openid = res.data;
        // 查看是否授权
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var sex = userInfo.gender
                  Bmob.User.logIn(openid, openid, {
                    success: function (user) {
                      user.set("nickname", nickName);
                      user.set("userPic", avatarUrl);
                      user.set('sex', sex);
                      user.save(null,{
                        success: function(user){
                          var user = user.attributes
                          var nickname = user.nickname
                          var sex = user.sex
                          var userPic = user.userPic
                          console.log(user)
                          wx.setStorageSync('my_nick', nickname) 
                          wx.setStorageSync('my_sex', sex)
                          wx.setStorageSync('my_avatar', userPic)
                        }
                      });
                    }
                  }
                  )
                  that.setData({
                    islogin: true,
                    ishere: false
                  })
                }
              })
            }
          }
        })

      },
    })

  },

})
//根据联系方式确定序号
function getContactIndex(name) {
  var accountIndex = 0;
  if (name == "微信号") accountIndex = 0;
  else if (name == "QQ号") accountIndex = 1;
  else if (name == "手机号") accountIndex = 2;
  return accountIndex;
}

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

