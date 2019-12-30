<template>
  <!-- 文章评论列表 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已展示所有评论"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(comment, index) in value"
      :key="index"
      :comment="comment"
      @click-reply="$emit('click-reply', comment)"
    />
  </van-list>
  <!-- /文章评论列表 -->
</template>

<script>
import CommentItem from './comment-item'
import { getComments } from '@/api/comment'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    // 查看文章评论：文章ID
    // 查看评论回复：评论ID
    source: {
      type: [String, Number, Object],
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number
    },
    isComment: {
      type: Boolean,
      default: false
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
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getComments({
        type: this.isComment ? 'c' : 'a', // 查看文章评论：a，查看评论回复：c
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit
      })

      // 2. 将数据放到列表中
      const { results, total_count: totalCount } = data.data
      const arr = this.value.slice()
      arr.push(...results)
      this.$emit('input', arr)
      this.$emit('update:total-count', totalCount)

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
