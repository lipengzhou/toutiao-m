<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <form class="fixed" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @focus="isResultShow = false"
        @input="onSearchInput"
        @cancel="$router.back()"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 搜索结果 -->
    <article-list v-if="isResultShow" q="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <van-cell-group v-else-if="searchText">
      <van-cell
        icon="search"
        :key="item"
        v-for="item in suggestions"
        @click="onSearch(item)"
      >
        <!-- 我们要把 item 处理成带有高亮的字符串 -->
        <!-- 过滤器：专门用于文本格式化，但是它只能用在 {{}} 和 v-bind 中 -->
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <div v-show="isDeleteShow">
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon
          v-show="!isDeleteShow"
          name="delete"
          @click="isDeleteShow = true"
        />
      </van-cell>
      <van-cell
        :title="item"
        :key="item"
        v-for="(item, index) in searchHistories"
        @click="onSearch(item)"
      >
        <van-icon
          v-show="isDeleteShow"
          name="close"
          @click.stop="searchHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'
import { debounce } from 'lodash'
import ArticleList from './components/article-list'

export default {
  name: 'SearchPage',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      suggestions: [], // 搜索联想建议数据列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false, // 控制删除历史记录的显示状态
      isResultShow: false
    }
  },
  computed: {},
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {},
  methods: {
    // 搜索处理函数
    onSearch (q) {
      if (!q.trim()) {
        return
      }

      // 在跳转之前将搜索的关键字记录到搜索历史记录中
      const index = this.searchHistories.indexOf(q)
      if (index !== -1) {
        // 不要重复的
        this.searchHistories.splice(index, 1)
      }

      // 最新的在最前面
      this.searchHistories.unshift(q)

      // 展示搜索结果
      this.isResultShow = true
    },

    onSearchInput: debounce(async function () {
      const searchText = this.searchText
      if (!searchText) {
        return
      }
      const { data } = await getSuggestions(searchText)
      this.suggestions = data.data.options
    }, 300),

    highlight (str) {
      const searchText = this.searchText
      const reg = new RegExp(searchText, 'ig')
      const content = `<span style="color: red">${searchText}</span>`
      return str.replace(reg, content)
    }
  },
  beforeRouteLeave (to, from, next) {
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
.search-container {
  padding-top: 54px;
  .fixed {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
