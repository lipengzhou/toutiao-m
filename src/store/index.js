import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
import { getProfile } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象，包含 token 信息
    user: getItem('user'),
    keepAlive: ['TabBar']
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止刷新丢失 state 中的 user 状态，我们把它放到本地存储
      setItem('user', state.user)
    },

    setKeepAlive (state, data) {
      state.keepAlive = data
    }
  },
  actions: {
    async updateProfile ({ state, commit }) {
      if (state.user) {
        const { data } = await getProfile()
        commit('setUser', {
          ...state.user,
          ...data.data
        })
      }
    }
  }
})
