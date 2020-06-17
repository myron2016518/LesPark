import Vue from 'vue'
import App from './app.vue'
import VueBus from 'vue-bus'
import VueI18n from 'vue-i18n'

import 'Views/css/reset.css'
import 'Views/css/app.css'
import 'Views/css/topic.css'

Vue.use(VueI18n)
Vue.use(VueBus);

const i18n = new VueI18n({
  locale: 'zh', // 语言标识 
  messages: {
    'zh': require('static/js/zh'),
    'zh-f': require('static/js/zh-f'),
    'en': require('static/js/en')
  }
})


new Vue({
  el: "#app",
  i18n,
  template: '<App/>',
  components: {
    App
  }
})