<template>
  <div class="foot-container">
    <div class="footer">
      <div>
        <div class="foot-beian">
          <span>
            <div class="friend-link">
              <a href="https://taimienphi.vn"
                 title="download"><span>{{$t('foot.content5')}}</span>
                <img src="https://taimienphi.vn/Images/bn/reviewed/tmp2.png"
                     title="awarded 5 Stars at Taimienphi"
                     alt="download" /></a>
            </div>
            <div class="tc_footer_link">
              <a href=""
                 title="download">简体中文 </a>
              <a href=""
                 title="download">繁体中文 </a>
              <a href=""
                 title="download">English</a>
            </div>
            <div class="beianp">
              <img class="beian"
                   src="../images/beian.png" />
            </div>
            <a target="_blank"
               href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802023956">{{$t('foot.content1')}}</a>
          </span>
          <span>{{$t('foot.content2')}}</span>
        </div>
        <div class="foot-email">
          <span>{{$t('foot.content3')}}</span>
          <span><a href="mailto:lisa@lespark.us">{{$t('foot.content4')}}</a></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from 'Common/cookie'
import util from 'Common/util';

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('static/js/zh'),
    'zh-f': require('static/js/zh-f'),
    'en': require('static/js/en')
  }
})

export default {
  name: 'myFooter',
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>
<style type="text/css">
.foot-container {
  width: 100%;
  background: #f5f5f5;
}
.footer {
  width: 1100px;
  height: 240px;
  margin: 0 auto;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}
.footer a {
  color: #666;
}
.foot-beian {
  padding-top: 64px;
  padding-bottom: 6px;
  color: #666;
}
.friend-link {
  padding-top: 40px;
  padding-bottom: 10px;
  font-weight: bold;
}
.friend-link img {
  padding-left: 10px;
  height: 50px;
  vertical-align: middle;
}
.footer .beianp {
  display: inline-block;
  line-height: 14px;
}
.footer .beian {
  width: 100%;
  margin-bottom: -2px;
}
.tc_footer_link {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 5px;
}
.tc_footer_link a {
  margin-right: 10px;
}
</style>
