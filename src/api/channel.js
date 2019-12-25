/**
 * 频道相关接口
 */
import request from '@/utils/request'

/**
 * 获取所有频道列表
 */
export function getAllChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
