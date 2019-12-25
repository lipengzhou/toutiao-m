<template>
  <div class="user-info-container">
    <div class="row1">
      <van-image
        class="col1"
        fit="cover"
        round
        :src="user.photo"
      />
      <div class="col2">
        <div class="row1">
          <div class="item">
            <div class="count">{{ user.art_count }}</div>
            <div class="text">发布</div>
          </div>
          <div class="item">
            <div class="count">{{ user.follow_count }}</div>
            <div class="text">关注</div>
          </div>
          <div class="item">
            <div class="count">{{ user.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
          <div class="item">
            <div class="count">{{ user.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </div>
        <div>
          <!-- 如果当前登录用户的 id !== 文章作者id，则显示关注 -->
          <follow-user
            v-if="user.id && user.id.toString() !== $store.state.user.id.toString()"
            v-model="user.is_following"
            :user-id="user.id"
          />
          <!-- 否则显示编辑资料 -->
          <van-button
            v-else
            type="default"
            size="small"
            @click="$router.push('/profile')"
          >编辑资料</van-button>
        </div>
      </div>
    </div>
    <div class="intro-wrap">
      <div v-if="user.is_media">
        <span>认证：</span>
        <span>{{ user.certi }}</span>
      </div>
      <div>
        <span>简介：</span>
        <span>{{ user.intro }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import FollowUser from '@/components/follow-user'

export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    FollowUser
  }
}
</script>

<style scoped lang="less">
.user-info-container {
  padding: 12px;
  background-color: #fff;
  margin-bottom: 10px;
  >.row1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .item {
      text-align: center;
      .text {
        font-size: 12px;
      }
    }
    >.col1 {
      width: 80px;
      height: 80px;
    }
    >.col2 {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: 80%;
      height: 80px;
      padding: 0 12px;
      >.row1 {
        display: flex;
        justify-content: space-between;
      }
      .van-button {
        width: 50%;
      }
    }
  }
}
</style>
