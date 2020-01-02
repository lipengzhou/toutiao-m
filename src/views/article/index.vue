<template>
  <div class="article-container page-container" ref="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-navbar"
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中：loading -->
    <loading-page v-if="loading" />
    <!-- /加载中：loading -->

    <!-- 加载完成：文章详情 -->
    <template v-else-if="article.title">
      <div class="detail">
        <h3>{{ article.title }}</h3>
        <article-auth :article="article" />
        <div
          class="markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>

      <van-cell ref="comment-area-tip" title="全部评论" :border="false" />

      <!-- 文章评论列表 -->
      <comment-list
        v-model="articleComments"
        :source="articleId"
        :total-count.sync="commentCount"
        @click-reply="onReplyShow"
      />
      <!-- /文章评论列表 -->

      <!-- 底部区域 -->
      <article-footer
        :article="article"
        :comment-count="commentCount"
        @click-write="isPostCommentShow = true"
        @click-comment="onCommentClick"
      />
      <!-- /底部区域 -->
    </template>
    <!-- /加载完成：文章详情 -->

    <!-- 加载失败：错误页面 -->
    <error-page v-else @btn-click="loadArticle" />
    <!-- /加载失败：错误页面 -->

    <!-- 发布文章评论 -->
    <van-popup
      v-model="isPostCommentShow"
      position="bottom"
      get-container="body"
    >
      <post-comment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布文章评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      get-container="body"
      :style="{ height: '90%' }"
    >
      <comment-reply
        v-if="isReplyShow"
        :article-id="articleId"
        :comment="currentReplyComment"
        @click-close="isReplyShow = false"
      />
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleAuth from '@/components/article-auth'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'
import ArticleFooter from './components/article-footer'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
import { ImagePreview } from 'vant'

export default {
  name: 'ArticlePage',
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    ArticleAuth,
    LoadingPage,
    ErrorPage,
    ArticleFooter,
    CommentList,
    PostComment,
    CommentReply
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {}, // 文章详情
      currentReplyComment: {},
      isReplyShow: false,
      isPostCommentShow: false,
      articleComments: [],
      commentCount: 0
    }
  },
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 开启转圈圈
      this.loading = true

      try {
        const res = await getArticle(this.articleId)
        this.article = res.data.data

        // 给文章内容中的图片添加点击预览
        setTimeout(() => {
          this.addImagePreview()
        }, 0)
      } catch (err) {
        console.log(err)
        this.$toast.fail('获取数据失败')
      }

      // 请求结束，关闭转圈圈
      this.loading = false
    },

    onReplyShow (comment) {
      this.currentReplyComment = comment
      this.isReplyShow = true
    },

    onPostSuccess (comment) {
      // 将新添加的评论展示到顶部
      this.articleComments.unshift(comment)

      // 评论总数+1
      this.commentCount++

      // 关闭发布评论弹窗
      this.isPostCommentShow = false
    },

    addImagePreview () {
      const imgs = this.$refs['article-content'].querySelectorAll('img')
      const imgPaths = Array.from(imgs).map(img => img.src)
      imgs.forEach((img, index) => {
        img.addEventListener('click', () => ImagePreview({
          images: imgPaths,
          startPosition: index
        }))
      })
    },

    onCommentClick () {
      // 让页面滚动到评论区
      const articleContainer = this.$refs['article-container']
      const commentAreaTip = this.$refs['comment-area-tip']
      articleContainer.scrollTop = commentAreaTip.offsetTop - 50
    }
  }
}
</script>

<style scoped lang="less">
@import url('./github-markdown.css');
.article-container {
  height: 100%;
  overflow: scroll;
  background: #fff;
}

.detail {
  padding: 0 20px;
}

.markdown-body {
  padding-bottom: 50px;
}
</style>
