/**
 * 评论接口模块
 */
import request from '@/utils/request'

/**
 * 获取文章评论或评论回复列表
 */
export function getComments (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

/**
 * 获取文章评论
 */
export function getArticleComments (articleId, {
  page = 1,
  perPage = 10
} = {}) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: 'a', // a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source: articleId, // 文章id
      offset: page, // 偏移量，相当于页码
      limit: perPage // 每页大小
    }
  })
}

/**
 * 获取评论回复
 */
export function getCommentReplies (commentId, {
  page = 1,
  perPage = 10
} = {}) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params: {
      type: 'c', // a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source: commentId.toString(), // 评论id
      offset: page, // 偏移量，相当于页码
      limit: perPage // 每页大小
    }
  })
}

/**
 * 添加评论或评论回复
 */
export function addComment (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}

/**
 * 对评论或评论回复点赞
 */
export function addCommentLike (commentId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
 * 取消对评论或评论回复点赞
 */
export function deleteCommentLike (commentId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}
