<template>
  <van-button
    class="follow-btn"
    v-bind="$attrs"
    :type="value ? 'default' : 'info'"
    size="small"
    :loading="loading"
    @click.stop="onFollow"
  >
    <slot>
      {{ value ? '已关注' : '关注' }}
    </slot>
  </van-button>
</template>

<script>
import { followUser, unFollowUser } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  props: {
    value: {
      type: Boolean
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    async onFollow () {
      this.loading = true
      try {
        // 如果已关注，则取消关注
        if (this.value) {
          await unFollowUser(this.userId)
        } else {
          // 如果没有关注，则关注
          await followUser(this.userId)
        }

        // 更新视图: 关注状态
        this.$emit('input', !this.value)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注你自己')
        }
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.van-button--info {
  background-color: #f85959;
  border: none;
}
</style>
