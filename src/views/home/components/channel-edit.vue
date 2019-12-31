<template>
  <div class="channel-container">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div class="title-wrap" slot="title">
        <span class="title">我的频道</span>
        <span class="tip">点击进入频道</span>
      </div>
      <van-button
        type="danger"
        size="mini"
        round
        @click="isEdit = !isEdit"
        color="#e5615b"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10" clickable>
      <!--
        所有的 **组件**，如果没有内容，都可以写单标签结束或者双标签结束
        原生的 HTML 标签，你怎么学的你就怎么写
      -->
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        @click="onChannelActiveOrDelete(channel, index)"
      >
        <span class="text" :class="{ active: value === index }">{{ channel.name }}</span>
        <van-icon
          v-show="isEdit && channel.name !== '推荐'"
          class="close-icon"
          name="close"
        />
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 推荐频道 -->
    <van-cell :border="false">
      <div class="title-wrap" slot="title">
        <span class="title">推荐频道</span>
        <span class="tip">点击添加频道</span>
      </div>
    </van-cell>
    <van-grid :gutter="10" clickable>
      <van-grid-item
        class="channel-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        @click="onChannelAdd(channel)"
      >
        <span class="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /推荐频道 -->
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
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
    userChannels () {
      setItem('channels', this.userChannels)
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
        this.$emit('input', index)
        this.$emit('close')
      }
    },

    onChannelAdd (channel) {
      this.userChannels.push(channel)
    },

    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    }
  }
}
</script>

<style scoped lang="less">
.title-wrap {
  .title {
    margin-right: 10px;
  }
  .tip {
    font-size: 12px;
    color: #ccc;
  }
}
.channel-item {
  ::v-deep .van-grid-item__content {
    background: #f4f5f6;
  }
  .text {
    font-size: 14px;
    color: #222;
  }
  .active {
    color: #e5615b;
  }
  .close-icon {
    font-size: 15px;
    position: absolute;
    right: -3px;
    top: -4px;
  }
}
</style>
