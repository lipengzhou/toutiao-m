const state = {
  commentCount: 0
}

const mutations = {
  setCommentCount (state, count) {
    state.commentCount = count
  }
}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
