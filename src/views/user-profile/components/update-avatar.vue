<template>
  <div class="">
    <!-- 头像预览 -->
    <van-image-preview
      v-model="isPreviewPhotoShow"
      :images="previewImages"
    >
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-right="onUpdatePhoto"
      />
    </van-image-preview>
    <!-- 头像预览 -->

    <!-- 头像预览 -->
    <van-popup
      v-model="isPreviewPhotoShow"
      style="height: 100%; background-color: #000"
      position="bottom"
    >
      <img-cropper
        v-if="isPreviewPhotoShow"
        :src="previewImage"
        ref="img-cropper"
      />
      <div class="crop-bottom">
        <span @click="isPreviewPhotoShow = false">取消</span>
        <span @click="onPhotoConfirm">完成</span>
      </div>
    </van-popup>
    <!-- /头像预览 -->
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
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

<style scoped lang="less">
.crop-bottom {
  position: fixed;
  bottom: 0;
  height: 44px;
  font-size: 16px;
  color: #fff;
  /* background: #000; */
  /* background-color: rgba(0, 0, 0, .6); */
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
</style>
