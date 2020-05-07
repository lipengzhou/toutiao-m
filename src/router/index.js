import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { // 登录
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  },
  { // 底部标签栏
    path: '/',
    component: () => import('@/views/tab-bar'),
    children: [
      { // 首页
        name: 'home',
        path: '', // 默认子路由
        component: () => import('@/views/home')
      },
      { // 我的
        name: 'my',
        path: '/my',
        component: () => import('@/views/my')
      },
      { // 问答
        name: 'qa',
        path: '/qa',
        component: () => import('@/views/qa')
      },
      { // 视频
        name: 'video',
        path: '/video',
        component: () => import('@/views/video')
      }
    ]
  },
  { // 搜索
    name: 'search',
    path: '/search',
    component: () => import('@/views/search')
  },
  { // 文章详情
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article'),
    props: true
  },
  { // 用户资料
    name: 'user-profile',
    path: '/user/profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/avatar',
    name: 'user-avatar',
    component: () => import('@/views/user-avatar')
  },
  { // 小智同学
    name: 'user-chat',
    path: '/user/chat',
    component: () => import('@/views/user-chat'),
    meta: { requiresAuth: true }
  },
  { // 用户关注/粉丝
    path: '/user/:userId/follow',
    component: () => import('@/views/user-follow'),
    props: true,
    meta: { requiresAuth: true }
  },
  { // 用户主页
    name: 'user',
    path: '/user/:userId',
    component: () => import('@/views/user'),
    props: true
  },
  { // 我的作品、收藏、历史
    name: 'my-article',
    path: '/my-article/:type?',
    component: () => import('@/views/my-article'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || !to.meta.requiresAuth) {
    return next()
  }

  if (store.state.user) {
    return next()
  }

  Dialog.confirm({
    title: '该功能需要登录，确认登录吗？'
  }).then(() => {
    next({
      name: 'login',
      query: {
        redirect: from.fullPath
      }
    })
  }).catch(() => {
    // on cancel
  })
})

export default router
