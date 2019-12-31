<template>
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
        v-for="(channel, index) in userChannels"
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
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'

export default {
  name: '',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isEdit: false,
      allChannels: [] // 所有频道列表
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
        const ret = this.userChannels.find(item => {
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
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    onChannelActiveOrDelete (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        // 编辑状态，执行删除操作
        this.userChannels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        this.active = index
        this.isChannelShow = false
        // setItem('channels', this.channels)
      }
    },

    onChannelAdd (channel) {
      // 将点击的频道项添加到我的频道列表中
      this.userChannels.push(channel)
      // setItem('channels', this.channels)
    },

    async loadAllChannels () {
      const res = await getAllChannels()
      const allChannels = res.data.data.channels
      allChannels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
        channel.timestamp = null // 用于获取频道下一页数据的时间戳
      })
      this.allChannels = allChannels
    }
  }
}
</script>

<style scoped>
::v-deep .van-grid-item__icon-wrapper {
  position: absolute;
  top: -12px;
  right: -7px;
}
</style>
