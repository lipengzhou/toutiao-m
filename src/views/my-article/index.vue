<template>
  <div class="myarticle-container page-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-navbar"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章标签列表 -->
    <van-tabs
      class="fixed-tabs"
      v-model="active"
      title-active-color="#3c9bfa"
      color="#399afa"
    >
      <van-tab :title="tab.title" v-for="tab in tabs" :key="tab.title">
        <loading-list :fn="tab.fn" v-slot="{ item }">
          <article-item :article="item" />
        </loading-list>
      </van-tab>
    </van-tabs>
    <!-- /文章标签列表 -->
  </div>
</template>

<script>
import LoadingList from '@/components/loading-list'
import ArticleItem from './components/article-item'
import {
  getUserCollectArticles,
  getUserHistoryArticles
} from '@/api/article'

export default {
  name: 'MyArticle',
  components: {
    LoadingList,
    ArticleItem
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      active: this.getInitialActive(),
      tabs: [
        {
          title: '收藏',
          fn: getUserCollectArticles
        },
        {
          title: '历史',
          fn: getUserHistoryArticles
        }
      ]
    }
  },
  computed: {
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    getInitialActive () {
      const active = ['collect', 'history', undefined].indexOf(this.type)
      return active !== -1 ? active : 0
    }
  }
}
</script>

<style scoped></style>
