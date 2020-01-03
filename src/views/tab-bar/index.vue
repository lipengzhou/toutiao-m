<template>
  <div class="tabbar-container">
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!--
      标签栏支持路由模式，用于搭配vue-router使用。路由模式下会匹配页面路径和标签的to属性，并自动选中对应的标签
     -->
    <van-tabbar class="tabbar" v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">
        <span>首页</span>
        <van-icon
          slot="icon"
          slot-scope="props"
          :name="props.active ? 'wap-home' : 'home-o'"
        ></van-icon>
      </van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">
        <span>问答</span>
        <van-icon
          slot="icon"
          slot-scope="props"
          :name="props.active ? 'comment' : 'comment-o'"
        ></van-icon>
      </van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">
        <span>视频</span>
        <van-icon
          slot="icon"
          slot-scope="props"
          :name="props.active ? 'video' : 'video-o'"
        ></van-icon>
      </van-tabbar-item>
      <van-tabbar-item
        icon="user-o"
        to="/my"
      >
        <span>{{ $store.state.user ? '我的' : '未登录' }}</span>
        <van-icon
          slot="icon"
          slot-scope="props"
          :name="props.active ? 'manager' : 'manager-o'"
        ></van-icon>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  components: {},
  props: {},
  data () {
    return {
      active: 0
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {}
}
</script>

<style scoped>
.tabbar {
  background: #f6f6f6;
}
</style>
