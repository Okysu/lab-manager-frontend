import { createRouter, createWebHistory } from 'vue-router'
import ConsoleView from '@/views/ConsoleView.vue'

// 引入userCommon
import { userCommon } from '@/stores/user'
import type { Store, PiniaCustomStateProperties } from 'pinia'
let user: Store<"usrCommon", { user: user; token: string; loginTime: number }, { getUser: (state: { user: { id: number; uid: number; password: string | null; name: string; mail: string; expire: string | null; disabled: number }; token: string; loginTime: number } & PiniaCustomStateProperties<{ user: user; token: string; loginTime: number }>) => { id: number; uid: number; password: string | null; name: string; mail: string; expire: string | null; disabled: number }; getToken: (state: { user: { id: number; uid: number; password: string | null; name: string; mail: string; expire: string | null; disabled: number }; token: string; loginTime: number } & PiniaCustomStateProperties<{ user: user; token: string; loginTime: number }>) => string; getLoginTime: (state: { user: { id: number; uid: number; password: string | null; name: string; mail: string; expire: string | null; disabled: number }; token: string; loginTime: number } & PiniaCustomStateProperties<{ user: user; token: string; loginTime: number }>) => number; login: (state: { user: { id: number; uid: number; password: string | null; name: string; mail: string; expire: string | null; disabled: number }; token: string; loginTime: number } & PiniaCustomStateProperties<{ user: user; token: string; loginTime: number }>) => boolean }, { setUser(user: user): void; setToken(token: string): void; setLoginTime(loginTime: number): void }> | null = null

const subtitle: string = "常熟理工学院实验室管理系统"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/console',
      name: 'console',
      component: ConsoleView,
      meta: {
        title: '控制台'
      },
      children: [
        {
          path: '/console/user',
          name: 'user',
          component: () =>
            import('@/views/console/user/UserManage.vue'),
          meta: {
            title: '用户管理'
          }
        }
      ]
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
  if (to.name !== 'login' && !user.login) {
    window.$notify.error({
      title: "未登录",
      content: "请先登录",
      duration: 2000
    })
    user.setLoginTime(0)
    next({ name: 'login' })
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
