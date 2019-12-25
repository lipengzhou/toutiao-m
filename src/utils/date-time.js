/**
 * 封装自定义 dayjs 日期处理模块
 */
import dayjs from 'dayjs'
import rTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 全局使用中文
dayjs.locale('zh-cn')

// dayjs 本身只处理日期格式化之类的核心功能
// 其它例如相对时间，需要单独配置它自己的插件才可以使用
dayjs.extend(rTime)

export const relativeTime = value => {
  return dayjs().to(dayjs(value))
}

export const formatTime = (value, format = 'YYYY-MM-DD hh:mm:ss') => {
  return dayjs(value).format(format)
}

export default {
  install (Vue) {
    Vue.filter('relativeTime', relativeTime)
    Vue.filter('formatTime', formatTime)
  }
}
