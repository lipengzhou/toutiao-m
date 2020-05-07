<template>
  <van-popup :value="value" @input="$emit('input', $event)" style="height: 100%;" position="bottom">
    <van-datetime-picker
      v-model="date"
      type="date"
      :min-date="minDate"
      confirm-button-text="完成"
      @cancel="$emit('close')"
      @confirm="$emit('confirm', 'birthday', currentDate)"
    />
  </van-popup>
</template>

<script>
export default {
  name: 'UpdateBirthday',
  components: {},
  props: ['birthday', 'value'],
  data () {
    return {
      date: this.birthday,
      minDate: new Date(1970, 1, 1),
      isShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
