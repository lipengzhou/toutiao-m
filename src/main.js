import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dateTime from './utils/date-time'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'

if (process.env.NODE_ENV === 'production') {
  const Sentry = require('@sentry/browser')
  const Integrations = require('@sentry/integrations')

  Sentry.init({
    dsn: 'https://34abf2d89d6e40e2ac3bad5fba752daf@sentry.itheima.net/55',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(dateTime)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
