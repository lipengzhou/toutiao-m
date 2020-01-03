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
    <loading-list :fn="getArticlesByUser" v-slot="{ item }">
      <article-item :article="item" />
    </loading-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import { getArticlesByUser } from '@/api/article'
import UserInfo from './components/user-info'
import LoadingList from '@/components/loading-list'
import ArticleItem from './components/article-item'

export default {
  name: 'UserPage',
  components: {
    UserInfo,
    LoadingList,
    ArticleItem
  },
  props: {
    userId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      user: {
        id: this.userId
      }, // 用户信息
      getArticlesByUser: getArticlesByUser.bind(null, this.userId)
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
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 如果是去 文章详情 页面，则缓存
    const { name: pageName } = this.$options
    if (to.name === 'article') {
      this.$store.commit('addCachePage', pageName)
    } else {
      // 如果是去其他页面，则不缓存
      this.$store.commit('removeCachePage', pageName)
    }
    next()
  }
}
</script>

<style scoped lang="less">
.user-container {
}
</style>
