<template>
  <div id="attention"
       class="attention"
       v-show="showChang">
    <div class="att-title clearflow">
      <div class="att-icon fl">
        <img class="auto-img"
             src="../images/attention.png" />
      </div>
      <div class="fl word">{{$t('home.liveTitle1')}}</div>
    </div>
    <!-- 有关注列表 -->
    <div class="wrap"
         v-if="noattention">
      <div class="imgboxing"
           v-for="(item, index) in attentionList"
           :key="index"
           @click="toLive(item.lgid)">
        <div class="outimg">
          <div class="imgbox"
               style="display: table-cell;vertical-align: middle;text-align: center;">
            <img class="picavatar"
                 :src="item.live_pic"
                 v-if="item.live_pic" />
            <img class="picavatar"
                 :src="item.avatar"
                 v-else />
          </div>
          <div class="img-bg">
            <div class="img-bg-box">
              <div class="out-box">
                <img class="auto-img"
                     src="../images/play.png" />
              </div>
            </div>
          </div>
        </div>

        <div class="clearflow nic-view">
          <div class="fl nickname">{{item.nickname}}</div>
          <div class="lock fl"
               v-if="item.is_secret_live == '1'">
            <img src="../images/lock.png" />
          </div>
          <div class="fr">
            <div class="fl"
                 style="margin-right:5px; line-height: 23px;">
              <img src="../images/view.png" />
            </div>
            <div class="fr view"
                 style="line-height: 23px;">{{item.view_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 无关注列表 -->
    <div v-else>
      <div class="novideoimg">
        <img src="../images/novideo.png" />
      </div>
      <div class="novideo">{{$t('home.liveTitle1_1')}}</div>
    </div>
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
import { Button, MessageBox } from "element-ui";

Vue.use(VueI18n);
Vue.use(Button);
Vue.prototype.$message = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;
const DOMAIN = constans.APIS.domain;
const userUrl = constans.AllUrl.url.dev;

const i18n = new VueI18n({
  locale: "zh", // 语言标识
  messages: {
    zh: require("static/js/zh"),
    "zh-f": require("static/js/zh-f"),
    en: require("static/js/en")
  }
});

export default {
  name: "attention",
  data () {
    return {
      token: null,
      uid: null,
      attentionList: "",
      noattention: false, //无关注主播显示
      last_index: "",
      showChang: false,
      aattentionMsg: "",
      onemoregetlist: false,
      onemore: ""
    };
  },
  computed: {},
  mounted () {
    var that = this;
    bus.$on("lastAttentionShow", function (msg) {
      that.aattentionMsg = msg;
      if (msg == "yes") {
        that.showChang = true;
      } else {
        that.showChang = false;
      }
    });

    // 接受传过来的关注以及取消关注
    // $bus.emit('clickFollow','follow');
    bus.$on("clickFollow", function (msg) {
      that.onemore = msg;
      if (msg == "follow") {
        that.onemoregetlist = true;
      } else {
        that.onemoregetlist = false;
      }
    });
  },
  created () {
    this.token = cookie.getCookie("lespark_token") || '';
    this.uid = cookie.getCookie("lespark_user_id");
    if (this.token != "" && this.uid != "") {
      this.showChang = true;
    } else {
      this.showChang = false;
    }
    this.getList();
  },
  methods: {
    toLive: function (live_id) {
      window.open("/live/" + live_id, "_blank");
      // window.open('../live.html?id='+live_id ,'_blank');

    },
    getList: function () {
      if (
        cookie.getCookie("lespark_token") != "" &&
        cookie.getCookie("lespark_user_id") != ""
      ) {
        ajax
          .Get({
            // url: userUrl + "/user_online_lives?live_view_type="+3+'&_t='+new Date().getTime(),
            url:
              userUrl +
              "/pc_user_online_lives?live_view_type=" +
              3 +
              "&_t=" +
              new Date().getTime(),
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
            console.log(data);
            this.attentionList = data.online_list;
            if (this.attentionList.length == 0) {
              this.noattention = false;
            } else {
              this.noattention = true;
            }
          })
          .catch(ref => {
            console.log(ref);
          });
      }
    },

  },
  watch: {
    showChang: "getList",
    onemoregetlist: "getList"
  }
};
</script>
<style scoped>
.attention {
  width: 1100px;
  margin: 0 auto;
}

.att-title {
  margin-top: 40px;
  line-height: 40px;
}

.att-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 30px;
}

.attention .word {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #333333;
  line-height: 40px;
  margin-left: 8px;
}

.imgboxing {
  margin-right: 20px;
  margin-bottom: 25px;
}

.imgboxing:nth-child(5n + 5) {
  margin-right: 0px;
}

.imgbox {
  width: 204px;
  height: 204px;
  overflow: hidden;
  border-radius: 3px;
}

.picavatar {
  width: 100%;
  height: 204px;
  object-fit: cover;
  border-radius: 3px;
}

.outimg {
  position: relative;
  cursor: pointer;
}

.outimg:hover img {
  transform: scale(1.05);
  transition: all 1s ease 0s;
  -webkit-transform: scale(1.05);
  -webkit-transform: all 1s ease 0s;
}

.outimg:hover > .img-bg {
  display: block;
}

.img-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: none;
  border-radius: 3px;
}

.img-bg-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.out-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 60px;
  height: 60px;
}

.auto-img {
  width: 100%;
  min-height: 100%;
  height: auto;
  display: block;
}

.wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.novideoimg {
  width: 47px;
  height: 40.3px;
  margin: 0 auto;
}

.novideo {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #a8a8a8;
  letter-spacing: 0;
  text-align: center;
  margin-top: 28.7px;
}

.nic-view {
  margin-top: 5px;
}

.nic-view .nickname {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  width: 124px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 23px;
}

.lock {
  width: 23px;
  height: 23px;
}

.lock > img {
  width: 15px;
  height: 15px;
}
</style>