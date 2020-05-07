<template>
  <div class="follow-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell class="follow-item" v-for="(item, index) in list" :key="index">
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
        <div class="title" slot="title">{{ item.name.trim() || '黑马头条号' }}</div>
        <div class="label" slot="label">粉丝数：{{ item.fans_count }}</div>
        <follow-user
          v-if="$route.query.tab !== 'followers'"
          v-model="item.is_followed"
          :user-id="item.id"
        >
          <span v-if="item.is_followed">
            {{ item.mutual_follow ? '互相关注' : '已关注' }}
          </span>
          <span v-else>关注</span>
        </follow-user>
        <follow-user
          v-else
          v-model="item.mutual_follow"
          :user-id="item.id"
        >
          {{ item.mutual_follow ? '互相关注' : '关注' }}
        </follow-user>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getFollowingsByUser, getFollowersByUser } from '@/api/user'
import FollowUser from '@/components/follow-user'

export default {
  name: 'FollowList',
  components: {
    FollowUser
  },
  props: {
    // 默认获取用户关注列表，如果需要获取粉丝列表则指定 followers 为 true
    followers: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const params = [
          this.$route.params.userId,
          {
            page: this.page,
            perPage: this.perPage
          }
        ]

        const { data } = await (this.followers
          ? getFollowersByUser(...params)
          : getFollowingsByUser(...params))

        const { results } = data.data
        results.forEach(item => {
          item.is_followed = true
        })
        this.list.push(...results)

        this.loading = false

        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.$toast('数据获取失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.follow-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 0;
  overflow-y: auto;
}

.follow-item {
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
  .van-cell__title {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }
}
</style>
