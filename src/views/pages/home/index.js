import Vue from 'vue'
import App from './app.vue'
import VueBus from 'vue-bus'
import VueI18n from 'vue-i18n'

import 'Views/css/reset.css'
import 'Views/css/app.css'
import 'Views/css/home/home.css'

Vue.use(VueI18n)

const i18n = new VueI18n({ 
 locale: 'zh',  
 messages: { 
  'zh': require('static/js/zh'), 
  'zh-f': require('static/js/zh-f'), 
  'en': require('static/js/en') 
 } 
})

Vue.use(VueBus);
new Vue({
  el:"#app",
  i18n,
  template:'<App/>',
  components:{App}
})