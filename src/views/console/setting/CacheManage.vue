<script lang="ts" setup>
import { ref, onMounted, reactive, h } from "vue"
import request from '@/tools/request'
import { binarySize, timeDescription } from "@/tools/string"
import { NButton, NSpace } from "naive-ui"
import type { FormInst } from "naive-ui"
const info = ref()
const data = ref<record[]>([])
const showModal = ref(false)
interface record {
    key: string
    value: string
    expire?: number
}
const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30, 35, 40, 45, 50, 100],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    }
})
const columns = [
    {
        title: '键',
        key: 'key',
        width: 100,
    },
    {
        title: '值',
        key: 'value',
        width: 300,
    },
    {
        title: '过期时间',
        key: 'expire',
        width: 200,
        render(row: record) {
            if (!row.expire || Number(row.expire) === -1) {
                return h('span', null, '永不过期')
            } else {
                return h('span', null, timeDescription(row.expire * 1000))
            }
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 100,
        render(row: record) {
            const del = h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    type: 'error',
                    size: 'small',
                    onClick: () => {
                        window.$dialog.warning({
                            title: '删除',
                            content: `确定要删除${row.key}吗？`,
                            positiveText: '确定',
                            negativeText: '取消',
                            transformOrigin: "center",
                            onPositiveClick: async () => {
                                const res = await request.post('/cache/delete', {
                                    key: row.key
                                })
                                if (res.data.code === 200) {
                                    window.$message.success('删除成功')
                                    const res = await request.post('/cache/get')
                                    info.value = res.data.data
                                    data.value = res.data.data.records
                                } else {
                                    window.$message.error('删除失败')
                                }
                            },
                        })
                    }
                },
                { default: () => '删除' }
            )
            const edit = h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    type: 'info',
                    size: 'small',
                    onClick: () => {
                        setForm.key = row.key
                        setForm.value = row.value
                        if (row.expire) {
                            setForm.expire = Number(row.expire)
                        }
                        showModal.value = true
                    }
                },
                { default: () => '修改' }
            )
            const space = h(
                NSpace,
                null,
                {
                    default: () => [del, edit]
                }
            )
            return space
        }
    }
]
onMounted(async () => {
    const res = await request.post('/cache/get')
    info.value = res.data.data
    data.value = res.data.data.records
})

const setForm = reactive<record>(
    {
        key: '',
        value: '',
        expire: 0
    }
)

const setRule = {
    key: [
        {
            required: true,
            message: '请输入键',
            trigger: 'blur'
        }
    ],
    value: [
        {
            required: true,
            message: '请输入值',
            trigger: 'blur'
        }
    ],
    expire: [
        {
            required: true,
            trigger: 'blur',
            validator: (rule: any, value: number) => {
                if (!value && value !== 0)
                    return new Error('请输入过期时间')
                if (isNaN(value))
                    return new Error('过期时间必须为数字')
                if (value < 0)
                    return new Error('过期时间不能小于0')
            }
        }
    ]
}
const setFormRef = ref<FormInst>()
const set = async () => {
    const res = await request.post('/cache/set', setForm)
    if (res.data.code === 200) {
        window.$message.success('设置成功')
        const res = await request.post('/cache/get')
        info.value = res.data.data
        data.value = res.data.data.records
    } else {
        window.$message.error('设置失败')
    }
    showModal.value = false
    setForm.expire = 0
}

</script>

<style scoped>
.n-data-table {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>

<template>
    <n-page-header subtitle="其实后端都给你管理好了">
        <n-grid :cols="3">
            <n-gi>
                <n-statistic label="系统内核" :value="info?.info?.os" />
            </n-gi>
            <n-gi>
                <n-statistic label="运行版本" :value="info?.info?.redis_version" />
            </n-gi>
            <n-gi>
                <n-statistic label="运行天数" :value="info?.info?.uptime_in_days" />
            </n-gi>
            <n-gi>
                <n-statistic label="使用内存" :value="binarySize(info?.info?.used_memory_rss)" />
            </n-gi>
            <n-gi>
                <n-statistic label="客户端数量" :value="info?.info?.connected_clients" />
            </n-gi>
            <n-gi>
                <n-statistic label="监听的端口" :value="info?.info?.tcp_port" />
            </n-gi>
        </n-grid>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">缓存管理</a>
        </template>
    </n-page-header>
    <n-data-table ref="table" :columns="columns" :data="data" max-height="calc(100vh - 400px)"
        :row-key="(rows: record) => rows.key" :pagination="pagination" />
    <!-- 这是修改的模态框 -->
    <n-modal v-model:show="showModal" transform-origin="center">
        <n-card style="max-width: 400px;" title="修改缓存" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-form :model="setForm" :rules="setRule" ref="setFormRef">
                <n-form-item label="键" path="key">
                    <n-input v-model:value="setForm.key" />
                </n-form-item>
                <n-form-item label="值" path="value">
                    <n-input v-model:value="setForm.value" />
                </n-form-item>
                <n-form-item label="过期时间" path="expire">
                    <n-input-number v-model:value="setForm.expire" style="width: 100%;">
                        <template #suffix>
                            <span>秒</span>
                        </template>
                    </n-input-number>
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space style="float: right;">
                    <n-button type="error" @click="showModal = false">取消</n-button>
                    <n-button type="primary" @click="set">确定</n-button>
                </n-space>
            </template>
        </n-card>
    </n-modal>
</template>