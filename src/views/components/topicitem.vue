<template>
  <div class="ti_main">
    <!-- 用户信息 -->
    <el-row class="ti_header">
      <el-col :span="2"
              v-if="topicinfo.new_role !=='4'">
        <el-badge :value="getRole(topicinfo.new_role)"
                  :type="getRoleColor(topicinfo.new_role)"
                  class="ti_h_1">
          <img class="ti_u_1"
               style="cursor: pointer;"
               @click="gotoUserInfo"
               :src="topicinfo.avatar">
        </el-badge>

      </el-col>
      <el-col :span="2"
              v-else>
        <img class="ti_u_1"
             style="cursor: pointer;"
             @click="gotoUserInfo"
             :src="topicinfo.avatar">
      </el-col>
      <el-col :span="22">
        <p class="ti_name_1"><span style="cursor: pointer;"
                @click="gotoUserInfo">{{topicinfo.nickname}}</span></p>
        <p class="ti_time_1"><span class="ti_time_1_1"
                v-if="topicinfo.is_top_post">置顶</span>
          <span>{{getUserInfoTxt()}}</span>
          <!-- <span>{{getScope()}}</span>
          <span v-if="topicinfo.recommend_reason">{{topicinfo.recommend_reason||''}}</span>
          <span v-if="topicinfo.source==1">{{'来自情侣空间'}}</span> -->
          {{topicinfo.created_at | format}}</p>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <el-row class="ti_content">
      <!-- {{getContentHtml(topicinfo.content)}} -->
      <span v-html='getContentHtml(topicinfo.content)'></span>
      <span class="ti_content_long"
            v-if="contentIsLong"
            @click="contentShowAll">{{contentAllShow ? '收起':'展开'}}全文</span>
    </el-row>

    <!-- 直播 / 电台 -->
    <video-player class="video-player vjs-custom-skin LiveDialog tc_yy2 tc_remove_outling"
                  :style="{width:videowidth + 'px',height:videoHeight + 'px'}"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                  customEventName="customstatechangedeventname"
                  @ready="playerReadied"
                  v-if="this.topicinfo.video_id || this.topicinfo.video_url || this.topicinfo.ali_video_id">
    </video-player>

    <!-- 图片 -->
    <el-row class="ti_imglist"
            v-else
            :gutter="4">
      <el-col v-for="(item, index) in topicinfo.pics"
              :span="getCol(index)"
              :key="index">
        <el-image style="height: 270px;border-radius:10px;"
                  class="ti_il_1"
                  :src="item"
                  :preview-src-list="topicinfo.pics"
                  fit="none"></el-image>
      </el-col>
    </el-row>

    <!-- 点赞 -->
    <el-row class="ti_likeList">

      <el-col :span="24">
        <template v-for="(item, index) in topicinfo.like_list_to_return">
          <el-image class="ti_ll_2"
                    v-if="index<5"
                    :key="index"
                    :src="item.avatar"
                    fit="contain"></el-image>
        </template>
        <div class="ti_ll_1"
             v-if="topicinfo.like>0">{{topicinfo.like}}人赞</div>
        <el-image style="height: 32px;width:32px;margin-left:200px;cursor:pointer;"
                  @click="btnLike"
                  :src="getLikeUrl"
                  fit="contain"></el-image>
      </el-col>
    </el-row>
    <!-- 评论 -->
    <el-row class="ti_comments"
            v-if="commentscount">
      <el-row class="ti_cl_1"
              v-if="commentscount >2">
        <span @click="showAllComments2">查看全部{{commentscount}}条评论</span>
      </el-row>
      <template v-for="(item, index) in commentslist">
        <el-row class="ti_cl_2"
                v-if="getShowAllComments(index)"
                :key="index">
          <div @click="itemBackComments(item)"
               class="ti_cl_4">
            <span class="ti_cl_3">{{item.nickname}}</span>
            <span v-if="item.reply_nickname">
              {{" 回复 "}}<span class="ti_cl_3">{{item.reply_nickname}}</span> </span>
            {{"："+item.comments}}
          </div>
        </el-row>
      </template>
      <!-- <el-row class="ti_cl_1_1"
              v-if="commentscount >10 && commentsAllShow && !isallc">
        <span @click="showAllComments2">更多评论</span>
      </el-row> -->
    </el-row>
    <!-- 新增评论 -->
    <el-row v-if="replyid"
            class="ti_ca_reply">
      <el-tag closable
              type="warning"
              @close="closeReply">
        {{"回复："+replyname}}
      </el-tag>
    </el-row>
    <el-row class="ti_comments_add"
            :gutter="20">
      <el-image :src="useravatar"
                class="ti_ca_avimg"
                fit="contain"></el-image>
      <el-input placeholder="评论..."
                class="ti_ca_input"
                v-model="commentsInput"
                clearable>
      </el-input>
      <!-- <el-input placeholder="评论..."
                class="ti_ca_input"
                @change="btnBackComments"
                v-model="commentsInput"
                clearable>
      </el-input> -->
      <el-button :type="commentsInput==='' ?'info' :'danger'"
                 class="ti_ca_btn"
                 round
                 @click="btnBackComments">发送</el-button>
    </el-row>
  </div>
</template>
<script>
import cookie from "Common/cookie";
import util from "Common/util";
import "babel-polyfill";
import promise from "es6-promise";
import ajax from "Common/ajax";
import axios from 'axios';
import constans from "Constans";
import bus from "Common/events-bus";
import Vue from "vue";
import VueI18n from "vue-i18n";
import imglike from "Views/images/like.png";
import imgliked from "Views/images/liked.png";
import { Button, MessageBox, Row, Col, Image, Input, Badge, Tag } from "element-ui";
import { videoPlayer } from "vue-video-player";
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(VueI18n);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Image);
Vue.use(Input);
Vue.use(Badge);
Vue.use(Tag);
Vue.prototype.$message = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;
const DOMAIN = constans.APIS.domain;
const userUrl = constans.AllUrl.url.dev2;

let _ctList = [];

const i18n = new VueI18n({
  locale: "zh", // 语言标识
  messages: {
    zh: require("static/js/zh"),
    "zh-f": require("static/js/zh-f"),
    en: require("static/js/en")
  }
});

export default {
  name: "topicitem",
  components: {
    videoPlayer
  },
  filters: {
    format (v) {
      const timeDistance = (new Date().getTime() - new Date((parseInt(v) * 1000)).getTime()) / 1000
      if ((timeDistance / 60) < 1) {
        return `1分钟前`
      } else if ((timeDistance / 60) < 60) {
        return `${Math.floor((timeDistance / 60))}分钟前`
      } else if ((timeDistance / 60 / 60) < 24) {
        return `${Math.floor((timeDistance / 60 / 60))}小时前`
      } else if ((timeDistance / 60 / 60 / 24) < 30) {
        return `${Math.floor((timeDistance / 60 / 60 / 24))}天前`
      } else if ((timeDistance / 60 / 60 / 24 / 30) < 12) {
        return `${Math.floor((timeDistance / 60 / 60 / 24 / 30))}月前`
      } else {
        return `${Math.floor((timeDistance / 60 / 60 / 24 / 30 / 12))}年前`
      }
    }
  },
  props: {
    topicinfo: {
      type: Object,
    }
  },
  data () {
    return {
      token: null,
      uid: null,
      useravatar: '',
      contentIsLong: false,
      contentAllShow: false,
      commentsAllShow: false,
      commentsInput: '',
      isLike: false,
      commentslist: [],
      replyid: '',
      replyname: '',
      commentsindex: -1,
      commentscount: 0,
      isallc: false,

      videowidth: 500,
      videoHeight: 300,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        // preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "简体中文",
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: "" //url地址
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      },
      contentTopArray: [], // 内容中含有话题的列表

    };
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player;
    },

    getLikeUrl: function () {
      let _n = imglike;
      this.isLike && (_n = imgliked);
      return _n
    },

  },
  mounted () {
    var that = this;
  },
  created () {
    this.token = cookie.getCookie("lespark_token") || '';
    this.uid = cookie.getCookie("lespark_user_id");
    this.useravatar = cookie.getCookie("avatar");
    this.isLike = this.topicinfo.liked || false;
    this.commentslist = this.topicinfo.comments_list_new || [];
    this.commentscount = this.topicinfo.comments_count || 0;
    _ctList = [];

    // if (this.topicinfo.recommend_reason) {
    //   console.log('========i am come in  recommend_reason======');
    // }

    // 判断视频逻辑：video_id、video_url、ali_video_id其中一个有值，就是视频帖子。如果有值，都是取video_url的，video_url是播放地址
    if (this.topicinfo.video_id || this.topicinfo.video_url || this.topicinfo.ali_video_id) {
      console.log('========i am come in  video======', this.topicinfo.content);
      this.playerOptions.sources[0].src = this.topicinfo.video_url;
    }



    // 模拟置顶
    // this.topicinfo.is_top_post = true;

  },
  methods: {

    getRole (_nu) {
      // "new_role": 2,  //性别 0P 1T 2H 3Bi 4不愿透露
      let _n = '';
      _nu === '0' && (_n = 'P');
      _nu === '1' && (_n = 'T');
      _nu === '2' && (_n = 'H');
      _nu === '3' && (_n = 'Bi');
      return _n
    },
    getRoleColor (_nu) {
      // "new_role": 2,  //性别 0P 1T 2H 3Bi 4不愿透露
      let _n = 'success';
      _nu === '0' && (_n = 'success');
      _nu === '1' && (_n = 'primary');
      _nu === '2' && (_n = 'warning');
      _nu === '3' && (_n = 'success');
      return _n
    },
    gotoUserInfo () {
      console.log(this.topicinfo.user_id);
      location.href = '../userinfo.html?id=' + this.topicinfo.user_id;
    },
    // 点赞
    btnLike () {
      console.log(this.topicinfo);
      // if (this.isLike) return;
      // return;
      let _ = this;
      //没登录，弹出登录框
      _.is_login();
      let user_id = cookie.getCookie("lespark_user_id");
      if (user_id == "") {
        _.is_login();
        return;
      }
      //是否有点赞
      let url = userUrl + "/like/" + this.topicinfo.id;

      if (this.isLike) {
        ajax.Delete({
          url: url,

          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token"),
            user_id: cookie.getCookie("lespark_user_id"),
          }
        }).then(res => {
          _.isLike = false;
          _.topicinfo.like--;
          let _fdata = _.topicinfo.like_list_to_return.filter(_item => _item.user_id !== user_id)
          // _.topicinfo.like_list_to_return.push({ 'id': user_id, 'avatar': cookie.getCookie("avatar") || '' });
          _.topicinfo.like_list_to_return = _fdata;
        })
          .catch(error => {
          });
      } else {
        ajax.Post({
          url: url,
          data: {
            "action_type": "like",  //固定参数
            "source": 3, //固定参数
            "time": Math.random()
          },
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token"),
            user_id: cookie.getCookie("lespark_user_id"),
            // token: "8e56647f892c0a42d0e215cdb1f29e2d",
            // user_id: "5ba06ceed3b46465cc2130f8",
            "content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            _.isLike = true;
            _.topicinfo.like++;
            _.topicinfo.like_list_to_return.unshift({ 'id': user_id, 'user_id': user_id, 'avatar': cookie.getCookie("avatar") || '' });
          })
          .catch(error => {
          });
      }




    },

    //是否登录
    is_login () {
      let _ = this;
      let token = cookie.getCookie("lespark_token");
      let user_id = cookie.getCookie("lespark_user_id");
      if (token == null || token == "") {
        _.$bus.emit("noLoginInfo", true);
      }
      if (user_id == null || user_id == "") {
        _.$bus.emit("noLoginInfo", true);
      }
    },
    getShowAllComments (_l) {
      if (!this.commentsAllShow && _l > 1) {
        return false;
      } else {
        return true
      }
    },
    showAllComments () {
      console.log(this.commentsAllShow);
      this.commentsAllShow = !this.commentsAllShow;
    },
    itemBackComments (_item) {
      console.log(_item);
      this.replyid = _item.user_id;
      this.commentsindex = _item.comments_index;
      this.replyname = _item.nickname;
    },
    closeReply () {
      this.replyid = "";
      this.replyname = "";
      this.commentsindex = -1;
    },
    // 评论
    btnBackComments () {
      console.log(this.commentsInput);
      console.log(this.topicinfo);
      if (this.commentsInput === '') return;
      // return;
      let _ = this;
      //没登录，弹出登录框
      _.is_login();
      let user_id = cookie.getCookie("lespark_user_id");
      if (user_id == "") {
        _.is_login();
        return;
      }

      let url = userUrl + "/comments";
      let _pr = {
        "comments": _.commentsInput,  //评论内容
        "post_id": _.topicinfo.id,  //评论的帖子id
        // "reply_id": "5d393775a19ea613b5d6e56c", //回复的用户id
        // "previous_index": "4",  //回复的评论的下标
        "time": Math.random()
      };
      _.replyid && (_pr.reply_id = _.replyid, _pr.previous_index = _.commentsindex);
      ajax.Post({
        url: url,
        data: _pr,
        headers: {
          bundle_id: "pc",
          'bundle-id': 'pc',
          lang: "zh-hans",
          token: cookie.getCookie("lespark_token"),
          user_id: cookie.getCookie("lespark_user_id"),
          // token: "8e56647f892c0a42d0e215cdb1f29e2d",
          // user_id: "5ba06ceed3b46465cc2130f8",
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          if (res.error === 0) {
            _.commentsInput = "";
            _.commentslist = [..._.commentslist, ...[res.data]];
            _.commentscount = _.commentscount + 1;
          }
        })
        .catch(error => {
        });
    },
    // 获取更多评论
    showAllComments2 () {
      let _ = this;
      _.commentsAllShow = true;
      if (_.commentscount < 10) return;
      //没登录，弹出登录框
      _.is_login();
      let user_id = cookie.getCookie("lespark_user_id");
      if (user_id == "") {
        _.is_login();
        return;
      }
      //是否有点赞
      ajax
        .Get({
          url: userUrl + "/comments/" + _.topicinfo.id + "?_t=" + new Date().getTime(),
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token") || "",
            user_id: cookie.getCookie("lespark_user_id") || ''
          }
        })
        .then(ref => {
          let data = ref.data;
          _.commentslist = data.info;
          _.isallc = true;
        })
        .catch(ref => {
          console.log(ref);
        });

    },
    playerReadied (player) {
    },

    //转换类容用户名
    tcReplaceContent (_text, _uid, _uname) {
      if (!_text) return;
      let _txt = ' target="_blank"';
      let s = _text.replace(_uid, function (a) {
        return '<a href="../userinfo.html?id=' + a + '" ' + _txt + '  onclick="(function(event) { event.stopPropagation(); })" >' + _uname + '</a>';
      });
      return s;
    },
    //转换类容话题
    tcReplaceContentTop (_text) {
      if (!_text) return;
      let _newhtml = _text;
      this.getContTopArr(_text);
      console.log('===_ctList=====', _ctList);
      if (_ctList.length) {
        _ctList.map((_item, _idx) => {
          if (_newhtml.indexOf(_item) !== -1) {
            let _target = ' target="_blank"';
            _newhtml = _newhtml.replace(`#${_item}#`, function (a) {
              return '<a href="../topic.html?id=' + _item + '" ' + _target + '  onclick="(function(event) { event.stopPropagation(); })" style="color: #008ee5;" >' + a + '</a>';
            });
          }
        });
        console.log(_newhtml);
      }

      return _newhtml;
    },
    getContTopArr (_text) {
      let _oldhtml = '';
      var t_first_character = _text.indexOf('#');
      var t_second_character = _text.replace('#', '@').indexOf('#');
      let _txt = _text.substring(t_first_character + 1, t_second_character);
      if (_txt) {
        _ctList = [..._ctList, ...[_txt]];
        _oldhtml = _text.substring(t_second_character + 1);
        console.log('====_oldhtml====', _oldhtml);
        _oldhtml && this.getContTopArr(_oldhtml);
      }
      // console.log(t_second_character - 1)
      // console.log(_text.substring(t_first_character + 1, t_second_character));

    },
    contentShowAll () {
      console.log(this.contentAllShow);
      this.contentAllShow = !this.contentAllShow;
    },
    getContentHtml (_cont) {
      let _html = this.getTxtLength(_cont);
      // let _html = `<p>${_cont}</p>`;
      if (this.topicinfo.friends_id.length > 0) {
        this.topicinfo.friends_id.map((_item, _idx) => {
          if (_html.indexOf(_item) !== -1) {
            _html = this.tcReplaceContent(_html, _item, this.topicinfo.friends_nickname[_idx]);
          }
        });
        console.log(_html);
      }
      _html = this.tcReplaceContentTop(_html);
      return _html;
    },

    getTxtLength (_t) {
      let _lenghtcount = 0, _isno = true;
      let _txt = '';
      for (var i = 0; i < _t.length; i++) {
        if (_isno) {
          if (_t.charCodeAt(i) > 128) {
            _lenghtcount = _lenghtcount + 2;
          } else {
            _lenghtcount = _lenghtcount + 1;
          }
          if (_lenghtcount >= 240 && !this.contentAllShow) {
            _txt = _txt + '...';
            _isno = false;
            this.contentIsLong = true;
          } else {
            _txt = _txt + _t[i];
          }

        };

      }
      console.log(_txt);
      return _txt;
    },
    getCol (_idx) {
      console.log(_idx);
      let _n = 12;
      switch (this.topicinfo.pics.length) {
        case 1:
          _n = 14;
          break;
        case 2:
          _n = 12;
          break;
        case 3:
          _n = 8;
          break;
        case 4:
          _n = 6;
          break;
        case 5:
          (_idx === 0 || _idx === 1) ? _n = 12 : _n = 8;
          break;
        case 6:
          _n = 8;
        case 7:
          (_idx === 0 || _idx === 1 || _idx === 2) ? _n = 8 : _n = 6;
          break;
        case 8:
          _n = 6;
          break;
        case 9:
          _n = 8;
          break;
        default:
          _n = 6;
          break;
      }
      // this.topicinfo.pics.length === 3 && (_n = 8);
      // this.topicinfo.pics.length >= 4 && (_n = 6);
      return _n
    },
    getScope () {
      // scope  （0是所有人，1是好友，2是我自己，3是24小时，4是情侣，5是粉丝）
      // console.log(this.topicinfo.scope);
      let _n = '';
      switch (this.topicinfo.scope) {
        case 0:
          _n = '所有人';
          break;
        case 1:
          _n = '好友';
          break;
        case 2:
          _n = '自己';
          break;
        case 3:
          _n = '24小时';
          break;
        case 4:
          _n = '情侣';
          break;
        case 5:
          _n = '粉丝';
          break;

      }
      // this.topicinfo.pics.length === 3 && (_n = 8);
      // this.topicinfo.pics.length >= 4 && (_n = 6);
      return _n
    },

    getUserInfoTxt () {
      // <span>{{getScope()}}</span>
      //     <span v-if="topicinfo.recommend_reason">{{topicinfo.recommend_reason||''}}</span>
      //     <span v-if="topicinfo.source==1">{{'来自情侣空间'}}</span>
      // 共用一个逻辑：就是遍历的时候判断user_id，如果是自己，就处理scope 和 source 和 recommend_reason，如果不是自己，就只处理source 和 recommend_reason
      let user_id = cookie.getCookie("lespark_user_id");
      let _txt = '';
      if (this.topicinfo.user_id == user_id) {
        _txt = this.getScope();
        this.topicinfo.source == 1 && (_txt = _txt + ' 来自情侣空间');
        this.topicinfo.recommend_reason && (_txt = _txt + ' ' + this.topicinfo.recommend_reason);
      } else {
        this.topicinfo.source == 1 && (_txt = _txt + ' 来自情侣空间');
        this.topicinfo.recommend_reason && (_txt = _txt + ' ' + this.topicinfo.recommend_reason);
      }
      return _txt;
    },

  },

};
</script>
<style scoped>
.ti_main {
  padding: 30px 45px;
  background-color: #fff;
  font-family: PingFangSC-regular;
  border-radius: 6px;
  box-shadow: 0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px -2px 4px 0px rgba(216, 216, 216, 0.3);
}
.ti_header {
  font-size: 14px;
}

.ti_header .ti_name_1 {
  color: #333333;
  font-size: 19.2px;
  height: 27px;
  font-weight: 500;
  line-height: 26px;
}
.ti_header .ti_time_1 {
  padding-top: 2px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(168, 168, 168, 1);
  line-height: 21px;
}
.ti_header .ti_time_1 .ti_time_1_1 {
  color: #fa3e54;
}

.ti_content {
  padding: 9px 0;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 25px;
}
.ti_content .ti_content_long {
  color: #008ee5;
  cursor: pointer;
}
.ti_likeList {
  padding: 10px 0px;
}
.ti_likeList .ti_ll_1 {
  padding-left: 10px;
  line-height: 30px;
  float: left;

  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.ti_likeList .ti_ll_2 {
  height: 26px;
  width: 26px;
  border-radius: 50%;
  margin-left: -5px;
  float: left;
  border: 1px solid rgba(255, 255, 255, 1);
}
.ti_u_1 {
  height: 54px;
  width: 54px;
  border-radius: 50%;
  -o-object-fit: cover;
  object-fit: cover;
}
.ti_comments {
  color: #808080;
  font-size: 16px;
  padding-bottom: 15px;
}
.ti_comments .ti_cl_1 {
  cursor: pointer;
  padding-bottom: 6px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(168, 168, 168, 1);
}
.ti_comments .ti_cl_1_1 {
  cursor: pointer;
  padding-bottom: 10px;
  color: #409eff;
  font-size: 12px;
}
.ti_comments .ti_cl_2 {
  padding-bottom: 4px;
}
.ti_comments .ti_cl_3 {
  font-size: 16px;
  color: #333333;
}
.ti_comments .ti_cl_4 {
  cursor: pointer;
}
.ti_comments .ti_cl_4:hover {
  background-color: #f5f7fa;
}
.ti_ca_reply {
  color: #808080;
  font-size: 12px;
  padding-bottom: 5px;
}
.ti_comments_add {
  padding: 0 10px;
}
.ti_comments_add .ti_ca_avimg {
  height: 36px;
  width: 36px;
  border-radius: 50%;
  float: left;
  margin-right: 10px;
  border: 0px solid rgba(0, 0, 0, 0.15);
}
</style>