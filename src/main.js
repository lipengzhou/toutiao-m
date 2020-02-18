import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dateTime from './utils/date-time'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(dateTime)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
