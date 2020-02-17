<template>
  <!-- 无图 -->
  <div
    v-if="article.cover.type === 0"
    class="article-item article-item-0"
    @click="onItemClick"
  >
    <div class="title">{{ article.title }}</div>
    <div class="label">
      <span>{{ article.aut_name }}</span>
      <span>{{ article.comm_count }}评论</span>
      <span>{{ article.pubdate | relativeTime }}</span>
    </div>
  </div>
  <!-- /无图 -->

  <!-- 三图 -->
  <div
    v-else-if="article.cover.type === 3"
    class="article-item article-item-3"
    @click="onItemClick"
  >
    <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <div class="cover">
      <van-image
        fit="cover"
        class="cover-item"
        :src="img"
        v-for="(img, index) in article.cover.images"
        :key="index"
        lazy-load
      />
    </div>
    <div class="label">
      <span>{{ article.aut_name }}</span>
      <span>{{ article.comm_count }}评论</span>
      <span>{{ article.pubdate | relativeTime }}</span>
    </div>
  </div>
  <!-- /三图 -->

  <!-- 单图 -->
  <div
    v-else
    class="article-item article-item-1"
    @click="onItemClick"
  >
    <div class="title-label">
      <div class="title van-multi-ellipsis--l3">{{ article.title }}</div>
      <div class="label">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
      class="cover"
      fit="cover"
      :src="article.cover.images[0]"
      lazy-load
    />
  </div>
  <!-- /单图 -->
</template>

<script>
export default {
  name: 'ArticleInfo',
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
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onItemClick () {
      this.$router.push({
        name: 'article',
        params: {
          articleId: this.article.art_id.toString()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.article-item {
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: 0 20px;
  background: #fff;
  .title {
    font-size: 15px;
  }
  .label {
    font-size: 12px;
    color: #b4b4b4;
    span {
      margin-right: 14px;
    }
  }
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0px;
    bottom: 0;
    left: 20px;
    right: 20px;
    border-bottom: 0.02667rem solid #ebedf0;
    transform: scaleY(0.5);
  }
}

.article-item-0 {
  flex-direction: column;
  justify-content: space-evenly;
  height: 68px;
}

.article-item-3 {
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 169px;
  max-height: 185px;
  .cover {
    display: flex;
    justify-content: space-between;
    .cover-item {
      width: 110px;
      height: 73px;
    }
  }
}

.article-item-1 {
  height: 111px;
  align-items: center;
  justify-content: space-between;
  .title-label {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 200px;
    height: 80px;
  }
  .cover {
    width: 120px;
    height: 80px;
  }
}
</style>
