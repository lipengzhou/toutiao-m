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
