<template>
  <!-- 文章评论列表 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="以展示所有评论"
    @load="onLoad"
  >
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
    />
  </van-list>
  <!-- /文章评论列表 -->
</template>

<script>
import CommentItem from './comment-item'
import { getComments } from '@/api/comment'
import { mapMutations } from 'vuex'

export default {
  name: 'ArticleComment',
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    ...mapMutations('article', ['setCommentCount']),
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getComments({
        type: 'a',
        source: this.articleId.toString(),
        offset: this.offset,
        limit: this.limit
      })

      // 2. 将数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      this.setCommentCount(data.data.total_count)

      // 3. 结束 loading
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped></style>
