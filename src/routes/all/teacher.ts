const routes = [
    {
        path: '/console/teacher/declare',
        name: 'teacher-declare',
        component: () => import('@/views/console/teacher/ProjectDeclare.vue'),
        meta: {
            title: '项目申报',
        },
    }
] as route[]

export default routes