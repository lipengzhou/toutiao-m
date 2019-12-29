<template>
  <div>
    <!-- 评论回复 -->
    <van-nav-bar :title="`${commentReply.totalCount}条回复`">
      <van-icon slot="left" name="cross" @click="isReplyShow = false" />
    </van-nav-bar>

    <comment-item :comment="currentReplyComment" :reply="false" />

    <van-cell title="全部评论" :border="false" />

    <!-- 回复列表 -->
    <van-list
      v-if="isReplyShow"
      v-model="commentReply.loading"
      :finished="commentReply.finished"
      finished-text="已展示所有回复"
      @load="commentReplyOnload"
    >
      <comment-item
        v-for="(comment, index) in commentReply.list"
        :key="index"
        :comment="comment"
        @reply="commentReply.isPostShow = true"
      />
    </van-list>
    <!-- /回复列表 -->

    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="commentReply.isPostShow = true"
      >写评论</van-button>
      <van-icon name="good-job-o" />
    </div>
    <!-- /评论回复 -->

    <!-- 发布评论回复 -->
    <van-popup
      class="post-comment-popup"
      v-model="commentReply.isPostShow"
      position="bottom"
    >
      <post-comment
        :target="currentReplyComment.com_id"
        :article-id="articleId"
        @post-success="onPostReplySuccess"
      />
    </van-popup>
    <!-- /发布评论回复 -->
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
  watch: {
  },
  created () {},
  methods: {}
}
</script>

<style scoped></style>
