<template>
  <div class="home page-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-navbar" fixed>
      <van-button
        class="search-button"
        slot="title"
        round
        type="info"
        size="small"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <van-tabs class="fixed-tabs" v-model="active" swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <article-item
              :article="article"
              v-for="(article, index) in channel.articles"
              :key="index"
            />
          </van-list>
        </van-pull-refresh>
        <!-- /文章列表 -->
      </van-tab>
      <!-- 它默认会把你写的其它内容渲染到内容的底部 -->
      <!-- <span>hello</span> -->
      <div class="wap-nav" slot="nav-right" @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!--频道管理弹窗 -->
    <!--
      弹窗组件
      v-model="show" 控制是否展示
      round 圆角
      position="bottom" 弹出位置
      :style="{ height: '20%' }" 弹出高度
     -->
    <van-popup
      v-model="isChannelShow"
      position="bottom"
      closeable
      close-icon-position="top-left"
      :style="{ height: '100%' }"
      @open="onChannelOpen"
    >
      <div class="channel-container">
        <!-- 我的频道 -->
        <van-cell title="我的频道" :border="false">
          <van-button
            type="danger"
            size="mini"
            @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <!--
            所有的 **组件**，如果没有内容，都可以写单标签结束或者双标签结束
            原生的 HTML 标签，你怎么学的你就怎么写
          -->
          <van-grid-item
            v-for="(channel, index) in channels"
            :key="channel.id"
            :text="channel.name"
            @click="onChannelActiveOrDelete(channel, index)"
          >
            <van-icon
              class="close-icon"
              slot="icon"
              name="close"
              size="20"
              v-show="isEdit && channel.name !== '推荐'"
            />
          </van-grid-item>
        </van-grid>
        <!-- /我的频道 -->

        <!-- 推荐频道 -->
        <van-cell title="推荐频道" :border="false" />
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in recommendChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onChannelAdd(channel)"
          />
        </van-grid>
        <!-- /推荐频道 -->
      </div>
    </van-popup>
    <!-- /频道管理弹窗 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
import { getAllChannels } from '@/api/channel'
import { setItem, getItem } from '@/utils/storage'
import ArticleItem from '@/components/article-item'

export default {
  name: 'HomePage',
  components: {
    ArticleItem
  },
  props: {},
  data () {
    return {
      active: 0, // 控制激活的标签页
      loading: false, // 加载更多的转圈圈
      isLoading: false, // 下拉刷新的转圈圈
      channels: [], // 频道列表
      isChannelShow: false, // 弹窗的显示状态
      allChannels: [], // 所有频道列表
      isEdit: false // 控制删除频道关闭按钮的显示
    }
  },
  computed: {
    recommendChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 我的频道列表中是否包含当前遍历项

        // [{ id: 1, name: '推荐' }, { id: 2, name: 'Android' } ]
        // { id: 3: name: '哈哈' }

        // find 方法
        // 找到第1个满足 item.id === channel.id 条件的元素
        const ret = this.channels.find(item => {
          return item.id === channel.id
        })

        // 如果不包含，那我就把它收集到 arr 中
        if (!ret) {
          arr.push(channel)
        }
      })

      return arr
    }
  },
  watch: {
    channels () {
      setItem('channels', this.channels)
    }
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    async onLoad () {
      // 当前频道
      const activeChannel = this.channels[this.active]

      // 当前频道的的文章列表
      const articles = activeChannel.articles

      // 1. 请求获取数据
      const res = await getArticles({
        channel_id: activeChannel.id, // 频道 id
        timestamp: activeChannel.timestamp || Date.now(), // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
        with_top: 1
      })

      // 2. 将数据添加到当前频道的文章列表中
      // ...数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
      articles.push(...res.data.data.results)

      // 3. 将 loading 设置为 false
      this.loading = false

      // 4. 判断还有下一页数据，则更新获取下一个数据的时间戳
      //    如果没有了，则将 finished 设置为 true，不再加载更多了
      const preTimestamp = res.data.data.pre_timestamp
      if (preTimestamp) {
        // 更新获取下一页数据的时间戳
        activeChannel.timestamp = preTimestamp
      } else {
        activeChannel.finished = true
      }
    },

    async onRefresh () {
      const activeChannel = this.channels[this.active]

      // 1. 请求获取最新数据
      const res = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 获取最新数据传递当前最新时间戳即可
        with_top: 1
      })

      // 2. 把数据放到列表的顶部
      const articles = res.data.data.results
      activeChannel.articles.unshift(...articles)

      // 3. 停止下拉刷新的转圈圈
      this.isLoading = false

      // 4. 提示用户刷新成功
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : '暂无数据更新'
      this.$toast(message)
    },

    async loadUserChannels () {
      let channels = []
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表，则获取使用
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有，则请求获取线上推荐的频道列表
        const res = await getUserChannels()
        const onLineChannels = res.data.data.channels
        onLineChannels.forEach(channel => {
          channel.articles = [] // 频道的文章列表
          channel.finished = false // 频道的加载结束状态
          channel.timestamp = null // 用于获取频道下一页数据的时间戳
        })
        channels = onLineChannels
      }

      this.channels = channels
    },

    async onChannelOpen () {
      const res = await getAllChannels()
      const allChannels = res.data.data.channels
      allChannels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
        channel.timestamp = null // 用于获取频道下一页数据的时间戳
      })
      this.allChannels = allChannels
    },

    onChannelAdd (channel) {
      // 将点击的频道项添加到我的频道列表中
      this.channels.push(channel)
      // setItem('channels', this.channels)
    },

    onChannelActiveOrDelete (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        // 编辑状态，执行删除操作
        this.channels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        this.active = index
        this.isChannelShow = false
        // setItem('channels', this.channels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .search-button {
    width: 100%;
    background-color: #5babfb;
  }
  .article-info span {
    margin-right: 10px;
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
  .channel-container {
    padding-top: 30px;
  }

  ::v-deep .van-grid-item__icon-wrapper {
    position: absolute;
    top: -12px;
    right: -7px;
  }
}
</style>
