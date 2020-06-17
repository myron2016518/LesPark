<template>
  <div>
    <div class="home">
      <div class="main">
        <div class="mainbox">
          <div class="clearflow">
            <div class="fl l-main">
              <div class="kouhao">
                <img v-if="bannerImg==0"
                     src="../../../images/kouhao.png">
                <img v-if="bannerImg==1"
                     src="../../../images/kouhao1.png">
                <img v-if="bannerImg==2"
                     src="../../../images/kouhao2.png">
              </div>
              <div class="ewm">
                <div class="erweima">
                  <img :src='url.qr_img_url'>
                </div>
                <div>{{$t('home.download')}}</div>
              </div>
              <div class="clearflow download">
                <!-- 苹果 -->
                <a :href="url.ios_url">
                  <div class="fl clearflow down">
                    <div class="fl icon">
                      <img src="../../../images/apple.png">
                    </div>
                    <div class="fl word">{{$t('home.download1')}}</div>
                  </div>
                </a>
                <!-- 安卓 -->
                <a :href="url.android_url">
                  <div class="fl down">
                    <div class="fl icon">
                      <img src="../../../images/android.png">
                    </div>
                    <div class="fl word">{{$t('home.download2')}}</div>
                  </div>
                </a>
                <!-- 谷歌 -->
                <a :href="url.google_url">
                  <div class="fl down">
                    <div class="fl icon">
                      <img src="../../../images/Google.png">
                    </div>
                    <div class="fl word">{{$t('home.download3')}}</div>
                  </div>
                </a>
              </div>
            </div>
            <div class="mobile">
              <img src="https://img2.lespark.cn/web/mobile.jpeg">
            </div>
          </div>
        </div>
      </div>
      <div class="white-bg">
        <img class="auto-img"
             src="../../../images/bgwhite.png">
      </div>
    </div>

    <!-- 关注 -->
    <attention></attention>

    <!-- 话题 -->
    <topic></topic>

    <!-- 热门 -->
    <hot></hot>

    <!-- totop -->
    <div class="totop"
         @click="backTop()"
         v-show="iftotop">
      <img class="totopimg"
           src="../../../images/totop.png" />
    </div>

  </div>
</template>

<script>

import * as cookie from 'Common/cookie';
import constans from 'Constans';
import "babel-polyfill";
import promise from "es6-promise";
import util from 'Common/util';
import ajax from 'Common/ajax';
import bus from 'Common/events-bus';

import 'Views/css/home/mess.css';

import hot from 'Views/components/hot'
import attention from 'Views/components/attention'
import topic from 'Views/components/topic'

const DOMAIN = constans.APIS.domain
const userUrl = constans.AllUrl.url.dev

export default {
  name: 'mess',
  components: {
    hot: hot,
    attention: attention,
    topic: topic,
  },
  data () {
    return {
      attentionMsg: '',
      bannerImg: null,
      iftotop: false,
      url: {
        'android_url': "http://img1.lespark.cn/apk/LesPark-release.apk",
        'google_url': "https://play.google.com/store/apps/details?id=com.redwolfama.peonylespark.gp",
        'ios_url': "https://itunes.apple.com/cn/app/id1329843362?mt=8",
        'qr_img_url': "https://img2.lespark.cn/web/ewm.png",
      },
    }
  },
  mounted () {
    var that = this;
    bus.$on('url', function (msg) {
      // alert(msg)
      let url = {}
      url = msg
      console.log(url)
      if (url != '') {
        that.url = msg
      }
    })

    bus.$on('attentionShow', function (msg) {
      that.attentionMsg = msg
    })

    bus.$on('bannerImg', function (msg) {
      if (msg == '简体中文') {
        that.bannerImg = 0
        window.document.title = 'LesPark- 全球女性直播交友官网 最in闺蜜情感助手'
        window.document.all[8].content = 'LesPark是一款为全球女性提供交友渠道的pc直播和移动社交软件，是女性专属交友泛娱乐平台。在这里，你可以通过网页开启直播，与粉丝好友零距离实时互动；能够依据定位寻找附近她或参加各种活动，与附近人群建立良好、健康的社交关系。'
      }
      if (msg == '繁體中文') {
        that.bannerImg = 1
        window.document.title = 'LesPark- 全球拉拉直播交友官網'
        window.document.all[8].content = 'LesPark為全球les提供交友渠道，集pc直播和移動社交軟體，是拉拉專屬交友泛娛樂平臺。在這裏，妳可以通過網頁開啟直播，與粉絲好友零距離實時互動；能夠依據定位尋找附近她或參加各種活動，與附近人群建立良好、健康的社交關系。'
      }
      if (msg == 'English') {
        that.bannerImg = 2
        window.document.title = 'LesPark-The best APP for lesbians,queer and bisexual women'
        window.document.all[8].content = 'LesPark is a global lesbian live video streaming social network.THE MOST ENJOYABLE LESBIAN APP.'
      }
    })
    window.addEventListener('scroll', this.ifscroll);
  },
  beforeCreat () {
  },
  created () {
    var that = this
    var language = cookie.default.getCookie('language') != '' ? cookie.default.getCookie('language') : '简体中文'
    if (language == '简体中文') {
      that.bannerImg = 0
      window.document.title = 'LesPark- 全球女性直播交友官网 最in闺蜜情感助手'
      window.document.all[8].content = 'LesPark是一款为全球女性提供交友渠道的pc直播和移动社交软件，是女性专属交友泛娱乐平台。在这里，你可以通过网页开启直播，与粉丝好友零距离实时互动；能够依据定位寻找附近她或参加各种活动，与附近人群建立良好、健康的社交关系。'
    }
    if (language == '繁體中文') {
      that.bannerImg = 1
      window.document.title = 'LesPark- 全球拉拉直播交友官網'
      window.document.all[8].content = 'LesPark為全球les提供交友渠道，集pc直播和移動社交軟體，是拉拉專屬交友泛娛樂平臺。在這裏，妳可以通過網頁開啟直播，與粉絲好友零距離實時互動；能夠依據定位尋找附近她或參加各種活動，與附近人群建立良好、健康的社交關系。'
    }
    if (language == 'English') {
      that.bannerImg = 2
      window.document.title = 'LesPark-The best APP for lesbians,queer and bisexual women'
      window.document.all[8].content = 'LesPark is a global lesbian live video streaming social network.THE MOST ENJOYABLE LESBIAN APP.'
    }
  },
  methods: {
    toLive: function (live_id) {
      location.href = '../live.html?id=' + live_id;
    },
    backTop () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.addEventListener('scroll', function () {
        if (document.documentElement.scrollTop == 0) {
          this.iftotop = false;
        }
      })
    },
    ifscroll () {
      var _this = this;
      window.addEventListener('scroll', function () {
        if (document.documentElement.scrollTop == 0) {
          _this.iftotop = false;
        } else {
          _this.iftotop = true;
        }
      })
    }
  },
  watch: {
    attentionMsg (a, b) {
      if (a == 'headerto') {
        bus.$emit('lastAttentionShow', 'yes')
      } else {
        bus.$emit('lastAttentionShow', 'no')
      }
    }
  }
}    
</script>
<style type="text/css">
</style>