<template>
  <div class='main'>
    <div class="content">
      <div class="user_main">
        <div class="top_main bg_color_fff tc_yy">
          <img class="tm_img"
               :style="userinfodata.is_living ? '':'border:none;'"
               :src="userinfodata.avatar">
          <img class="tm_tx1_1"
               v-if="userinfodata.is_living"
               src="../../../images/live1.png">

          <!-- <span class="tm_tx1">VIP{{userinfodata.is_vip}}</span> -->
          <p class="tm_tx2">{{userinfodata.nickname}}</p>
          <p class="tm_tx3">
            <el-tag v-for="(item, index) in userinfodata.tag"
                    :key="index"
                    :type="getTagType(index)"
                    class="tm_tx4"
                    effect="dark">
              {{ item }}
            </el-tag>
          </p>
        </div>
        <div class="top_content_title bg_color_fff tc_yy">
          <div class="top_ct_1">
            <p class="top_ct_1_1">{{userinfodata.fans_count || 0}}</p>
            <p class="top_ct_2">粉丝</p>
          </div>
          <div class="top_ct_1">
            <p class="top_ct_3 top_ct_1_1">{{userinfodata.total_likes || 0}}</p>
            <p class="top_ct_2 top_ct_3">获赞</p>
          </div>
          <div class="top_ct_1">
            <p class="top_ct_1_1">{{userinfodata.posts_count || 0}}</p>
            <p class="top_ct_2">动态</p>
          </div>
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
      </div>
      <div class="top_hots bg_color_fff tc_yy">
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
import { Loading, Button, MessageBox, Message, Tabs, TabPane, Tag } from "element-ui";

import topic from 'Views/components/topicb';
import topicitem from 'Views/components/topicitem';

import loadingImg from "Views/images/loading.png";

let isLoading = false;
let pageSize = 10;

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.prototype.$message = MessageBox;
Vue.prototype.$loading = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;
const userUrl = constans.AllUrl.url.dev2;
export default {
  name: 'userinfo',
  components: { topichost: topic, topicitem: topicitem, },
  data () {
    return {
      loadShow: true,
      hotOnlineList: '',
      min_id: '', //分页参数 服务端返回的，翻页时候用（第一次请求的时候不需要传）
      last_id: '', //分页参数，如果返回格式为"5c7c10aba2e3a92941485583||0"则取||后面的值（第一次请求的时候不需要传）
      scroll: '',
      loadingImg: loadingImg,

      isLogin: false,
      userinfodata: {

      },
      statuseslist: [],
      action_type: '',

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

    // console.log('===id===', _arg.id)
    // this.min_id = _arg.id;
    // 话题
    ajax.Get({

      url: userUrl + "/pc/simple_profile?user_info=" + _arg.id + "&t=" + new Date().getTime(),
      // url: userUrl + "/v3/tag_title?tag=" + _arg.id + "&t=" + new Date().getTime(),
      headers: {
        "token": this.token,
        "user_id": this.user_id,
        bundle_id: 'pc',
        'bundle-id': 'pc',
        lang: 'zh-hans'
      }
    }).then(ref => {

      this.userinfodata = ref.data;
      this.userinfodata.tag = this.getTagList(ref.data.tag);
    }).catch(ref => {
      // console.log(ref);
    });
    this.getTagFeedList(_arg.id);
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
    getTagType (_idx) {
      let _l = ['', 'success', 'info', 'danger', 'warning'];
      let _n = parseInt(Math.random() * _l.length);
      let _g = _l[_n] || '';
      return _g;
    },
    getTagList (_arr) {
      let _lenghtcount = 0, _isno = true;
      let _newArr = [];
      _arr.map((_item, _idx) => {
        let _txt = '';
        console.log(_lenghtcount, _isno);
        if (_lenghtcount <= 40 && _isno) {
          for (var i = 0; i < _item.length; i++) {
            if (_isno) {
              if (_item.charCodeAt(i) > 128) {
                _lenghtcount = _lenghtcount + 2;
              } else {
                _lenghtcount = _lenghtcount + 1;
              }
              _lenghtcount < 40 && (_txt = _txt + _item[i]);
              _lenghtcount >= 40 && (_txt = _txt + "...", _isno = false);
            };

          }
          _newArr.push(_txt);
        }
      });
      // _lenghtcount > 40 && (_newArr[_newArr.length - 1] = _newArr[_newArr.length - 1] + '...');
      return _newArr;
    },

    getTagFeedList: function (_id, _type) {
      console.log('========', _type);
      var _this = this;
      if (isLoading) {
        return;
      }
      isLoading = true;

      let _arg = Utils.getQueryStringArgs();
      // console.log('===id===', _arg.id)

      // 1）推荐 Request: Get /v2/tag_hot_feed?count=20&last_id=0&min_id=5c7c7214a2d83840f0e4d6fc&tag=心情
      // 2）最新 Request: Get /v2/tag_feed?count=20&last_id=0&min_id=5c7c7214a2d83840f0e4d6fc&tag=心情
      let _url = '';
      if (_this.user_id === _arg.id) {
        _url = userUrl + "/v2/his_feeds?count=10&action_type=view&view_source=0";
      } else {
        _url = userUrl + "/v2/his_feeds?count=10&action_type=rec_view&view_source=1&user_id=" + _arg.id;
      }
      // let _url = userUrl + "/v2/" + (_type === 'first' ? "tag_hot_feed" : "tag_feed") + "?count=" + pageSize + "&tag=" + _id;
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
        if (_d.data.last_id === 0 || _d.data.last_id === "0") {
          _this.loadShow = false
          _this.last_id = _d.data.last_id;
        } else {
          let _last = _d.data.last_id.split('||');
          console.log('====last====', _last[_last.length - 1]);
          _this.last_id = _last[_last.length - 1];
        }
        _d.data.statuses.length === 0 ? _this.loadShow = false : _this.statuseslist = [..._this.statuseslist, ..._d.data.statuses];
        _this.min_id = _d.data.min_id;
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
          if (_this.loadShow) {
            if (!isLoading) {
              let _arg = Utils.getQueryStringArgs();
              _this.getTagFeedList(_arg.id);
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
  padding-top: 18px;
  padding-bottom: 30px;
  background-color: #f5f5f5;
  font-family: PingFangSC-Regular;
}

.content {
  width: 1188px;
  margin: 0 auto;
  height: 100%;
  /* background-color: #fff; */
}
.bg_color_fff {
  background-color: #fff;
}
.user_main {
  width: 840px;
  float: left;
}
.tc_yy {
  box-shadow: 0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px -2px 4px 0px rgba(216, 216, 216, 0.3);
  border-radius: 6px;
}
.top_main {
  min-height: 220px;
  padding-top: 30px;
  /* padding-bottom: 30px; */
  width: 100%;
  text-align: center;
  margin-bottom: 12px;
  position: relative;
  background: rgba(255, 255, 255, 1);
}
.top_main .tm_img {
  height: 100px;
  width: 100px;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid;
  border-image: linear-gradient(
      130deg,
      rgba(190, 79, 246, 1),
      rgba(255, 51, 102, 1)
    )
    2 2;
  background-image: linear-gradient(
      rgba(190, 79, 246, 1),
      rgba(255, 51, 102, 1)
    ),
    linear-gradient(to bottom right, #0fd850, #5daf34);
}
.top_main .tm_tx1_1 {
  position: absolute;
  top: 117px;
  left: 47%;
  display: inline-block;
}
.top_main .tm_tx1 {
  position: absolute;
  top: 111px;
  left: 47.5%;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0px 6px;
  text-align: center;
  white-space: nowrap;
}
.top_main .tm_tx2 {
  border-radius: 50%;
  color: #333333;
  padding: 10px;
}
.top_main .tm_tx4 {
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 25px;
}

.top_content_title {
  height: 77px;
  width: initial;
  padding: 0 160px;
  text-align: center;
  margin-bottom: 10px;
}
.top_content_title .top_ct_1 {
  float: left;
  width: 140px;
  height: 53px;
  padding: 12px 0px;
  line-height: 25px;
  font-family: PingFangSC-Medium, PingFang SC;
}
.top_ct_1 .top_ct_1_1 {
  font-size: 17px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.top_content_title .top_ct_2 {
  font-size: 16px;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
}
.top_content_title .top_ct_3 {
  border-right: 1px solid #ebebeb;
  border-left: 1px solid #ebebeb;
}

.top_content {
  height: auto;
  width: 840px;
  float: left;
  border-radius: 6px;
}
.top_content .topic_list {
  margin-bottom: 10px;
}
.top_hots {
  height: auto;
  width: 332px;
  margin-left: 15px;
  float: right;
  /* padding: 10px 0; */
}
.clickLoadMore {
  padding: 30px 10px 10px 47%;
  text-align: center;
}
</style>