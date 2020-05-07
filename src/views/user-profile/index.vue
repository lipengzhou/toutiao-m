<template>
  <div>
    <van-nav-bar
      class="page-navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.replace('/my')"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onShowFile" center>
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <input
        type="file"
        hidden
        ref="file"
        accept="image/*"
        @change="onFileChange"
      >
      <van-cell
        title="昵称"
        :value="user.name"
        is-link
        @click="onEditNameShow"
      />
      <van-cell
        title="性别"
        :value="user.gender === 0 ? '男' : '女'"
        is-link
        @click="isEditGenerShow = true"
      />
      <van-cell
        title="生日"
        :value="user.birthday"
        is-link
        @click="isEditBirthdayShow = true"
      />
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-popup
      style="height: 100%;"
      class="intro-popup"
      v-model="isEditNameShow"
      position="bottom"
      get-container="body"
      @opened="$refs.name.focus()"
    >
      <van-nav-bar
        title="昵称"
        left-text="取消"
        right-text="完成"
        @click-left="isEditNameShow = false"
        @click-right="onNameConfirm"
      >
      </van-nav-bar>
      <div class="intro-field-wrap">
        <van-field
          v-model="inputName"
          rows="2"
          autosize
          type="textarea"
          maxlength="7"
          placeholder="请输入昵称"
          show-word-limit
          ref="name"
          id="name"
        />
      </div>
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenerShow"
      position="bottom"
      get-container="body"
    >
      <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="isEditGenerShow = false"
        :default-index="user.gender"
        @change="onPickerChange"
        @confirm="saveProfile('gender', selectedGender)"
      />
    </van-popup>
    <!-- <van-action-sheet
      v-model="isEditGenerShow"
      :actions="actions"
      @select="onGenerSelect"
      cancel-text="取消"
    /> -->
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        confirm-button-text="完成"
        @confirm="onBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- /修改生日 -->

    <!-- 上传头像预览裁切 -->
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
    <!-- /上传头像预览裁切 -->

    <!-- 上传头像预览 -->
    <!-- <van-image-preview
      v-model="isPreviewPhotoShow"
      :images="previewImages"
    >
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-right="onUpdatePhoto"
      />
    </van-image-preview> -->
    <!-- /上传头像预览 -->
  </div>
</template>

<script>
import {
  getProfile,
  updateUserProfile,
  updateUserPhoto
} from '@/api/user'
import dayjs from 'dayjs'
import globalBus from '@/utils/global-bus'
import ImgCropper from '@/components/img-cropper'

export default {
  name: 'UserProfile',
  components: {
    ImgCropper
  },
  data () {
    return {
      user: {
      },
      isEditNameShow: false,
      isNameShow: false,
      inputName: '',
      isEditGenerShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false,
      currentDate: new Date(),
      minDate: new Date(1970, 1, 1),
      isPreviewPhotoShow: false,
      previewImages: [],
      previewImage: '',
      columns: ['男', '女'],
      selectedGender: 0
    }
  },
  computed: {
    file () {
      return this.$refs.file
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    onPickerChange (picker, value, index) {
      this.selectedGender = index
    },
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
      this.currentDate = new Date(this.user.birthday)
    },

    onEditNameShow () {
      this.inputName = this.user.name
      this.isEditNameShow = true
    },

    onShowFile () {
      this.file.click()
    },

    onFileChange () {
      const fileObj = URL.createObjectURL(this.file.files[0])
      // 清空数组
      this.previewImages = []
      // 添加预览图片
      this.previewImages.push(fileObj)
      this.previewImage = fileObj
      // 显示预览
      this.isPreviewPhotoShow = true

      this.file.value = ''
    },

    async saveProfile (field, value) {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast.success('保存成功')
        this.user[field] = value
        globalBus.$emit('user-update')
        this.isEditGenerShow = false
      } catch (err) {
        this.$toast.success('保存失败')
        return Promise.reject(err)
      }
    },

    async onNameConfirm () {
      try {
        // 请求更新
        await this.saveProfile('name', this.inputName)

        // 更新视图
        this.user.name = this.inputName

        // 关闭弹层
        this.isEditNameShow = false
      } catch ({ response }) {
        if (response.status === 400) {
          this.$toast.fail('昵称必须在1-7个字符之间')
        } else if (response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    },

    async onGenerSelect (item) {
      // 请求更新
      await this.saveProfile('gender', item.value)

      // 更新视图
      this.user.gender = item.value

      // 关闭弹层
      this.isEditGenerShow = false
    },

    async onBirthdayConfirm (value) {
      const birthday = dayjs(value).format('YYYY-MM-DD')

      // 请求更新
      await this.saveProfile('birthday', birthday)

      // 更新视图
      this.user.birthday = birthday

      // 关闭弹层
      this.isEditBirthdayShow = false
    },

    async onUpdatePhoto () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      try {
        // 构造包含文件的表单数据对象
        const fd = new FormData()
        const fileObj = this.file.files[0]
        fd.append('photo', fileObj)

        // 请求更新
        await updateUserPhoto(fd)

        // 更新视图
        this.user.photo = URL.createObjectURL(fileObj)

        // 关闭图片预览
        this.isPreviewPhotoShow = false

        this.$toast.success('保存成功')

        globalBus.$emit('user-update')
      } catch (err) {
        this.$toast.success('保存失败')
      }
    },

    async onPhotoConfirm () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '保存中...' // 提示消息
      })

      try {
        // 构造包含文件的表单数据对象
        const fd = new FormData()
        const blob = await this.$refs['img-cropper'].getCroppedBlob()
        console.log(blob)
        // const fileObj = this.file.files[0]
        fd.append('photo', blob)

        // 请求更新
        await updateUserPhoto(fd)

        // 更新视图
        this.user.photo = URL.createObjectURL(blob)

        // 关闭图片预览
        this.isPreviewPhotoShow = false

        this.$toast.success('保存成功')

        globalBus.$emit('user-update')
      } catch (err) {
        this.$toast.success('保存失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.intro-popup {
  background-color: #f5f7f9;
  .intro-field-wrap {
    padding: 10px;
  }
}

.avatar {
  width: 30px;
  height: 30px;
}

/deep/ .van-image-preview__cover {
  left: 0;
  bottom: 0;
  right: 0;
  top: unset;
  .van-nav-bar {
    background: #000;
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
