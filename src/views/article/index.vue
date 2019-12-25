<template>
  <div
    class="article-container"
    ref="article-container"
    @scroll="onArticleScroll"
  >
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-navbar"
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
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
        <div class="author" ref="author">
          <div class="base-info" @click="$router.push({
            name: 'user',
            params: {
              userId: article.aut_id.toString()
            }
          })">
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
          <follow-user
            v-if="article.aut_id.toString() !== $store.state.user.id.toString() && article.aut_id"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
        </div>
        <div class="content markdown-body" v-html="article.content"></div>
        <div class="zan">
          <van-button
            round
            size="small"
            hairline
            :type="article.attitude === 1 ? 'danger' : 'default'"
            plain
            :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'"
            @click="onLike"
            :loading="isLikeLoading"
          >{{ article.attitude === 1 ? '取消点赞' : '点赞' }}</van-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <van-button
            round
            size="small"
            hairline
            :type="article.attitude === 0 ? 'danger' : 'default'"
            plain
            icon="delete"
            @click="onDislike"
            :loading="isUnLikeLoading"
          >{{ article.attitude === 0 ? '取消不喜欢' : '不喜欢' }}</van-button>
        </div>
      </div>

      <!-- 文章评论列表 -->
      <article-comment
        class="comment-list"
        ref="article-comment"
        @add-success="onAddSuccess"
      />
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
        <van-icon class="comment-icon" name="comment-o" info="9" />
        <van-icon name="star-o" />
        <van-icon class="share-icon" name="share" />
      </div>
      <!-- /底部区域 -->

      <!-- 发布文章评论 -->
      <van-popup
        class="post-popup"
        v-model="isPostShow"
        position="bottom"
        @opened="onOpen"
      >
        <van-row type="flex" align="center">
          <van-col span="20">
            <van-field
              ref="post-input"
              rows="2"
              v-model="message"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入留言"
              show-word-limit
            />
          </van-col>
          <van-col
            class="post-btn"
            span="4"
            :style="{ color: message.length ? '#4a8ecf' : '#666' }"
            @click="onPostMessage"
          >发布</van-col>
        </van-row>
      </van-popup>
      <!-- /发布文章评论 -->
    </div>
    <!-- /文章详情 -->

    <div v-else class="error">
      <img src="./no-network.png" alt="no-network">
      <p class="text">亲，网络不给力哦~</p>
      <van-button type="default" size="normal" @click="loadArticle">点击重试</van-button>
    </div>
  </div>
</template>

<script>
import {
  getArticle,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike
} from '@/api/article'
import ArticleComment from './components/article-comments'
import { throttle } from 'lodash'
import FollowUser from '@/components/follow-user'

export default {
  name: 'ArticlePage',

  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },

  components: {
    ArticleComment,
    FollowUser
  },

  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {}, // 文章详情
      isLikeLoading: false,
      isUnLikeLoading: false,
      isPostShow: false,
      message: ''
    }
  },

  created () {
    this.loadArticle()
  },

  mounted () {
  },

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

    async onDislike () {
      this.isUnLikeLoading = true
      // 如果已关注，则取消关注
      if (this.article.attitude === 0) {
        await deleteDislike(this.articleId)
        this.article.attitude = -1
      } else {
        // 如果没有关注，则关注
        await addDislike(this.articleId)
        this.article.attitude = 0
      }
      this.isUnLikeLoading = false
    },

    onAddSuccess () {
      const y = this.$refs['article-comment'].$el.offsetTop - 50
      this.$refs['article-container'].scrollTop = y
    },

    onArticleScroll: throttle(function () {
      // console.log(this.$refs['author'].offsetHeight)
    }, 500),

    onOpen () {
      setTimeout(() => {
        this.$refs['post-input'].focus()
      }, 1000)
    },

    onPostMessage () {
    }
  }
}
</script>

<style scoped lang="less">
@import url('./github-markdown.css');

.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
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
  padding: 50px 15px;
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
    width: 200px;
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

.post-popup {
  box-sizing: border-box;
  padding: 10px;
  padding-right: 0;
  .van-cell {
    background-color: #f5f7f9;
  }
  .post-btn {
    font-size: 15px;
    text-align: center;
  }
}
</style>
