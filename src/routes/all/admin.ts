const routes = [
    {
        path: '/console/user',
        name: 'user',
        component: () =>
            import('@/views/console/user/UserManage.vue'),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/console/info',
        name: 'info',
        component: () =>
            import('@/views/console/setting/InfoSetting.vue'),
        meta: {
            title: '系统信息'
        }
    },
    {
        path: '/console/cache',
        name: 'cache',
        component: () =>
            import('@/views/console/setting/CacheManage.vue'),
        meta: {
            title: '缓存管理'
        }
    },
    {
        path: '/console/menu',
        name: 'menu',
        component: () =>
            import('@/views/console/menu/MenuManage.vue'),
        meta: {
            title: '菜单管理'
        }
    }
]

export default routes