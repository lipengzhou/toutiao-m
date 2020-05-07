<template>
  <div class="page-container">
    <!-- 评论回复 -->
    <van-nav-bar class="nav-bar" :title="`${commentCount}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>

    <comment-item :comment="comment" :reply="false" />

    <van-cell title="全部评论" :border="false" />

    <!-- 回复列表 -->
    <comment-list
      :source="comment.com_id"
      is-comment
      v-model="comments"
      :total-count.sync="commentCount"
      @click-reply="onClickReply"
    />
    <!-- /回复列表 -->

    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="onWriteClick"
      >写评论</van-button>
    </div>
    <!-- /评论回复 -->

    <!-- 发布评论回复 -->
    <van-popup
      class="post-comment-popup"
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment
        :target="target"
        :article-id="articleId"
        @post-success="onPostSuccess"
        :reply-to="replyTo"
      />
    </van-popup>
    <!-- /发布评论回复 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'
import {
  addCommentLike,
  deleteCommentLike
} from '@/api/comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      comments: [],
      commentCount: 0,
      isPostShow: false,
      target: this.comment.com_id,
      replyTo: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onPostSuccess (comment) {
      // 将新添加的评论展示到顶部
      this.comments.unshift(comment)

      // 更新评论总数
      this.commentCount++

      // 更新当前评论中的总数量
      this.comment.reply_count++

      // 关闭发布弹窗
      this.isPostShow = false
    },

    onClickReply (comment) {
      this.target = comment.com_id
      this.replyTo = comment
      this.isPostShow = true
    },

    onWriteClick () {
      this.target = this.comment.com_id
      this.replyTo = null
      this.isPostShow = true
    },

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

<style scoped lang="less">
.nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 10%;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .write-btn {
    width: 60%;
  }
  .van-icon {
    font-size: 20px;
  }
  .comment-icon {
    bottom: -2px;
  }
  .share-icon {
    bottom: -2px;
  }
}
</style>
