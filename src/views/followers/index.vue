<template>
  <div class="page-container">
    <van-nav-bar
      class="page-navbar"
      left-arrow
      fixed
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
        <van-tab title="关注"></van-tab>
        <van-tab title="粉丝"></van-tab>
      </van-tabs>
    </van-nav-bar>

    <loading-list
      :fn="fn"
      v-slot="{ item }"
    >
      <van-cell class="list-item">
        <van-image
          class="avatar"
          round
          :src="item.photo"
          fit="cover"
          slot="icon"
          @click="$router.push({
            name: 'user',
            params: {
              userId: item.id
            }
          })"
        />
        <span class="title" slot="title">{{ item.name.trim() || '黑马头条号' }}</span>
        <span class="label" slot="label">粉丝数：{{ item.fans_count }}</span>
        <van-button size="small">关注</van-button>
      </van-cell>
    </loading-list>
  </div>
</template>

<script>
import LoadingList from '@/components/loading-list'
import { getFollowersByUser } from '@/api/user'

export default {
  name: 'FollowAndFans',
  components: {
    LoadingList
  },
  props: {
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      active: 0,
      fn: getFollowersByUser.bind(null, this.userId)
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
