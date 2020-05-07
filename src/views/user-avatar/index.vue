<template>
  <div class="user-avatar">
    <van-nav-bar
      slot="cover"
      :border="false"
      title="个人头像"
      left-arrow
      style="color: #fff"
      @click-left="$router.back()"
      @click-right="$refs.file.click()"
    >
      <template #right>
        <van-icon name="ellipsis" />
      </template>
    </van-nav-bar>
    <!-- 头像预览 -->
    <van-image-preview
      v-model="show"
      :images="images"
      asyncClose
      :showIndex="false"
    />
    <!-- /头像预览 -->

    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    >

    <!-- 头像裁切 -->
    <van-popup
      v-model="isCropShow"
      style="height: 100%; background-color: #000"
      position="bottom"
    >
      <img-cropper
        v-if="isCropShow"
        :src="cropImage"
        ref="img-cropper"
      />
      <div class="crop-bottom">
        <span @click="isCropShow = false">取消</span>
        <span @click="onCropConfirm">完成</span>
      </div>
    </van-popup>
    <!-- /头像裁切 -->
  </div>
</template>

<script>
import ImgCropper from '@/components/img-cropper'

export default {
  name: 'UserAvatar',
  components: {
    ImgCropper
  },
  props: {},
  data () {
    return {
      show: true,
      images: [
        this.$route.query.src
      ],
      isCropShow: false,
      cropImage: ''
    }
  },
  computed: {
    file () {
      return this.$refs.file
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onCropConfirm () {},
    onFileChange () {
      // 显示图片裁切
      // 得到文件对象
      const fileObj = URL.createObjectURL(this.file.files[0])
      this.cropImage = fileObj
      this.isCropShow = true
    }
  }
}
</script>

<style scoped lang="less">

/deep/ .van-nav-bar {
  background-color: unset;
  z-index: 3000;
  color: #fff;
  .van-icon, .van-nav-bar__title {
    color: #fff;
  }
}

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
