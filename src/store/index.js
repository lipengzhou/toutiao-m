import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
import decodeJwt from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象，包含 token 信息
    user: getItem('user'),
    cachedPages: ['TabBar']
  },

  mutations: {
    setUser (state, data) {
      // 解析 JWT 中的数据（需要使用用户ID）
      if (data && data.token) {
        const user = decodeJwt(data.token)
        data.user_id = user.user_id
      }

      state.user = data

      // 为了防止刷新丢失 state 中的 user 状态，我们把它放到本地存储
      setItem('user', state.user)
    },

    setKeepAlive (state, data) {
      state.keepAlive = data
    },

    removeCachePage (state, pageName) {
      const index = state.cachedPages.indexOf(pageName)
      if (index !== -1) {
        state.cachedPages.splice(index, 1)
      }
    },

    addCachePage (state, pageName) {
      state.cachedPages.push(pageName)
    }
  },
  actions: {}
})
