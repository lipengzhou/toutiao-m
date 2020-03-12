<template>
  <div class="footer">
    <van-button
      class="write-btn"
      type="default"
      round
      size="small"
      @click="$emit('click-write')"
    >写评论</van-button>
    <van-icon
      class="comment-icon"
      name="comment-o"
      :info="commentCount"
      @click="$emit('click-comment')"
    />
    <van-icon
      :color="article.is_collected ? 'orange' : ''"
      :name="article.is_collected ? 'star' : 'star-o'"
      @click="onCollect"
    />
    <van-icon
      :color="article.attitude === 1 ? '#e5645f' : ''"
      :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
      @click="onLike"
    />
    <!-- <van-icon class="share-icon" name="share" /> -->
  </div>
</template>

<script>
import {
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'

export default {
  name: 'ArticleFooter',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCollect () {
      try {
        const article = this.article
        if (article.is_collected) {
          await deleteCollect(article.art_id.toString())
        } else {
          await addCollect(article.art_id.toString())
        }
        article.is_collected = !article.is_collected
        this.$toast.success(article.is_collected ? '收藏成功' : '取消收藏')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },

    async onLike () {
      try {
        const article = this.article
        if (article.attitude === 1) {
          await deleteLike(article.art_id.toString())
        } else {
          await addLike(article.art_id.toString())
        }
        article.attitude = article.attitude === -1 ? 1 : -1
        this.$toast.success(article.attitude === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
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
    width: 160px;
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
