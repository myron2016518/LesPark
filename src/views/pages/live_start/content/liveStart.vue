<template>
  <div class="main">
    <p class="title">{{$t('live_star.pc')}}</p>
    <div class="user-profile">
      <p>{{$t('live_star.account')}}</p>
      <div v-if="isLogin">
        <img class="user-avatar" :src="avatar" height="45px" width="45px">
        <div class="user-info">
          <p class="user-nickname">{{nickname}}</p>
          <p class="user-lgid">LesPark ID:{{lgid}}</p>
        </div>
      </div>
      <p v-else class="user-login">{{$t('live_star.noLogin')}}<span class="toLogin"
          @click="Login">{{$t('live_star.login')}}</span></p>
    </div>
    <div class="live-title">
      <p>{{$t('live_star.liveTitle')}}</p><input v-model="liveTitle" type="text" :placeholder="liveTitleHolder"
        :disabled="isLiving||!isLogin">
    </div>
    <div class="live-img">
      <p>{{$t('live_star.liveCover')}}</p>
      <div class="img-select">
        <div class="select-item">
          <input type="radio" v-model="coverType" :disabled="isLiving||!isLogin"
            value="old"><label>{{$t('live_star.oldLiveCover')}}</label>
        </div>
        <div class="select-item">
          <input type="radio" v-model="coverType" :disabled="isLiving||!isLogin" value="new">
          <label>{{$t('live_star.customimg')}}</label>
          <div :class="coverType=='new'?'upload':'cancel'">{{upload.uploadButtonText}}</div>
          <input v-if="coverType=='new'" type="file" @change="uploadCover">
          <p :class="upload.isTip?'tip':'error'">{{upload.uploadTipsText}}</p>
        </div>
      </div>
    </div>
    <div v-show="true" class="address">
      <p>{{$t('live_star.plugFlow')}}</p><input id="address" type="text" :value=address>
      <div class="copy" @click="copyAddress">{{$t('live_star.copy')}}</div>
    </div>
    <div v-show="true" class="code">
      <p>{{$t('live_star.secret')}}</p><input id="code" type="text" :value=code>
      <div class="copy" @click="copyCode">{{$t('live_star.copy')}}</div>
    </div>
    <p v-show="warning" class="warning">{{warning}}</p>
    <div v-if="isLiving" class="button delete-button" @click="stopLiving">{{$t('live_star.finishLive')}}</div>
    <div v-else class="button config-button" @click="getLiveAddress">{{$t('live_star.getLiveAdd')}}</div>
    <div class="rule">
      <p>{{$t('live_star.liveNote')}}</p>
      <p>{{$t('live_star.liveNote1')}} <span @click="jumpToRule">{{$t('live_star.convention')}}</span></p>
      <p>{{$t('live_star.liveNote2')}}</p>
      <p>{{$t('live_star.liveNote3')}}</p>
      <p>{{$t('live_star.liveNote4')}}</p>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import ajax from "Common/ajax";
  import constans from "Constans";
  import util from "Common/util";
  import cookie from "Common/cookie";
  import bus from "Common/events-bus";
  import axios from "axios";

  const userUrl = constans.AllUrl.url.dev;

  export default {
    name: "liveStart",
    components: {},
    data() {
      return {
        isLogin: false,
        avatar: "",
        nickname: "",
        lgid: "",
        liveTitleHolder: "",
        liveTitle: "",
        liveCover: "",
        coverType: "old",
        language: '',
        imgs: [],
        live_obj_id: "",
        // cancelToken:0,
        imgData: {
          accept: "image/jpeg, image/png, image/jpg"
        },
        upload: {
          uploadTips: true,
          uploadButtonText: "",
          uploadTipsText: "",
          isTip: true
        },
        address: "",
        code: "",
        isLiving: false,
        warning: ""
      };
    },
    mounted() {
      var that = this;
      bus.$on("userLogOut", res => {
        this.isLogin = res;
      });
      bus.$on("userLogin", res => {
        this.avatar = cookie.getCookie("avatar");
        this.nickname = cookie.getCookie("nickname");
        this.lgid = cookie.getCookie("lgid");
        this.isLogin = true;
        this.init();
      })
      that.language = cookie.getCookie('language')
      if (that.language == '简体中文') {
        window.document.title = '欢迎来到live_start',
          that.liveTitleHolder = '请输入直播标题（选填）',
          that.upload.uploadButtonText = '上传自定义图片'
      }
      else if (that.language == '繁體中文') {
        window.document.title = '歡迎來到live_start',
          that.liveTitleHolder = '請輸入直播標題（選填）',
          that.upload.uploadButtonText = '上傳自定義圖片'
      }
      else if (that.language == 'English') {
        window.document.title = 'Welcome to live_start',
          that.liveTitleHolder = 'Please enter the live title (optional)',
          that.upload.uploadButtonText = 'Upload a custom image'
      }
      bus.$on('bannerImg', function (msg) {
        that.language = msg;
        if (msg == '简体中文') {
          window.document.title = '欢迎来到live_start',
            that.liveTitleHolder = '请输入直播标题（选填）',
            that.upload.uploadButtonText = '上传自定义图片'
        }
        if (msg == '繁體中文') {
          window.document.title = '歡迎來到live_start',
            that.liveTitleHolder = '請輸入直播標題（選填）',
            that.upload.uploadButtonText = '上傳自定義圖片'
        }
        if (msg == 'English') {
          window.document.title = 'Welcome to live_start',
            that.liveTitleHolder = 'Please enter the live title (optional)',
            that.upload.uploadButtonText = 'Upload a custom image'
        }

      })
    },
    created() {
      if (util.liveStartisLogin() == true) {
        this.avatar = cookie.getCookie("avatar");
        this.nickname = cookie.getCookie("nickname");
        this.lgid = cookie.getCookie("lgid");
        this.isLogin = true;
        this.init();
      } else {
        this.isLogin = false;
        this.$bus.emit("noLoginInfo", true);
      }
    },
    updated() {
      // let _ = this;
      // if (util.liveStartisLogin() == true) {
      //   this.avatar = cookie.getCookie("avatar");
      //   this.nickname = cookie.getCookie("nickname");
      //   this.lgid = cookie.getCookie("lgid");
      //   _.isLogin = true;
      //   this.init();
      // }
    },
    computed: {},
    methods: {
      //初始化直播信息
      init() {
        ajax
          .Get({
            url: userUrl + '/v2/pc_live_status',
            //url: "http://106.75.76.204:10004/v2/pc_live_status",
            headers: {
              bundle_id: "pc",
              'bundle-id': 'pc',
              lang: "zh-hans",
              user_id:
                cookie.getCookie("lespark_user_id") != ""
                  ? cookie.getCookie("lespark_user_id")
                  : "",
              token:
                cookie.getCookie("lespark_token") != "" ? cookie.getCookie("lespark_token") : ""
            }
          })
          .then(res => {
            if (res.error == 0) {
              if (res.data.is_living == true) {
                this.live_obj_id = res.data.live_obj_id;
                this.isLiving = true;
                if (this.language == '简体中文') {
                  this.warning = "您正在使用手机直播，点击结束";
                  this.liveTitleHolder = "您正在直播";
                } else if (this.language == '繁體中文') {
                  this.warning = "您正在使用手機直播，點擊結束";
                  this.liveTitleHolder = "您正在直播";
                } else {
                  this.warning = "You are using a mobile phone live, click to end";
                  this.liveTitleHolder = "You are broadcasting live";
                }

                if (res.data.pc_live && res.data.pc_live == true) {
                  if (this.language == '简体中文') {
                    this.warning = "您正在直播，点击结束";
                  } else if (this.language == '繁體中文') {
                    this.warning = "您正在直播，點擊結束";
                  } else {
                    this.warning = "You are broadcasting live, click to end";
                  }

                  this.address = res.data.push_url;
                  this.code = res.data.secret_key;
                }
              }
            }
          });
      },
      //登录
      Login() {
        this.$bus.emit("noLoginInfo", true);
      },
      //关播
      stopLiving() {
        ajax
          .Ajax({
            type: "put",
            url:
              userUrl + "/impromptu_management?live_obj_id=" + this.live_obj_id,
            // url:
            //   "http://106.75.76.204:10004/impromptu_management?live_obj_id=" +
            //   this.live_obj_id,
            headers: {
              bundle_id: "pc",
              'bundle-id': 'pc',
              lang: "zh-hans",
              user_id:
                cookie.getCookie("lespark_user_id") != ""
                  ? cookie.getCookie("lespark_user_id")
                  : "",
              token:
                cookie.getCookie("lespark_token") != "" ? cookie.getCookie("lespark_token") : ""
            }
          })
          .then(res => {
            if (res.error == 0) {
              this.isLiving = false;
              this.address = "";
              this.code = "";
              this.warning = "";
              if (this.language == '简体中文') {
                this.liveTitleHolder = "请输入直播标题（选填）";
              } else if (this.language == '繁體中文') {
                this.liveTitleHolder = "請輸入直播標題（選填）";
              } else {
                this.liveTitleHolder = "Please enter the live title (optional)";
              }

            } else {
              //todo
            }
          });
      },
      jumpToRule() {
        if (this.language == '简体中文') {
          window.open("http://h5.lespark.cn/live_rule_one_page");
        } else if (this.language == '繁體中文') {
          window.open("http://h5.lespark.cn/live_rule_one_page_tw");
        } else {
          window.open("http://h5.lespark.cn/live_rule_one_page_en");
        }

      },
      //获取直播地址
      getLiveAddress() {
        if (this.isLogin) {
          ajax
            .Get({
              url:
                userUrl +
                "/v2/pc_live_push_url?is_audio=0&live_management_type=3&name=" +
                this.liveTitle +
                "&pic=" +
                this.liveCover,
              // url:
              //   "http://106.75.76.204:10004/v2/pc_live_push_url?is_audio=0&live_management_type=3&name=" +
              //   this.liveTitle +
              //   "&pic=" +
              //   this.liveCover,
              headers: {
                bundle_id: "pc",
                'bundle-id': 'pc',
                lang: "zh-hans",
                user_id:
                  cookie.getCookie("lespark_user_id") != ""
                    ? cookie.getCookie("lespark_user_id")
                    : "",
                token:
                  cookie.getCookie("lespark_token") != "" ? cookie.getCookie("lespark_token") : ""
              }
            })
            .then(res => {
              if (res.error == 0) {
                this.address = res.data.push_url;
                this.code = res.data.secret_key;
                return 0;
              } else {
                alert(res.msg);
                return 1;
              }
            })
            .then(res => {
              if (res == 0) {
                let refresh = setInterval(() => {
                  this.init();
                  if (this.isLiving == true) {
                    clearInterval(refresh);
                  }
                }, 5000);
              }
            });
        } else {
          alert("请先登录");
        }
      },
      //上传直播封面
      uploadCover(event) {
        let img1 = event.target.files[0];
        let type = img1.type; //文件的类型，判断是否是图片
        let size = img1.size; //文件的大小，判断图片的大小
        let form = new FormData();
        if (this.imgData.accept.indexOf(type) == -1) {
          if (this.language == '简体中文') {
            alert("请选择png，jpeg，jpg等图片格式");
          } else if (this.language == '繁體中文') {
            alert("請選擇png，jpeg，jpg等圖片格式");
          } else {
            alert("Please select png, jpeg, jpg and other image formats");
          }

          return false;
        }
        if (size > 1048576) {
          if (this.language == '简体中文') {
            this.upload.uploadTipsText = "请选择1MB以内的图片！";
          } else if (this.language == '繁體中文') {
            this.upload.uploadTipsText = "請選擇1MB以內的圖片！";
          } else {
            this.upload.uploadTipsText = "Please select a picture within 1MB!";
          }

          this.upload.isTip = false;
          return false;
        }
        if (this.language == '简体中文') {
          this.upload.uploadTipsText = "上传中";
        } else if (this.language == '繁體中文') {
          this.upload.uploadTipsText = "上傳中";
        } else {
          this.upload.uploadTipsText = "uploading";
        }

        form.append("pic_attach", img1);
        var CancelToken = axios.CancelToken;
        var source = CancelToken.source();
        let config = {
          headers: {
            "Content-Type": "multipart/form-data",
            bundle_id: "pc",
            'bundle-id': 'pc',
            user_id:
              cookie.getCookie("lespark_user_id") != ""
                ? cookie.getCookie("lespark_user_id")
                : "",
            token:
              cookie.getCookie("lespark_token") != "" ? cookie.getCookie("lespark_token") : ""
          },
          cancelToken: source.token
        };
        axios
          .post(userUrl + "/upload_live_bg", form, config)
          .then(res => {
            if (res.status == 200) {
              console.log(res);
              this.liveCover = res.data.data.pic;
              // this.coverType = "old";
              if (this.language == '简体中文') {
                this.upload = {
                  isTips: true,
                  uploadTipsText: "上传成功",
                  uploadButtonText: "重新选择图片"
                };
              } else if (this.language == '繁體中文') {
                this.upload = {
                  isTips: true,
                  uploadTipsText: "上傳成功",
                  uploadButtonText: "重新選擇圖片"
                };
              } else {
                this.upload = {
                  isTips: true,
                  uploadTipsText: "Upload success",
                  uploadButtonText: "Reselect image"
                };
              }

            } else {
              console.log(res);
            }
          })
          .catch(res => {
            if (axios.isCancel(res)) {
              console.log("Request canceled", res.message);
            }
            console.log(res);
            if (this.language == '简体中文') {
              this.upload = {
                isTips: false,
                uploadTipsText: "上传失败",
                uploadButtonText: "重新选择图片"
              };
            } else if (this.language == '繁體中文') {
              this.upload = {
                isTips: false,
                uploadTipsText: "上傳失敗",
                uploadButtonText: "重新選擇圖片"
              };
            } else {
              this.upload = {
                isTips: false,
                uploadTipsText: "upload failed",
                uploadButtonText: "Reselect image"
              };
            }

          });
      },
      //复制相关消息
      copyAddress() {
        var inputText = document.getElementById("address");
        var currentFocus = document.activeElement;
        inputText.focus();
        inputText.setSelectionRange(0, inputText.value.length);
        document.execCommand("copy", false, null);
        currentFocus.focus();
      },
      copyCode() {
        var inputText = document.getElementById("code");
        var currentFocus = document.activeElement;
        inputText.focus();
        inputText.setSelectionRange(0, inputText.value.length);
        document.execCommand("copy", false, null);
        currentFocus.focus();
      }
    }
  };
</script>
<style scoped>
  input[type="file"] {
    height: 25px;
    width: 102px;
    margin-left: -102px;
    opacity: 0;
  }

  input:disabled {
    cursor: not-allowed !important;
  }

  .rule {
    margin: 40px 0 0 0;
  }

  .rule span {
    color: #fa3e54;
    text-decoration: underline;
    cursor: pointer;
  }

  .rule>p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #a8a8a8;
    line-height: 24px;
  }

  .rule>p:first-child {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #4a4a4a;
  }

  .button {
    height: 45px;
    width: 240px;
    text-align: center;
    background: #fcfcfc;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #a8a8a8;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    clear: both;
    margin: 40px 0 0 70px;
  }

  .config-button {
    color: #fa3e54;
    cursor: pointer;
  }

  /* .delete-button {
  cursor: not-allowed;
} */
  .copy {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    margin-left: 25px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 25px;
    height: 25px;
    width: 50px;
    text-align: center;
    cursor: pointer;
  }

  .address>input,
  .code>input {
    height: 25px;
    width: 306px;
    line-height: 25px;
    color: #333;
    font-size: 12px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    outline: none;
    text-indent: 7px;
  }

  .address {
    height: 25px;
    clear: both;
    margin: 42px 0 0 0;
  }

  .code {
    height: 25px;
    clear: both;
    margin: 19px 0 0 0;
  }

  .address>p,
  .code>p {
    /* min-width: 70px; */
    font-size: 14px;
    height: 25px;
    line-height: 25px;
    font-family: PingFangSC-Medium;
    color: #4a4a4a;
    text-align: right;
  }

  .address>p,
  .address>input,
  .address>div {
    float: left;
  }

  .code>p,
  .code>input,
  .code>div {
    float: left;
  }

  .error {
    font-size: 11px;
    color: #fa3e54;
    line-height: 25px;
    margin-left: 5px;
  }

  .tip {
    font-size: 11px;
    color: #333333;
    line-height: 25px;
    margin-left: 5px;
  }

  .upload,
  .cancel {
    height: 25px;
    width: 102px;
    line-height: 25px;
    border-radius: 3px;
    margin-left: 57px;
    font-size: 12px;
    color: #fff;
    text-align: center;
  }

  .upload {
    background: #fa3e54;
    cursor: pointer;
  }

  .cancel {
    background: #d6d6d6;
    cursor: not-allowed;
  }

  .select-item>input,
  .select-item>label,
  .select-item>div,
  .select-item>p {
    float: left;
  }

  .select-item {
    position: relative;
    height: 25px;
  }

  .select-item:first-child {
    margin-bottom: 20px;
  }

  .select-item>label {
    line-height: 25px;
    font-size: 14px;
    color: #9b9b9b;
  }

  input[type="radio"] {
    height: 14px;
    width: 14px;
    margin: 6px 0 0 2px;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    left: 0;
  }

  input[type="radio"]+label::before {
    box-sizing: content-box;
    content: "\a0";
    /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    width: 14px;
    height: 14px;
    margin: 0 5px 3px 0;
    border-radius: 50%;
    border: 1px solid #fa3e54;
    cursor: pointer;
  }

  input[type="radio"]:checked+label::before {
    background-color: #fa3e54;
    height: 12px;
    width: 12px;
    background-clip: content-box;
    box-sizing: content-box;
    padding: 1px;
  }

  .main {
    height: 801px;
    width: 1100px;
    margin: 0 auto;
    font-family: PingFangSC-Regular;
  }

  .title {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #4a4a4a;
    line-height: 33px;
    height: 33px;
    margin: 50px 0 0;
  }

  .user-avatar {
    border-radius: 100%;
    margin-right: 10px;
  }

  .user-profile {
    height: 45px;
    margin: 32px auto 0;
  }

  .user-profile>div {
    overflow: hidden;
  }

  .user-profile>div>div,
  .user-profile>div>img {
    float: left;
  }

  .user-login {
    line-height: 45px;
  }

  .user-profile>p:first-child,
  .live-title>p:first-child {
    float: left;
    font-family: PingFangSC-Medium;
    line-height: 45px;
    margin-right: 5px;
    font-size: 14px;
  }

  .user-lgid {
    color: #a8a8a8;
  }

  .live-title {
    clear: both;
  }

  .toLogin {
    color: #fa3e54;
    text-decoration: underline;
    margin-left: 5px;
    cursor: pointer;
  }

  .login {
    line-height: 45px;
    font-size: 20px;
    color: #333333;
  }

  .live-title {
    height: 45px;
    margin: 31px 0 0 0;
    clear: both;
  }

  .live-title>p,
  .live-title>input {
    float: left;
    line-height: 45px;
    height: 45px;
  }

  .live-title>p {
    font-family: PingFangSC-Medium;
    font-size: 14px;
  }

  .live-title>input {
    width: 280px;
    border: 1px solid #a8a8a8;
    border-radius: 3px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #a8a8a8;
    text-indent: 16px;
    caret-color: #fa3e54;
    outline: none;
  }

  .live-img {
    clear: both;
    height: 70px;
    margin: 60px 0 0 0;
  }

  .live-img>p:first-child {
    float: left;
    font-family: PingFangSC-Medium;
    margin-right: 5px;
    font-size: 14px;
  }

  .live-img>div,
  .live-img>p {
    float: left;
  }

  .warning {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #fa3e54;
    margin: 10px 0 0 122px;
    position: absolute;
  }
</style>