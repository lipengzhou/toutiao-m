<template>
  <div class="article-container page-container">
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
    <div v-else-if="article.title">
      <h3>{{ article.title }}</h3>
      <article-auth :article="article" />
      <div class="markdown-body" v-html="article.content"></div>

      <!-- 文章评论列表 -->
      <article-comment :article-id="articleId" />
      <!-- /文章评论列表 -->

      <!-- 底部区域 -->
      <article-footer :article="article" />
      <!-- /底部区域 -->
    </div>
    <!-- /加载完成：文章详情 -->

    <!-- 加载失败：错误页面 -->
    <error-page v-else @btn-click="loadArticle" />
    <!-- /加载失败：错误页面 -->

    <!-- 发布文章评论 -->
    <!-- <van-popup
      class="post-comment-popup"
      v-model="articleComment.isPostShow"
      position="bottom"
    >
      <post-comment :target="articleId" @post-success="onPostArticleCommentSuccess" />
    </van-popup> -->
    <!-- /发布文章评论 -->
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleAuth from '@/components/article-auth'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'
import ArticleFooter from './components/article-footer'
import ArticleComment from './components/article-comment'

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
    ArticleComment
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {}, // 文章详情
      isPostShow: false,
      currentReplyComment: {},
      isReplyShow: false
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
      } catch (err) {
        console.log(err)
      }

      // 请求结束，关闭转圈圈
      this.loading = false
    },

    onReplyShow (comment) {
      this.currentReplyComment = comment
      this.isReplyShow = true
    },

    onPostArticleCommentSuccess (comment) {
      const articleComment = this.articleComment
      articleComment.list.unshift(comment)
      articleComment.isPostShow = false
      articleComment.totalCount++

      // 滚动到新加的评论项位置
      // const y = this.$refs['article-comment'].$el.offsetTop - 50
      // this.$refs['article-container'].scrollTop = y
    },

    onPostReplySuccess (comment) {
      const commentReply = this.commentReply
      commentReply.list.unshift(comment)
      commentReply.isPostShow = false
      commentReply.totalCount++
    }
  }
}
</script>

<style scoped lang="less">
@import url('./github-markdown.css');

.markdown-body {
  padding-bottom: 50px;
}
</style>
