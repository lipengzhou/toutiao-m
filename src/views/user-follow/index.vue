<template>
  <div class="user-follow">
    <van-nav-bar
      class="page-navbar"
      left-arrow
      @click-left="$router.back()"
    >
      <van-tabs
        v-model="active"
        slot="title"
        background="#3296fa"
        color="#fff"
        title-inactive-color="#fff"
        title-active-color="#fff"
        :border="false"
      >
        <van-tab title="关注" :to="`/user/${userId}/follow`" replace>
          <follow-list />
        </van-tab>
        <van-tab title="粉丝" :to="`/user/${userId}/follow?tab=followers`" replace>
          <follow-list followers />
        </van-tab>
      </van-tabs>
    </van-nav-bar>
  </div>
</template>

<script>
import FollowList from './components/follow-list'

export default {
  name: 'UserFollow',
  components: {
    FollowList
  },
  props: {
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      active: this.$route.query.tab === 'followers' ? 1 : 0
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.list-item {
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
    margin-right: 13px;
  }
  .title {
    font-size: 14px;
  }
  .label {
    font-size: 12px;
    color: #999999;
  }
}
</style>
