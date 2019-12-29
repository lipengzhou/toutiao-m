<template>
  <div
    class="article-item"
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
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
      <div>
        <div class="name">{{ article.aut_name }}</div>
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
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {}
}
</script>

<style scoped lang="less">
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
</style>
