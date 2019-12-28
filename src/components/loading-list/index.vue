<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <div v-for="(item, index) in value" :key="index">
      <slot v-bind:item="item">{{ item }}</slot>
    </div>
  </van-list>
</template>

<script>
export default {
  name: 'LoadingList',
  components: {},
  props: {
    fn: {
      type: Function,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      page: null,
      perPage: 10
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await this.fn({
        page: this.page,
        per_page: this.perPage
      })

      // 2. 将数据添加到列表中
      const { results } = data.data
      this.value.push(...results)

      // 更新总数量
      this.$emit('update:total-count', data.data.total_count)

      // 3. 停止 loading
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        const { last_id: lastId } = data.data
        if (lastId) {
          this.page = lastId
        } else {
          this.page = (this.page || 1) + 1
        }
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped></style>
