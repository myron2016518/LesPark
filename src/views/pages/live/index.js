import Vue from 'vue'
import App from './app.vue'
import VueBus from 'vue-bus';
 import VideoPlayer from 'vue-video-player/dist/vue-video-player.js'
import VueChatScroll from 'vue-chat-scroll'
import VueI18n from 'vue-i18n'

/*工具*/
import axios from 'axios';
import 'babel-polyfill';
import 'Views/css/reset.css';
import 'Views/css/app.css';
import 'Views/css/live.css';

import videojs from "vue-video-player/node_modules/video.js";
window.videojs = videojs;
import 'Views/css/video-js.css'
import'vue-video-player/src/custom-theme.css';

 Vue.use(VueBus);
Vue.use(VideoPlayer);
Vue.use(VueChatScroll)
 Vue.use(VueI18n)

const i18n = new VueI18n({ 
 locale: 'zh', // 语言标识 
 messages: { 
  'zh': require('static/js/zh'), 
  'zh-f': require('static/js/zh-f'), 
  'en': require('static/js/en') 
 } 
})

//把Hls挂载window对象上，是因为当DPlayer.video.type='hls'时，new DPlayer()对象会用到此对象。
// window.Hls = require('hls.js');

new Vue({
  el:"#app",
  i18n,
  template:'<App/>',
  components:{App}
})