<template>
  <div :class="[ttype=='1'?'topmain':'tc_2_2']">
    <div class="att-title clearflow"
         v-if="ttype==='1'">
      <div class="att-icon fl">
        <img class="auto-img"
             src="../images/hot.png" />
      </div>
      <div class="fl word">{{$t('home.liveTitle3')}}</div>
    </div>
    <div class="tc_2_1"
         v-else>
      {{$t('home.liveTitle3')}}
    </div>
    <!-- 有话题列表 -->
    <div class="wrap"
         v-if="noattention">
      <div class="topicitem"
           v-for="(item, index) in attentionList"
           :key="index"
           @click="toLive(item.tag)">
        <div class="outimg">
          <div class="imgbox floatleft"
               style="display: table-cell;vertical-align: middle;text-align: center;">
            <img class="picavatar"
                 :src="item.image_url" />
          </div>
          <div class="ti_txt ti_dec floatleft">
            <p class="topic_text">{{item.tag}}</p>
            <p class="topic_text">{{item.desc}}</p>
          </div>
          <div class="ti_txt ti_name floatleft">
            <p class="topic_text">{{item.total_feeds+""+$t('topic.t_1')}}</p>
          </div>

        </div>

      </div>
    </div>
    <!-- 无话题列表 -->
    <div v-else>
      <!-- <div class="novideoimg">
        <img src="../images/novideo.png" />
      </div> -->
      <div class="novideo">{{$t('home.liveTitle3_1')}}</div>
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
  name: "attention",
  props: {
    ttype: {
      type: String,
      default: '1'
    }
  },
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
    console.log(this.ttype);
  },
  methods: {
    toLive: function (live_id) {
      // window.open("/topic/" + live_id, "_blank");
      window.open('../topic.html?id=' + live_id, '_blank');

    },
    getList: function () {
      ajax
        .Get({
          // url: userUrl + "/user_online_lives?live_view_type="+3+'&_t='+new Date().getTime(),
          url:
            userUrl +
            "/v2/get_hot_tags?_t=" +
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
          this.attentionList = data.tags || [];
          // this.attentionList = [
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          //   { avatar: "http://img2.lespark.cn/aliclient86YzhEvAsVNucKtDjBYO", description: "🌟四月之星", is_live: false, nickname: "20077人参与", user_id: "5a02978ca2e3a95a4e738f11" },
          // ];
          if (this.attentionList.length == 0) {
            this.noattention = false;
          } else {
            this.noattention = true;
          }
        })
        .catch(ref => {
          console.log(ref);
        });
    },

  },
  // watch: {
  //   showChang: "getList",
  //   onemoregetlist: "getList"
  // }
};
</script>
<style scoped>
.topmain {
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

.topmain .word {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #333333;
  line-height: 40px;
  margin-left: 8px;
}

.topmain .topicitem {
  margin-bottom: 25px;
  width: 33%;
}

.topmain .topicitem:nth-child(4n + 4),
.topmain .topicitem:nth-child(5n + 5),
.topmain .topicitem:nth-child(6n + 6) {
  margin-bottom: 0px;
}

.topmain .imgbox {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 3px;
}

.topmain .picavatar {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 3px;
}

.ti_txt {
  height: 80px;
  line-height: 35px;
  overflow: hidden;
}
.ti_dec {
  padding-left: 10px;
  width: 150px;
}
.ti_name {
  width: 90px;
}
.topmain .wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 40px;
}
.floatleft {
  float: left;
}
.paddingleft10 {
  padding-left: 10px;
}

.topic_text {
  font-size: 12px;
  color: #a8a8a8;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
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

.lock {
  width: 23px;
  height: 23px;
}

.lock > img {
  width: 15px;
  height: 15px;
}

.tc_2_1 {
  font-size: 14px;
  color: #333333;
  padding: 10px;
}
.tc_2_2 {
  height: auto;
}
.tc_2_2 .wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 10px;
}
.tc_2_2 .topicitem {
  width: 100%;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.tc_2_2 .imgbox {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 3px;
}

.tc_2_2 .picavatar {
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 3px;
}
.tc_2_2 .ti_txt {
  height: 60px;
  line-height: 25px;
  overflow: hidden;
}
</style>