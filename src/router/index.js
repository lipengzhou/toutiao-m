import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/login')
const TabBar = () => import('@/views/tabbar')
const Home = () => import('@/views/home')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search-result')
const Article = () => import('@/views/article')
const My = () => import('@/views/my')
const Profile = () => import('@/views/profile')
const Chat = () => import('@/views/chat')

Vue.use(VueRouter)

// 配置路由表
const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    // 给拥有默认子路由的路由起名字没有意义，会受到Vue警告
    // name: 'tabbar',
    path: '/',
    component: TabBar,
    children: [
      {
        name: 'home',
        path: '', // 默认子路由
        component: Home
      },
      {
        name: 'my',
        path: '/my',
        component: My
      },
      {
        name: 'qa',
        path: '/qa',
        component: () => import('@/views/qa')
      },
      {
        name: 'video',
        path: '/video',
        component: () => import('@/views/video')
      }
    ]
  },
  {
    name: 'search',
    path: '/search',
    component: Search
  },
  {
    name: 'search-result',
    path: '/search/:q',
    component: SearchResult
  },
  {
    // 给路由起一个名字，必须唯一
    // 建议：无论你是否使用到路由 name 的优势，都建议给它起个名字
    name: 'article',
    path: '/article/:articleId',
    component: Article,
    props: true
  },
  {
    name: 'profile',
    path: '/profile',
    component: Profile
  },
  {
    name: 'chat',
    path: '/chat',
    component: Chat
  },
  {
    name: 'user',
    path: '/user/:userId',
    component: () => import('@/views/user'),
    props: true
  },
  {
    name: 'my-article',
    path: '/my-article/:type?',
    component: () => import('@/views/my-article'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
