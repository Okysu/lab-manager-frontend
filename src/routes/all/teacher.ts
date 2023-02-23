const routes = [
    {
        path: '/console/teacher/declare',
        name: 'teacher-declare',
        component: () => import('@/views/console/teacher/ProjectDeclare.vue'),
        meta: {
            title: '项目申报',
        },
    },
    {
        path: '/console/teacher/maintain',
        name:'teacher-maintain',
        component: () => import("@/views/console/teacher/ProjectMaintain.vue"),
        meta: {
            title: '项目管理',
        },
    }
] as route[]

export default routes