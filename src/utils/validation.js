import {
  ValidationProvider,
  ValidationObserver,
  extend,
  setInteractionMode
} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/zh_CN.json'
import { Toast } from 'vant'
import sleep from './sleep'

setInteractionMode('eager')

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  })
})

extend('mobile', {
  validate: value => {
    return /^1(3|5|6|7|8|9)\d{9}$/.test(value)
  },
  message: '手机号码格式错误'
})

extend('code', {
  validate: value => {
    return /^\d{6}$/.test(value)
  },
  message: '验证码格式错误'
})

/**
 * 表单验证，验证失败给出提示
 * @param  {Object} form 要验证的表单组件
 * @return {Boolean}      验证结果，成功 true，失败 false
 */
const validateForm = async form => {
  const isValid = await form.validate()
  if (isValid) {
    return true
  }

  // 注意：验证插件有问题，如果不延迟一点时间无法拿到验证之后的错误对象
  await sleep(100)

  const errors = form.errors
  for (let key in errors) {
    const message = errors[key][0]
    if (message) {
      Toast(message)
      return false
    }
  }
}

export default {
  install (Vue) {
    Vue.component('ValidationProvider', ValidationProvider)
    Vue.component('ValidationObserver', ValidationObserver)
    Vue.prototype.$validateForm = validateForm
  }
}

// 自定义异步验证示例
// 1. 异步操作写到 Promise 中
// 2. 成功 resolve(true)
// 3. 失败 resolve('提示消息')
// extend('async-test', value => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       return Math.random() > 0.5 ? resolve(true) : reject('错误消息')
//     }, 500)
//   })
// })
