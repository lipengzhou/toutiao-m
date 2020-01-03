<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell
      v-for="item in list"
      :key="item.art_id.toString()"
      :title="item.title"
      @click="$router.push({
        name: 'article',
        params: {
          articleId: item.art_id.toString()
        }
      })"
    />
  </van-list>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'ArticleList',
  components: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 10
    }
  },
  watch: {},
  created () {},
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数，不传默认为1
        per_page: this.perPage, // 每页数量，不传每页数量由后端决定
        q: this.q // 搜索关键词
      })

      // 2. 将数据添加到数据列表中
      const { results } = data.data
      this.list.push(...results)

      // 3. 将本次的 loading 设置为 false
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped></style>
