/**
 * 文章相关的数据接口
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export function getArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticle (articleId) {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

/**
 * 对文章点赞
 */
export function addLike (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消文章点赞
 */
export function deleteLike (articleId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

/**
 * 对文章不喜欢
 */
export function addDislike (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

/**
 * 取消对文章不喜欢
 */
export function deleteDislike (articleId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}

/**
 * 获取指定用户文章列表
 */
export function getArticlesByUser (userId, params) {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}/articles`,
    params
  })
}

/**
 * 获取当前用户文章列表
 */
export function getUserArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/articles',
    params
  })
}

/**
 * 获取当前用户收藏文章列表
 */
export function getUserCollectArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/article/collections',
    params
  })
}

/**
 * 获取当前用户阅读历史文章列表
 */
export function getUserHistoryArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/histories',
    params
  })
}

/**
 * 收藏文章
 */
export function addCollect (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target: articleId // 收藏的目标文章id
    }
  })
}

/**
 * 取消收藏
 */
export function deleteCollect (articleId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}
