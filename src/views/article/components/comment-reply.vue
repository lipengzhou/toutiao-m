<template>
  <div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count + '条回复'">
      <van-icon slot="left" name="cross" @click="$emit('close-reply')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
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
          <span style="margin-right: 10px;">{{ comment.pubdate }}</span>
          <van-button
            size="mini"
            type="default"
          >回复 {{ comment.reply_count }}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->

    <van-cell title="全部评论" />

    <!-- 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.com_id.toString()"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
            <van-button
              size="mini"
              type="default"
              @click="onReplyShow(item)"
            >回复</van-button>
          </p>
        </div>
        <van-icon
          slot="right-icon"
          color="red"
          :name="item.is_liking ? 'like' : 'like-o'"
          @click="onCommentLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="inputComment"
        clearable
        placeholder="请输入评论内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="onAddComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import {
  getComments,
  addComment,
  addCommentLike,
  deleteCommentLike
} from '@/api/comment'

export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页评论数据的页码（偏移量）
      inputComment: '' // 添加评论输入框文本
    }
  },

  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const res = await getComments({
        type: 'c', // a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        // limit // 每页大小
      })

      // 2. 将数据添加到列表中
      this.list.push(...res.data.data.results)

      // 3. 关闭转圈圈
      this.loading = false

      // 4. 判断如果没有数据了，则将 finished 设置为 true
      const lastId = res.data.data.last_id
      if (lastId) {
        // 更新获取下一个数据的页码（偏移量）
        this.offset = lastId
      } else {
        this.finished = true
      }
    },

    async onAddComment () {
      const inputComment = this.inputComment.trim()

      // 非空校验
      if (!inputComment.length) {
        return
      }

      // 请求添加
      const res = await addComment({
        target: this.comment.com_id, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: inputComment, // 评论内容
        art_id: this.$route.params.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })

      // 将发布的最新评论展示到列表顶部
      this.list.unshift(res.data.data.new_obj)

      // 清空文本框
      this.inputComment = ''
    },

    async onCommentLike (comment) {
      // 如果已经赞了则取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(comment.com_id)
      } else {
        // 如果没有赞，则点赞
        await addCommentLike(comment.com_id)
      }

      // 更新视图状态
      comment.is_liking = !comment.is_liking
      this.$toast('操作成功')
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
