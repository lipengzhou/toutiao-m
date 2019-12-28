<template>
  <div
    class="article-container page-container"
    ref="article-container"
  >
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-navbar"
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading
      v-if="loading"
      vertical
      class="article-loading"
    >加载中...</van-loading>
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div v-else-if="article.title">
      <div class="detail">
        <h3 class="title">{{ article.title }}</h3>
        <div class="author" ref="author" @click="$router.push({
          name: 'user',
          params: {
            userId: article.aut_id.toString()
          }
        })">
          <div class="base-info">
            <van-image
              round
              width="1rem"
              height="1rem"
              fit="cover"
              :src="article.aut_photo"
            />
            <div class="text">
              <p class="name">{{ article.aut_name }}</p>
              <p class="time">{{ article.pubdate | relativeTime }}</p>
            </div>
          </div>
          <!-- 如果没登录或者当前文章作者不是当前登录用户 -->
          <follow-user
            v-if="!user || article.aut_id !== user.id"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
        </div>
        <div class="content markdown-body" v-html="article.content"></div>
      </div>

      <!-- 文章评论列表 -->
      <loading-list
        v-model="articleComments"
        :fn="getArticleComments"
        v-slot="{ item }"
        :totalCount.sync="articleCommentCount"
      >
        <comment-item :comment="item" @reply-show="onReplyShow" />
      </loading-list>
      <!-- /文章评论列表 -->

      <!-- 底部区域 -->
      <div class="footer">
        <van-button
          class="write-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
        >写评论</van-button>
        <van-icon
          class="comment-icon"
          name="comment-o"
          :info="articleCommentCount"
        />
        <van-icon name="star-o" />
        <van-icon name="good-job-o" />
        <van-icon class="share-icon" name="share" />
      </div>
      <!-- /底部区域 -->
    </div>
    <!-- /文章详情 -->

    <div v-else class="error">
      <img src="./no-network.png" alt="no-network">
      <p class="text">亲，网络不给力哦~</p>
      <van-button type="default" size="normal" @click="loadArticle">点击重试</van-button>
    </div>

    <!-- 发布文章评论 -->
    <van-popup
      class="post-comment-popup"
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment :target="articleId" @post-success="onPostArticleCommentSuccess" />
    </van-popup>
    <!-- /发布文章评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <van-nav-bar :title="`${replyComment.reply_count}条回复`">
        <van-icon slot="left" name="cross" @click="isReplyShow = false" />
      </van-nav-bar>
      <comment-item :comment="replyComment" :reply="false" />
      <van-cell title="全部评论" :border="false" />
      <loading-list
        v-if="isReplyShow"
        :fn="getCommentReplies.bind(null, replyComment.com_id)"
        v-slot="{ item }"
      >
        <comment-item :comment="item" />
      </loading-list>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import {
  getArticle,
  addLike,
  deleteLike
} from '@/api/article'
import FollowUser from '@/components/follow-user'
import { mapState } from 'vuex'
import { getArticleComments, getCommentReplies } from '@/api/comment'
import LoadingList from '@/components/loading-list'
import CommentItem from './components/comment-item'
import PostComment from './components/post-comment'

export default {
  name: 'ArticlePage',
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },

  components: {
    FollowUser,
    LoadingList,
    CommentItem,
    PostComment
  },

  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {}, // 文章详情
      isPostShow: false,
      getArticleComments: getArticleComments.bind(null, this.articleId),
      getCommentReplies,
      articleCommentCount: 0,
      replyComment: {},
      isReplyShow: false,
      articleComments: []
    }
  },
  computed: {
    ...mapState(['user'])
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

    async onLike () {
      this.isLikeLoading = true
      // 如果已关注，则取消关注
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 如果没有关注，则关注
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.isLikeLoading = false
    },

    onReplyShow (comment) {
      this.replyComment = comment
      this.isReplyShow = true
    },

    onPostArticleCommentSuccess (comment) {
      this.articleComments.unshift(comment)
      this.isPostShow = false
      this.articleCommentCount++

      // 滚动到新加的评论项位置
      // const y = this.$refs['article-comment'].$el.offsetTop - 50
      // this.$refs['article-container'].scrollTop = y
    }
  }
}
</script>

<style scoped lang="less">
@import url('./github-markdown.css');

.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
  img {
    width: 70px;
  }
  .text {
    font-size: 15px;
  }
}
.detail {
  .title {
    font-size: 20px;
    color: #3A3A3A;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .base-info {
      display: flex;
      align-items: center;
    }
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
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

.comment-list {
  margin-bottom: 180px;
}

.post-comment-popup {
  box-sizing: border-box;
  padding: 10px;
  padding-right: 0;
}
</style>
