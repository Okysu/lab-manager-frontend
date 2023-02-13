const routes = [
    {
        path: '/console/admin/user',
        name: 'admin-user',
        component: () =>
            import('@/views/console/user/UserManage.vue'),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/console/admin/info',
        name: 'admin-info',
        component: () =>
            import('@/views/console/setting/InfoSetting.vue'),
        meta: {
            title: '系统信息'
        }
    },
    {
        path: '/console/admin/cache',
        name: 'admin-cache',
        component: () =>
            import('@/views/console/setting/CacheManage.vue'),
        meta: {
            title: '缓存管理'
        }
    },
    {
        path: '/console/admin/menu',
        name: 'admin-menu',
        component: () =>
            import('@/views/console/menu/MenuManage.vue'),
        meta: {
            title: '菜单管理'
        }
    },
    {
        path: '/console/admin/log',
        name: 'admin-log',
        component: () =>
            import('@/views/console/log/LogManage.vue'),
        meta: {
            title: '日志管理'
        }
    },
] as route[]

export default routes