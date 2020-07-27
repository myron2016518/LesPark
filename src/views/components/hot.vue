<!-- 热门 -->
<template>
  <div id="hot"
       class="hot">
    <div class="hot-title clearflow">
      <div class="hot-icon fl">
        <img src="../images/hot.png">
      </div>
      <div class="fl word">{{$t('home.liveTitle2')}}</div>
    </div>
    <div class="wrap hotwrap">
      <div class="imgboxing"
           v-for="(item, index) in hotOnlineList"
           :key="index">
        <div class="outimg"
             @click="toLive(item.lgid)"
             :data-id="item.lgid">
          <div class="imgbox"
               style="display: table-cell;vertical-align: middle;text-align: center;">
            <img class="picavatar"
                 :src="item.live_pic"
                 v-if="item.live_pic">
            <img class="picavatar"
                 :src="item.avatar"
                 v-else>

          </div>
          <div class="img-bg">
            <div class="img-bg-box">
              <div class="out-box">
                <img class="auto-img"
                     src="../images/play.png">
              </div>
            </div>
          </div>
        </div>
        <img class="lala_live"
             src="../images/live2.png">
        <div class="clearflow nic-view">
          <div class="fl nickname">{{item.nickname}}</div>
          <div class="lock fl"
               v-if="item.is_secret_live == '1'">
            <img src="../images/lock.png" />
          </div>
          <div class="fr">
            <div class="fl"
                 style="margin-right:5px; line-height: 23px;">
              <img src="../images/view.png">
            </div>
            <div class="fr view">{{item.view_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 加载更多 -->
    <div class="clickLoadMore"
         v-show="loadShow">
      <div class="loadbox">
        <div class="loadimg fl">
          <img class="auto-img"
               src="../images/loading.png" />
        </div>
        <a class="fl">加载更多</a>
      </div>
    </div>
  </div>
</template>
<script>
import cookie from 'Common/cookie'
import util from 'Common/util';
import "babel-polyfill";
import promise from "es6-promise";
import ajax from 'Common/ajax';
import constans from 'Constans';
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const DOMAIN = constans.APIS.domain
const userUrl = constans.AllUrl.url.dev
let isLoading = false

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('static/js/zh'),
    'zh-f': require('static/js/zh-f'),
    'en': require('static/js/en')
  }
})

export default {
  name: 'hot',
  data () {
    return {
      hotOnlineList: '',
      cache_id: '', //分页参数
      last_index: '', //分页参数，为-1时,无更多数据
      scroll: '',

      loadShow: true,
      roating: true,
    }
  },
  created () {
    // 热门
    ajax.Get({
      url: userUrl + "/pc_user_online_lives?t=" + new Date().getTime(),
      headers: {
        bundle_id: 'pc',
        'bundle-id': 'pc',
        lang: 'zh-hans'
      }
    }).then(ref => {
      console.log('热播的数据', ref.data)
      let data = ref.data;
      this.hotOnlineList = data.online_list;
      this.last_index = data.last_index;
      this.cache_id = data.cache_id;
      // console.log(this.cache_id);
    }).catch(ref => {
      // console.log(ref);
    })
  },
  mounted () {
    window.addEventListener('scroll', this.menu);
  },
  methods: {
    getLiveList: function () {
      var _this = this;
      if (isLoading) {
        return;
      }
      isLoading = true;
      ajax.Get({
        url: userUrl + "/pc_user_online_lives?cache_id=" + _this.cache_id + '&last_index=' + _this.last_index,
        headers: {
          bundle_id: 'pc',
          'bundle-id': 'pc',
          lang: 'zh-hans'
        }
      }).then(ref => {
        let data = ref.data;
        var list = _this.hotOnlineList;
        _this.hotOnlineList = list.concat(data.online_list);
        _this.last_index = data.last_index;
        _this.cache_id = data.cache_id;
        isLoading = false;
        if (_this.last_index == -1) {
          _this.loadShow = false;
        }
      }).catch(ref => {
      })
    },
    // 监听到底部400位置加载下页
    menu () {
      var _this = this;
      window.addEventListener('scroll', function () {
        let isLoading = false
        let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 400;
        if (bottomOfWindow && isLoading == false && _this.last_index != '' && _this.cache_id != '') {
          if (_this.last_index > -1) {
            if (!isLoading) {
              _this.getLiveList();
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
    toLive: function (live_id) {
      // window.open('/live/' + live_id, '_blank');
      window.open('../live.html?id=' + live_id, '_blank');
    },
    //点击加载更多
    LoadMore: function () {
      this.getLiveList();
    }
  }
}
</script>
<style scoped>
/*加载更多*/
.loadbox {
  margin: 0 auto;
  width: 122px;
  overflow: hidden;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes rotation1 {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(0deg);
  }
}

.loadimg {
  width: 18px;
  height: 18px;
  margin-right: 9px;
  -webkit-transform: rotate(360deg);
  animation: rotation 3s linear infinite;
}

.clickLoadMore {
  width: 100%;
  text-align: center;
}

.clickLoadMore a {
  color: #333;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #a8a8a8;
  line-height: 18px;
}

.imgboxing {
  margin-right: 20px;
  margin-bottom: 25px;
  position: relative;
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

/*热门*/
.hot {
  width: 1100px;
  margin: 36px auto;
}

.hot-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 30px;
}

.hot .word {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #333333;
  line-height: 40px;
  margin-left: 8px;
}

.attention .nickname,
.hot .nickname {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  width: 124px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 23px;
}

.attention .view,
.hot .view {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #a8a8a8;
  text-align: right;
  line-height: 23px;
}

.nic-view {
  margin-top: 5px;
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
.lala_live {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 100;
}
</style>