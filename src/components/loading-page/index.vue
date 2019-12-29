<template>
  <van-loading
    class="loading"
    v-bind="$attrs"
    color="#1989fa"
    vertical
  >
    <slot>加载中...</slot>
  </van-loading>
</template>

<script>
export default {
  name: 'PageLoading',
  components: {},
  props: {
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped>
.loading {
  padding-top: 100px;
  text-align: center;
}
</style>
