<template>
  <div class="home page-container">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="logo"></div>
      <van-button
        class="search-btn"
        round
        type="info"
        size="small"
        icon="search"
        @click="$router.push('/search')"
      >搜索</van-button>
    </div>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs class="fixed-tabs" v-model="active" swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 它默认会把你写的其它内容渲染到内容的底部 -->
      <!-- <span>hello</span> -->
      <div class="wap-nav" slot="nav-right" @click="isChannelEditShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!--频道编辑弹窗 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      :style="{ height: '95%' }"
      round
    >
      <van-nav-bar title="编辑频道">
        <van-icon
          name="cross"
          slot="left"
          size="20"
          @click="isChannelEditShow = false"
        />
      </van-nav-bar>
      <channel-edit
        :user-channels="channels"
        v-model="active"
        @close="isChannelEditShow = false"
      />
    </van-popup>
    <!-- /频道编辑弹窗 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getItem } from '@/utils/storage'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'

export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0, // 控制激活的标签页
      isChannelEditShow: false, // 弹窗的显示状态
      channels: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserChannels()
  },
  methods: {
    async loadUserChannels () {
      let channels = []
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表，则获取使用
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有，则请求获取线上推荐的频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      }

      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    width: 100%;
    height: 46px;
    background-color: #3196fa;
    z-index: 1;
    .logo {
      background: url("./logo.png") no-repeat;
      background-size: cover;
      width: 100px;
      height: 30px;
    }
    .search-btn {
      background-color: #5babfb;
      width: 50%;
    }
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: .8;
    font-size: 26px;
  }
}
</style>
