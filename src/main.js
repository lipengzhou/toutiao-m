import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dateTime from './utils/date-time'
import validation from './utils/validation'
import 'amfe-flexible'
import './utils/register-vant.js'
import './styles/index.less'

Vue.use(dateTime)
Vue.use(validation)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
