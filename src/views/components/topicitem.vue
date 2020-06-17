<template>
  <div class="ti_main">
    <!-- 用户信息 -->
    <el-row class="ti_header">
      <el-col :span="2">
        <el-badge :value="topicinfo.is_vip"
                  class="ti_h_1">
          <img class="ti_u_1"
               :src="topicinfo.avatar">
        </el-badge>

      </el-col>
      <el-col :span="22">
        <p class="ti_name_1">{{topicinfo.nickname}}</p>
        <p class="ti_time_1">{{topicinfo.created_at | format}}</p>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <el-row class="ti_content">
      {{topicinfo.content}}
    </el-row>
    <!-- 图片 -->
    <el-row class="ti_imglist"
            :gutter="10">
      <el-col v-for="(item, index) in topicinfo.pics"
              :span="getCol"
              :key="index">
        <el-image style="max-height: 200px;min-height:100px;"
                  :src="item"
                  fit="contain"></el-image>
      </el-col>
    </el-row>
    <!-- 点赞 -->
    <el-row class="ti_likeList">
      <el-col :span="2">
        <el-image style="height: 30px;width:30px;"
                  @click="btnLike"
                  :src="getLikeUrl"
                  fit="contain"></el-image>
      </el-col>
      <el-col :span="22">
        <template v-for="(item, index) in topicinfo.like_list_to_return">
          <el-image style="height: 30px;width:30px;border-radius: 50%; margin-left: -5px;float: left;"
                    v-if="index<5"
                    :key="index"
                    :src="item.avatar"
                    fit="contain"></el-image>
        </template>
        <div class="ti_ll_1">{{topicinfo.like}}人赞</div>
      </el-col>

    </el-row>
    <!-- 评论 -->
    <el-row class="ti_comments">
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
      <el-col :span="20">
        <el-input placeholder="添加评论..."
                  v-model="commentsInput"
                  clearable>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="text"
                   @click="btnBackComments">发布</el-button>
      </el-col>
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
  filters: {
    format (v) {
      const timeDistance = (new Date().getTime() - new Date(parseInt(v)).getTime()) / 1000
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
      commentsAllShow: false,
      commentsInput: '',
      isLike: false,
      commentslist: [],
      replyid: '',
      replyname: '',
      commentsindex: -1,
      commentscount: 0,
      isallc: false,

    };
  },
  computed: {
    getCol: function () {
      let _n = 12;
      this.topicinfo.pics.length === 3 && (_n = 8);
      this.topicinfo.pics.length >= 4 && (_n = 6);
      return _n
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
    this.isLike = this.topicinfo.liked || false;
    this.commentslist = this.topicinfo.comments_list_new || [];
    this.commentscount = this.topicinfo.comments_count || 0;
  },
  methods: {

    // 点赞
    btnLike () {
      console.log(this.topicinfo);
      if (this.isLike) return;
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
        })
        .catch(error => {
        });
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

  },

};
</script>
<style scoped>
.ti_main {
  padding: 20px;
  background-color: #fff;
  font-family: PingFangSC-regular;
  border-radius: 6px;
}
.ti_header {
  font-size: 14px;
}

.ti_header .ti_name_1 {
  padding-top: 7px;
  color: rgba(255, 128, 0, 1);
}
.ti_header .ti_time_1 {
  color: #a8a8a8;
  font-size: 12px;
  padding-top: 7px;
}
.ti_content {
  padding: 10px 0;
  font-size: 14px;
  color: #333333;
}
.ti_likeList {
  padding: 10px 0px;
}
.ti_likeList .ti_ll_1 {
  padding-left: 10px;
  line-height: 30px;
  font-size: 12px;
  color: #333333;
  float: left;
}
.ti_u_1 {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  -o-object-fit: cover;
  object-fit: cover;
}
.ti_comments {
  color: #808080;
  font-size: 14px;
}
.ti_comments .ti_cl_1 {
  cursor: pointer;
  padding-bottom: 10px;
}
.ti_comments .ti_cl_1_1 {
  cursor: pointer;
  padding-bottom: 10px;
  color: #409eff;
  font-size: 12px;
}
.ti_comments .ti_cl_2 {
  padding-bottom: 10px;
}
.ti_comments .ti_cl_3 {
  font-size: 12px;
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
</style>