<template>
  <div class="user-container page-container">
    <!-- 导航条 -->
    <van-nav-bar
      class="page-navbar"
      fixed
      left-arrow
      :title="user.name"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航条 -->

    <!-- 用户信息 -->
    <user-info :user="user" />
    <!-- /用户信息 -->

    <!-- 文章列表 -->
    <article-list :user="user" />
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import UserInfo from './components/user-info'
import ArticleList from './components/article-list'

export default {
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 如果是去 文章详情 页面，则缓存
    // 如果是去其他页面，则不缓存
    const keepAlive = this.$store.state.keepAlive.slice()
    const index = keepAlive.indexOf('UserPage')
    if (to.name === 'article') {
      index === -1 && keepAlive.push('UserPage')
    } else {
      index !== -1 && keepAlive.splice(index, 1)
    }
    this.$store.commit('setKeepAlive', keepAlive)
    next()
  },
  name: 'UserPage',
  components: {
    UserInfo,
    ArticleList
  },
  props: {
    userId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      user: {
        id: this.userId
      } // 用户信息
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUser()
  },
  methods: {
    async loadUser () {
      const { data } = await getUserById(this.userId)
      this.user = data.data
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
}
</style>
