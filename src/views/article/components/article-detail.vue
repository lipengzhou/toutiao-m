<template>
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
</template>

<script>
import { mapState } from 'vuex'
import FollowUser from '@/components/follow-user'

export default {
  name: 'ArticleDetail',
  components: {
    FollowUser
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {},
  methods: {}
}
</script>

<style scoped lang="less">
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
</style>
