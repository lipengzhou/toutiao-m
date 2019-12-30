<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      round
      width="30"
      height="30"
      style="margin-right: 10px;"
      :src="comment.aut_photo"
    />
    <span style="color: #466b9d;" slot="title">{{ comment.aut_name }}</span>
    <div slot="label">
      <p style="color: #363636;">{{ comment.content }}</p>
      <p>
        <span style="margin-right: 10px;">{{ comment.pubdate | relativeTime }}</span>
        <van-button
          v-if="reply"
          size="mini"
          type="default"
          @click="$emit('click-reply')"
        >回复 {{ comment.reply_count }}</van-button>
      </p>
    </div>
    <div slot="right-icon" class="like-container">
      <van-icon
        :color="comment.is_liking ? '#e5645f' : ''"
        :name="comment.is_liking ? 'good-job' : 'good-job-o'"
        @click="onCommentLike(comment)"
      />
      <span>{{ comment.like_count ? comment.like_count : '赞' }}</span>
    </div>
  </van-cell>
</template>

<script>
import {
  addCommentLike,
  deleteCommentLike
} from '@/api/comment'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    },
    reply: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    async onCommentLike (comment) {
      try {
        // 如果已经赞了则取消点赞
        if (comment.is_liking) {
          await deleteCommentLike(comment.com_id)
        } else {
          // 如果没有赞，则点赞
          await addCommentLike(comment.com_id)
        }

        // 更新视图状态
        comment.is_liking = !comment.is_liking
        comment.like_count += comment.is_liking ? 1 : -1
        this.$toast.success(comment.is_liking ? '点赞成功' : '取消点赞')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped>
.comment-item {
  display: flex;
  align-items: flex-start;
}

.like-container {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
</style>
