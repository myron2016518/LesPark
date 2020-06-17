<template>
  <div class='main'>
    <div class="content">
      <div class="top_main bg_color_fff">
        <img class="tm_img"
             :src="topiceinfo.image_url">
        <div class="tm_txt">
          <p class="tmt_1">{{topiceinfo.tag}}</p>
          <p class="tmt_2">{{topiceinfo.total_feeds+""+$t('topic.t_1')}}</p>
          <p class="tmt_3">{{topiceinfo.desc}}</p>
        </div>
      </div>
      <div class="top_content_title bg_color_fff">
        <el-tabs v-model="activeName"
                 class="tct_1"
                 @tab-click="handleClick">
          <el-tab-pane label="推荐"
                       class="tct_2"
                       name="first"></el-tab-pane>
          <el-tab-pane label="最新"
                       class="tct_2"
                       name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="top_content ">
        <div class="topic_list"
             v-for="(item, index) in statuseslist"
             :key="index">
          <topicitem :topicinfo="item"> </topicitem>
        </div>
        <div class="clickLoadMore"
             v-show="loadShow">
          <div class="loadbox">
            <div class="loadimg fl">
              <img class="auto-img"
                   :src="loadingImg" />
            </div>
            <a class="fl">加载更多</a>
          </div>
        </div>
      </div>

      <div class="top_hots bg_color_fff">
        <!-- 话题 -->
        <topichost ttype="2"></topichost>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import ajax from "Common/ajax";
import Utils from "Common/util";
import cookie from "Common/cookie";
import bus from "Common/events-bus";
import constans from 'Constans';
import { Loading, Button, MessageBox, Message, Tabs, TabPane } from "element-ui";

import topic from 'Views/components/topic';
import topicitem from 'Views/components/topicitem';

import loadingImg from "Views/images/loading.png";

let isLoading = false;
let pageSize = 10;

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.prototype.$message = MessageBox;
Vue.prototype.$loading = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;
const userUrl = constans.AllUrl.url.dev2;
export default {
  name: 'topic',
  components: { topichost: topic, topicitem: topicitem, },
  data () {
    return {
      loadShow: true,
      activeName: 'first',
      hotOnlineList: '',
      min_id: '', //分页参数 服务端返回的，翻页时候用（第一次请求的时候不需要传）
      last_id: '', //分页参数，如果返回格式为"5c7c10aba2e3a92941485583||0"则取||后面的值（第一次请求的时候不需要传）
      scroll: '',
      loadingImg: loadingImg,

      curtype: 'first',  // first:推荐  , second :最新

      isLogin: false,
      topiceinfo: {
        "tag": "",  //话题
        "image_url": "",  //图片
        "total_feeds": 0,  //参与人数
        "url": "",  //超链接
        "url_title": "",  //超链接标题
        "is_following": false,  //是否关注
        "cp_tag": false,  //情侣话题
        "desc": "",  //描述
      },
      statuseslist: [],

    }
  },
  created () {
    if (Utils.liveStartisLogin()) {
      this.isLogin = true;
      this.token = cookie.getCookie('lespark_token');
      this.user_id = cookie.getCookie('lespark_user_id');
      this.all_phone = cookie.getCookie('phone');

    } else {
      this.isLogin = false;
      // this.$bus.emit("noLoginInfo", true);
    }

    // let id = Utils.getQueryString("id");
    let _arg = Utils.getQueryStringArgs();

    console.log('===id===', _arg.id)
    // 话题
    ajax.Get({
      url: userUrl + "/v3/tag_title?tag=" + _arg.id + "&t=" + new Date().getTime(),
      headers: {
        "token": this.token,
        "user_id": this.user_id,
        bundle_id: 'pc',
        'bundle-id': 'pc',
        lang: 'zh-hans'
      }
    }).then(ref => {
      console.log('话题的数据', ref.data)
      this.topiceinfo = ref.data;

    }).catch(ref => {
      // console.log(ref);
    });
    this.getTagFeedList(_arg.id, this.curtype);
  },
  mounted () {
    window.addEventListener('scroll', this.menu);
  },
  methods: {
    //获取url的动态参数
    getParamsId () {
      var url = window.location.href;
      var r = url.lastIndexOf('/');
      var id = url.slice(r + 1, r.length);
      return id;
    },
    handleClick (tab, event) {
      console.log(tab, event);
      console.log('===this.activeName===', this.activeName);
      let _arg = Utils.getQueryStringArgs();

      this.activeName !== this.curtype && this.getTagFeedList(_arg.id, this.activeName);

    },
    getTagFeedList: function (_id, _type) {
      console.log('========', _type);
      var _this = this;
      if (isLoading) {
        return;
      }
      isLoading = true;
      // 1）推荐 Request: Get /v2/tag_hot_feed?count=20&last_id=0&min_id=5c7c7214a2d83840f0e4d6fc&tag=心情
      // 2）最新 Request: Get /v2/tag_feed?count=20&last_id=0&min_id=5c7c7214a2d83840f0e4d6fc&tag=心情
      let _url = userUrl + "/v2/" + (_type === 'first' ? "tag_hot_feed" : "tag_feed") + "?count=" + pageSize + "&tag=" + _id;
      _this.min_id && (_url = _url + "&min_id=" + _this.min_id);
      _this.last_id && (_url = _url + "&last_id=" + _this.last_id);

      ajax.Get({
        url: _url,
        headers: {
          "token": _this.token,
          "user_id": _this.user_id,
          bundle_id: 'pc',
          'bundle-id': 'pc',
          lang: 'zh-hans'
        }
      }).then(ref => {


        let _d = ref;

        if (_d.data.last_id.indexOf('||')) {
          let _last = _d.data.last_id.split('||');
          console.log('====last====', _last[_last.length - 1]);
          _this.last_id = _last[_last.length - 1];
          _last[_last.length - 1] === '0' && (_this.loadShow = false)
        } else {
          _this.last_id = _d.data.last_id;
        }

        _this.statuseslist = [..._this.statuseslist, ..._d.data.statuses];
        _this.min_id = _d.data.min_id;

        _this.curtype = _this.activeName;
        isLoading = false;

      }).catch(ref => {
      })
    },

    // 监听到底部400位置加载下页
    menu () {
      var _this = this;
      window.addEventListener('scroll', function () {
        let isLoading = false
        let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 400;
        if (bottomOfWindow && isLoading == false && _this.last_id != '' && _this.min_id != '') {
          if (_this.last_id !== '0') {
            if (!isLoading) {
              let _arg = Utils.getQueryStringArgs();
              _this.getTagFeedList(_arg.id, _this.activeName);
            } else {
              return;
            }
          } else {
            return;
          }
        } else {
          return;
        }
      })
    },

  },

  updated () {

  },

}
</script>
<style scoped>
.main {
  height: auto;
  display: flex;
  width: 100%;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #f5f5f5;
  font-family: PingFangSC-Regular;
}

.content {
  width: 1100px;
  margin: 0 auto;
  height: 100%;
  /* background-color: #fff; */
}
.bg_color_fff {
  background-color: #fff;
}

.top_main {
  height: 250px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 6px;
}
.top_main .tm_img {
  float: left;
  height: 250px;
  width: 300px;
  -o-object-fit: cover;
  object-fit: cover;
}
.top_main .tm_txt {
  width: 750px;
  height: 210px;
  font-size: 14px;
  color: #333333;
  float: right;
  padding-top: 40px;
  padding-right: 20px;
}
.tm_txt p {
  font-family: PingFangSC-regular;
  margin-bottom: 20px;
}
.tm_txt .tmt_1 {
  color: #ff8000;
}
.tm_txt .tmt_2 {
  color: #3793e0;
}
.tm_txt .tmt_3 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: SourceHanSansSC-regular;
}

.top_content_title {
  height: 60px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 6px;
}
.top_content_title .tct_1 {
  line-height: 60px;
  padding: 0 10px;
}

.top_content {
  height: auto;
  width: 750px;
  float: left;
  border-radius: 6px;
}
.top_content .topic_list {
  margin-bottom: 10px;
}
.top_hots {
  height: auto;
  width: 340px;
  float: right;
  border-radius: 6px;
  padding: 10px 0;
}
.clickLoadMore {
  padding: 10px;
  text-align: center;
}
</style>