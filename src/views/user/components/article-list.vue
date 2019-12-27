<template>
  <van-list
    class="article-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <div
      class="article-item"
      v-for="(article, index) in articles"
      :key="index"
      @click="$router.push({
        name: 'article',
        params: {
          articleId: article.art_id.toString()
        }
      })"
    >
      <div class="author">
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="user.photo"
        />
        <div>
          <div class="name">{{ user.name }}</div>
          <div class="date">{{ article.pubdate | relativeTime }}</div>
        </div>
      </div>
      <div class="title-cover" v-if="article.cover.type">
        <div class="title">{{ article.title }}</div>
        <van-image
          class="cover"
          fit="cover"
          :src="article.cover.images[0]"
        />
      </div>
      <div class="title" v-else>{{ article.title }}</div>
      <div class="action">
        <div class="action-item">
          <van-icon class="comment-icon" name="comment-o" />
          <span>{{ article.comm_count }}</span>
        </div>
        <div class="action-item">
          <van-icon name="good-job-o" />
          <span>{{ article.like_count }}</span>
        </div>
        <div class="action-item">
          <van-icon name="star-o" />
          <span>{{ article.collect_count }}</span>
        </div>
      </div>
    </div>
  </van-list>
</template>

<script>
import { getArticlesByUser } from '@/api/article'

export default {
  name: '',
  components: {},
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getArticlesByUser(this.user.id, {
        page: this.page,
        per_page: this.perPage
      })

      // 2. 将数据添加到列表中
      this.articles.push(...data.data.results)

      // 3. 停止 loading
      this.loading = false

      // 4. 判断是否还有下一页数据
      if (data.data.results.length) {
        this.page++ // 更新请求下一页数据的页码
      } else {
        this.finished = true // 将加载状态设置结束
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  .article-item {
    padding: 12px 12px 0;
    margin-bottom: 6px;
    background-color: #fff;
    .author {
      display: flex;
      align-items: center;
      .avatar {
        width: 36px;
        height: 36px;
        margin-right: 9px;
      }
      .name {
        color: #222;
        font-size: 14px;
      }
      .date {
        color: #999;
        font-size: 11.5px;
      }
    }
    .title-cover {
      padding: 14px 0;
      color: #3A3A3A;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      >.title {
        width: 65%;
      }
      .cover {
        width: 116px;
        height: 73px;
      }
    }
    >.title {
      padding: 14px 0;
      color: #3A3A3A;
      font-size: 15px;
    }
    .action {
      height: 46px;
      display: flex;
      .action-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .van-icon {
          font-size: 18px;
          margin-right: 5px;
        }
        .comment-icon {
          // top: 0px;
        }
        font-size: 14px;
      }
    }
  }
}
</style>
