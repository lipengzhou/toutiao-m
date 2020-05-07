<template>
  <div class="my-container">
    <!-- 已登录：用户信息 -->
    <div class="user-info-wrap" v-if="$store.state.user">
      <div class="base-info-wrap">
        <div class="avatar-title-wrap" @click="$router.push({
          name: 'user',
          params: {
            userId: user.id
          }
        })">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="user.photo"
          />
          <div class="title">{{ user.name }}</div>
        </div>
        <van-button
          round
          size="mini"
          @click="$router.push('/user/profile')"
        >编辑资料</van-button>
      </div>
      <van-grid class="data-info" :border="false">
        <van-grid-item>
          <span class="count">{{ user.art_count }}</span>
          <span class="text">头条</span>
        </van-grid-item>
        <van-grid-item :to="`/user/${user.id}/follow`">
          <span class="count">{{ user.follow_count }}</span>
          <span class="text">关注</span>
        </van-grid-item>
        <van-grid-item :to="`/user/${user.id}/follow?tab=followers`">
          <span class="count">{{ user.fans_count }}</span>
          <span class="text">粉丝</span>
        </van-grid-item>
        <van-grid-item>
          <span class="count">{{ user.like_count }}</span>
          <span class="text">获赞</span>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /已登录：用户信息 -->

    <!-- 未登录 -->
    <div class="not-login" v-else>
      <div
        class="mobile"
        @click="$router.push({
          name: 'login',
          query: {
            redirect: '/my'
          }
        })"
      ></div>
      <div class="text">点击登录</div>
    </div>
    <!-- /未登录 -->

    <!-- 其它 -->
    <van-grid clickable :column-num="2">
      <van-grid-item text="收藏" to="/my-article/collect">
        <van-icon slot="icon" name="star-o" color="#eb5253" />
      </van-grid-item>
      <van-grid-item text="历史" to="/my-article/history">
        <van-icon slot="icon" name="browsing-history-o" color="#ffa023" />
      </van-grid-item>
    </van-grid>

    <van-cell-group :border="false">
      <!-- <van-cell title="消息通知" is-link /> -->
      <van-cell title="小智同学" is-link @click="$router.push('/user/chat')" />
    </van-cell-group>

    <van-cell-group v-if="$store.state.user">
      <van-cell
        style="text-align: center;"
        title="退出登录"
        clickable
        @click="onLogout"
      />
    </van-cell-group>
    <!-- /其它 -->
  </div>
</template>

<script>
import { getSelf } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'MyPage',
  data () {
    return {
      user: {} // 用户信息对象
    }
  },
  created () {
    if (this.$store.state.user) {
      this.loadUser()
    }
    globalBus.$on('user-update', () => {
      this.loadUser()
    })
  },
  activated () {
    if (this.$store.state.user) {
      this.loadUser()
    }
  },
  methods: {
    onLogout () {
      // Dialog 组件既可以在模板中使用
      // 也可以通过 JavaScript 来调用
      // 模板中使用 van-dialog
      // JavaScript 调用：this.$dialog
      this.$dialog.confirm({
        title: '退户确认',
        message: '退出当前头条账号，将不能同步收藏，发布评论和云端分享等'
      }).then(() => {
        // 确认执行这里

        // 清除容器和本地存储的数据
        this.$store.commit('setUser', null)
      }).catch(() => {
        // 取消执行这里
      })
    },

    async loadUser () {
      const res = await getSelf()
      this.user = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .user-info-wrap {
    background: url("./banner.png") no-repeat;
    height: 182px;
    box-sizing: border-box;
    background-size: cover;
    padding: 40px 20px;
    font-size: 15px;
    color: #fff;
    .base-info-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .avatar-title-wrap {
        display: flex;
        align-items: center;
        .avatar {
          margin-right: 15px;
          width: 66px;
          height: 66px;
          padding: 2px;
          background: #fff;
        }
      }
    }
    .data-info {
      ::v-deep .van-grid-item__content {
        background: none;
      }
    }
  }

  .not-login {
    background: url("./banner.png") no-repeat;
    height: 182px;
    box-sizing: border-box;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .mobile {
      background: url("./mobile.png") no-repeat;
      background-size: cover;
      width: 66px;
      height: 66px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  > .van-cell-group {
    margin-top: 10px;
  }
}
</style>
