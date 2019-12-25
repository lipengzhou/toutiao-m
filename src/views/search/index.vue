<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @click="onSearch(searchText)"
        @input="onSearchInput"
      >
        <div class="cancel" slot="action" @click="$router.back()">取消</div>
      </van-search>
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group v-show="searchText">
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
    <van-cell-group v-show="!searchText">
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

export default {
  name: 'SearchPage',
  components: {},
  props: {},
  data () {
    return {
      str: 'hello <span style="color: red">world</span>',
      searchText: '', // 用户输入的搜索文本
      suggestions: [], // 搜索联想建议数据列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false // 控制删除历史记录的显示状态
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

      // 将搜索历史记录放到本次存储，以便持久化
      // 注意：这里不能利用 watch 监视统一处理，务必要手动调用本地存储持久化
      //       因为后面有一个路由页面跳转，还没来得及的 watch 到呢，页面已经跳转了
      setItem('search-histories', this.searchHistories)

      this.$router.push(`/search/${q}`)
    },

    onSearchInput: debounce(async function () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const res = await getSuggestions(this.searchText)
      this.suggestions = res.data.data.options
    }, 300),

    // async onSearchInput () {
    //   const searchText = this.searchText.trim()
    //   if (!searchText) {
    //     return
    //   }
    //   const res = await getSuggestions(this.searchText)
    //   this.suggestions = res.data.data.options
    // },

    highlight (str) {
      // /this.searchText/  注意：/这里的一切都是字符串/
      // 如果想要动态的创建一个正则表达式，使用 new RegExp 手动构造
      // 它会根据字符串创建一个正则表达式对象
      // 参数2：用来指定匹配模式，例如 g 全局，i 忽略大小写
      // /dsadsa/gi
      const reg = new RegExp(this.searchText, 'ig')
      return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/styles/variables.less";

.search-container {
  .cancel {
    color: @color-primary;
  }
}
</style>
