<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-navbar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        :class="{ reverse: item.userId === user.user_id }"
        v-for="(item, index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="item.photo"
        />
        <div class="msg-wrap" style="flex: 1;">
          <div class="title">{{ item.msg }}</div>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field
        v-model="message"
        center
        clearable
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          @click="onSend"
        >发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'ChatPage',
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('messages') || [] // 消息数据列表
    }
  },

  computed: {
    ...mapState(['user'])
  },

  watch: {
    messages () {
      setItem('messages', this.messages)

      this.scrollToBottom()
    }
  },

  created () {
    const socket = io('http://ttapi.research.itcast.cn')
    this.socket = socket

    // 收发消息
    // socket.emit('message', '消息')

    socket.on('message', data => {
      data.photo = 'http://toutiao.meiduo.site/FqHn7ps9v5I8esWXJNKH0asrSwcB'
      this.messages.push(data)
    })
  },

  mounted () {
    // 一个技巧：把想要在控制台访问的数据成员放到 window 上
    // window.list = this.$refs['message-list']
    this.scrollToBottom()
  },

  methods: {
    onSend () {
      // socket.emit('message', '输入的数据')
      const message = this.message.trim()

      // 非空校验
      if (!message) {
        return
      }

      // 发送消息
      // this.socket.emit('message', this.message)

      // 后端指定了收发消息的消息类型和消息内容的格式
      // Body 要求我们传递一个对象
      const data = {
        msg: message,
        timestamp: Date.now(),
        userId: this.user.user_id,
        photo: 'http://toutiao.meiduo.site/FlOAkWHoU8lnYwU6eCEPN-dHINHl'
      }
      this.socket.emit('message', data)
      this.messages.push(data)
      this.message = ''
    },

    scrollToBottom () {
      const messageList = this.$refs['message-list']
      this.$nextTick(() => {
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang="less">
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      padding: 10px;
      .msg-wrap {
        word-break: break-all;
        word-wrap: break-word;
      }
      .title {
        display: table;
        background: #e0effb;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        margin-right: 45px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .msg-wrap {
        display: flex;
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
          margin-left: 45px;
        }
      }
    }
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}
</style>
