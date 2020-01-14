<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        background="#3296fa"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :q="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :q="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
      v-else
      v-model="searchHistories"
      @search="onSearch"
    />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchResult from './components/search-result'
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  components: {
    SearchResult,
    SearchSuggestion,
    SearchHistory
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索框内容
      isResultShow: false, // 搜索结果的显示状态
      suggestions: [], // 联想建议
      searchHistories: getItem('search-histories') || [] // 搜索历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (q) {
      // q: 文本框数据本身、联想建议文本、历史记录文本
      // 1. 修改搜索框的文本内容
      this.searchText = q

      // 2. 记录搜索历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.indexOf(this.searchText)
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      searchHistories.unshift(this.searchText)

      // 3. 展示搜索结果
      this.isResultShow = true
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 54px;
  // 让搜索栏固定在顶部
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
