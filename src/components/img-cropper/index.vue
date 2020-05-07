<template>
  <img
    ref="image"
    :src="src"
  >
</template>

<script>
import Cropper from 'cropperjs'

export default {
  name: 'AvatarCropper',
  components: {},
  props: {
    src: {
      type: [String, Object],
      required: true
    },
    cropperOptions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      crop (event) {
        // console.log(event.detail.x)
        // console.log(event.detail.y)
        // console.log(event.detail.width)
        // console.log(event.detail.height)
        // console.log(event.detail.rotate)
        // console.log(event.detail.scaleX)
        // console.log(event.detail.scaleY)
      },
      viewMode: 1, // 查看模式
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例
      autoCropArea: 1, // 自动区域
      cropBoxMovable: false, // 不允许截图区域移动
      cropBoxResizable: false, // 不允许截图区域缩放
      modal: true, // 显示阴影区域
      // movable: false
      background: false, // 关闭背景
      movable: true, // 允许移动
      ...this.cropperOptions
    })
  },
  methods: {
    getCroppedBlob () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(resolve)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "~cropperjs/dist/cropper.css";

/* Ensure the size of the image fit the container perfectly */
img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
