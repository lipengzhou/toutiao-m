<template>
  <div id="app">
    <!-- 根路由出口 -->
    <!-- 缓存路由组件 -->
    <!--
      keep-alive 会缓存组件
      组件缓存之后，生命周期不再执行了
      如果不需要某些组件缓存，可以指定 include 或者 exclude 来包含或者排除
     -->
    <keep-alive :include="$store.state.cachedPages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  props: {},
  data () {
    return {
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
.box {
  width: 375px;
  height: 100px;
  background-color: #f40;
}
</style>
