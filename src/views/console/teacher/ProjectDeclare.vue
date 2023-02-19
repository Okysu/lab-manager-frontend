<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import sha1 from 'sha1'
import request from '@/tools/request'
// 引入config
import { appConfig } from '@/stores/appConfig'
const config = appConfig()
const projects = ref<project[]>([])
// 选中的project
const active = ref<project>()
const getProjects = async () => {
    // projects 清零
    projects.value = []
    const res = await request.post("/project/get")
    const data = res.data
    if (data.code === 200) {
        projects.value = data.data
        // 选中第一个
        active.value = data.data[0]
    }
}

// 批准为校级项目
const start1 = async () => {
    window.$dialog.warning(
        {
            title: '批准',
            content: `确定要批准${active.value?.name}为校级项目吗？`,
            positiveText: '确定',
            negativeText: '取消',
            transformOrigin: "center",
            onPositiveClick: async () => {
                const res = await request.post("/project/start1", {
                    id: active.value?.id
                })
                const data = res.data
                if (data.code === 200) {
                    window.$message.success("批准成功")
                    getProjects()
                } else {
                    window.$message.error("批准失败")
                }
            },
        }
    )
}

//批准为省级项目
const start2 = async()=> {
    window.$dialog.warning(
        {
            title:'删除',
            content: `确定要批准${active.value?.name}为省级项目吗？`,
            positiveText: '确定',
            negativeText: '取消',
            transformOrigin: "center",
            onPositiveClick: async () => {
                const res = await request.post("/project/start2", {
                    id: active.value?.id
                })
                const data = res.data
                if (data.code === 200) {
                    window.$message.success("批准成功")
                    getProjects()
                } else {
                    window.$message.error("批准失败")
                }
            },
        }
    )
}

//批准为国家级项目
const start3 = async()=> {
    window.$dialog.warning(
        {
            title:'删除',
            content: `确定要批准${active.value?.name}为国级项目吗？`,
            positiveText: '确定',
            negativeText: '取消',
            transformOrigin: "center",
            onPositiveClick: async () => {
                const res = await request.post("/project/start3", {
                    id: active.value?.id
                })
                const data = res.data
                if (data.code === 200) {
                    window.$message.success("批准成功")
                    getProjects()
                } else {
                    window.$message.error("批准失败")
                }
            },
        }
    )
}

// active函数
const setActive = (project: project) => {
    active.value = project
}

onMounted(() => {
    getProjects()
})
</script>

<style scoped>
.scoped .n-card:hover {
    box-shadow: 0 0 0 2px #27ac06;
}

.scoped .active {
    box-shadow: 0 0 0 2px #27ac06;
}
</style>

<template>
    <n-page-header subtitle="这是廉价劳动力的开始">
        <n-grid :cols="4">
            <n-gi>
                <n-statistic label="所有项目" :value="projects.length" />
            </n-gi>
            <n-gi>
                <n-statistic label="校级项目" :value="projects.filter((item) => item.status === 1).length" />
            </n-gi>
            <n-gi>
                <n-statistic label="省级项目" :value="projects.filter((item) => item.status === 2).length" />
            </n-gi>
            <n-gi>
                <n-statistic label="国级项目" :value="projects.filter((item) => item.status === 3).length" />
            </n-gi>
        </n-grid>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">项目申报</a>
        </template>
    </n-page-header>
    <n-grid :cols="2" style="margin-top: 10px;" x-gap="12" y-gap="12">
        <n-gi>
            <n-grid :cols="config.isMobile ? 1 : 2" x-gap="10" y-gap="10" class="scoped">
                <n-gi v-for="project in projects">
                    <n-card :title="project.name" :class="active?.id === project.id ? 'active' : ''"
                        @click="setActive(project)">
                        {{ project.description }}
                    </n-card>
                </n-gi>
            </n-grid>
        </n-gi>
        <n-gi>
            <n-page-header subtitle="其实是过家家">
                <template #title>
                    <a href="#" style="text-decoration: none; color: inherit">预览</a>
                </template>
                <template #extra>
                    <n-space>
                        <n-button v-if="active?.status === 0" @click="start1">批准为校级项目</n-button>
                        <n-button v-if="active?.status === 1" @click="start2">批准为省级项目</n-button>
                        <n-button v-if="active?.status === 2" @click="start3">批准为国级项目</n-button>
                    </n-space>
                </template>
            </n-page-header>
            <n-card style="margin-top: 5px;">
                <n-list>
                    <n-list-item>
                        <n-thing title="项目编号" />
                        {{ sha1(active?.pid + 'hash-pid' + active?.uid).slice(0, 10) }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目名称" />
                        {{ active?.name }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目介绍" />
                        {{ active?.description }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目状态" />
                        {{ active?.status === 0 ? '未审核' : active?.status === 1 ? '校级' : active?.status === 2 ? '省级' :
                        '国级' }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目负责人" />
                        {{ active?.user.name + '(' + active?.user.uid + ')' }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目指导老师" />
                        {{ active?.guideUser.name + '(' + active?.guideUser.uid + ')' }}
                    </n-list-item>
                    <n-list-item>
                        <n-thing title="项目申报书" />
                        <n-a :href="active?.file" target="_blank">点击下载</n-a>
                    </n-list-item>
                </n-list>
            </n-card>
        </n-gi>
    </n-grid>
</template>