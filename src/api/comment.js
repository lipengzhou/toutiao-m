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
