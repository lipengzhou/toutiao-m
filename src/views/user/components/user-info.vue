<template>
  <div class="user-info-container">
    <div class="row1">
      <van-image
        class="col1"
        fit="cover"
        round
        :src="user.photo"
        @click="onPreview(user.photo)"
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
        <div class="action">
          <!--
            展示条件：如果没有登录 || 当前页面用户非登录用户
          -->
          <template v-if="!sessionUser || user.id !== sessionUser.user_id">
            <van-button
              type="primary"
              size="small"
              @click="$router.push('/user/chat')"
            >私信</van-button>
            <follow-user
              v-model="user.is_following"
              :user-id="user.id"
            />
          </template>
          <!-- 否则显示编辑资料 -->
          <van-button
            v-else
            type="default"
            size="small"
            @click="$router.push('/user/profile')"
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
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import { mapState } from 'vuex'

export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    FollowUser
  },
  computed: {
    ...mapState({
      sessionUser: state => state.user
    })
  },
  methods: {
    onPreview (src) {
      ImagePreview([
        src
      ])
    }
  }
}
</script>

<style scoped lang="less">
.user-info-container {
  padding: 12px;
  background-color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
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
      .action {
        display: flex;
        justify-content: space-between;
        .van-button {
          width: 45%;
        }
      }
    }
  }
}
</style>
