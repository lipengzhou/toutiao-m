<template>
  <div class="myarticle-container page-container">
    <van-nav-bar
      class="page-navbar"
      left-arrow
      :title="'我的' + activeChannel.name"
      fixed
    ></van-nav-bar>
    <van-tabs v-model="active">
      <van-tab
        :title="channel.name"
        v-for="(channel, index) in channels"
        :key="index"
      >
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in channel.articles"
            :key="item"
            :title="item"
          />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'MyArticle',
  components: {},
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      active: 0,
      channels: [
        {
          name: '作品',
          articles: [],
          loading: false,
          refreshLoading: false,
          finished: false
        },
        {
          name: '收藏',
          articles: [],
          loading: false,
          refreshLoading: false,
          finished: false
        },
        {
          name: '历史',
          articles: [],
          loading: false,
          refreshLoading: false,
          finished: false
        }
      ]
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.active]
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLoad () {
      const activeChannel = this.activeChannel
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          activeChannel.articles.push(activeChannel.articles.length + 1)
        }
        // 加载状态结束
        activeChannel.loading = false

        // 数据全部加载完成
        if (activeChannel.articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 500)
    }
  }
}
</script>

<style scoped lang="less"></style>
