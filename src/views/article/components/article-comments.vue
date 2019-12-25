<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="已显示全部评论"
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
        <div slot="right-icon" class="like-container">
          <van-icon
            color="red"
            :name="item.is_liking ? 'good-job' : 'good-job-o'"
            @click="onCommentLike(item)"
          />
          <span>{{ item.like_count ? item.like_count : '赞' }}</span>
        </div>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
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
          :loading="isSubmitLoading"
        >发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      get-container="body"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 回复列表 -->
      <comment-reply
        :comment="currentComment"
        v-if="isReplyShow"
        @close-reply="isReplyShow = false"
      />
      <!-- /回复列表 -->
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import {
  getComments,
  addComment,
  addCommentLike,
  deleteCommentLike
} from '@/api/comment'
import CommentReply from './comment-reply'

export default {
  name: 'ArticleComment',
  props: {},
  components: {
    CommentReply
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页评论数据的页码（偏移量）
      inputComment: '', // 添加评论输入框文本
      isReplyShow: false, // 控制回复弹层的显示
      currentComment: {}, // 当前查看回复的评论对象
      isSubmitLoading: false
    }
  },

  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const res = await getComments({
        type: 'a', // a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.$route.params.articleId.toString(), // 源id，文章id或评论id
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

      // 开启 loading
      this.isSubmitLoading = true

      try {
        // 请求添加
        const res = await addComment({
          target: this.$route.params.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: inputComment // 评论内容
          // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })

        // 将发布的最新评论展示到列表顶部
        res.data.data.new_obj.is_liking = false
        this.list.unshift(res.data.data.new_obj)

        // 清空文本框
        this.inputComment = ''

        this.$nextTick(() => {
          this.$emit('add-success')
        })
      } catch (err) {
        console.log(err)
        this.$toast('发布失败')
      }

      // 结束 loading
      this.isSubmitLoading = false
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
      comment.like_count += comment.is_liking ? 1 : -1
      this.$toast('操作成功')
    },

    async onReplyShow (comment) {
      this.currentComment = comment
      // 显示回复的弹层
      this.isReplyShow = true
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

.like-container {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
</style>
