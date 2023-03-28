import { createRouter, createWebHistory } from 'vue-router'
import ConsoleView from '@/views/ConsoleView.vue'
import HomeView from '@/views/HomePage.vue'
import LabView from '@/views/home/LabInfo.vue'

// 引入userCommon
import { userCommon } from '@/stores/user'
let user: any = null
const subtitle: string = "常熟理工学院实验室管理系统"

// 引入路由
import routes from '@/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: HomeView,
      meta: {
        title: '主页',
      },
    },
    {
      path:'/lab',
      name:'lab',
      component:LabView,
      meta:{
        title:'实验室'
      },

    },
    {
      path: '/console',
      name: 'console',
      component: ConsoleView,
      meta: {
        title: '控制台'
      },
      children: routes
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () =>
        import('@/views/LoginView.vue')
    },
    {
      path: '/403',
      name: "403",
      meta: {
        title: '不好意思，此地不予放行',
      },
      component: () =>
        import('@/views/errors/403.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: "404",
      meta: {
        title: '你来错地方了',
      },
      component: () =>
        import('@/views/errors/404.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  // 设置pinia
  if (user === null) user = userCommon()
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title + ' - ' + subtitle
  }
  if (!import.meta.env.DEV && to.name !== 'login' && !user.login && user) {
    window.$notify.error({
      title: "未登录",
      content: "请先登录",
      duration: 2000
    })
    user.setLoginTime(0)
  }
  next()
})
router.beforeEach(async (to, from) => {
  if (window.$loadbar)
    window.$loadbar.start()
})
router.afterEach(async (to, from) => {
  if (window.$loadbar)
    window.$loadbar.finish()
})


export default router
