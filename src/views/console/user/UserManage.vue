<script lang="ts" setup>
import { ref, reactive, h, onMounted } from 'vue'
import { timeDescription } from '@/tools/string'
import { NButton, NSpace } from 'naive-ui'
import exportExcel from '@/tools/export'
import type { FormInst } from 'naive-ui'
import request from '@/tools/request'
const formRef = ref<FormInst>()
const excelField = {
    uid: '学工号',
    name: '姓名',
    mail: '邮箱',
    rid: '角色',
    status: '状态',
}
const getExcel = (all?: boolean) => {
    const rename = (data: any) => {
        data.forEach((item: { rid: string | number | undefined; disabled: number; status: string; expire: string | number | Date }) => {
            // 根据rid查询角色名
            const name = role.value.find((i) => i.id === item.rid)
            item.rid = name?.name
            // 先判断是否已经禁用了
            if (item.disabled === 1) {
                item.status = '已禁用'
            } else if (!item.expire || new Date(item.expire).getTime() === 0) {
                item.status = '永久有效'
            } else if (new Date(item.expire).getTime() < new Date().getTime()) {
                item.status = '已过期'
            } else {
                const diff = new Date(item.expire).getTime() - new Date().getTime()
                item.status = timeDescription(diff) + '后过期'
            }
        })
    }
    if (all) {
        const data: any[] = []
        // 已每页10条数据为单位，循环获取数据
        // 一直读取，直到读取到的数据长度小于10
        let page = 1
        const get = () => {
            request.post('/user/get', { page: page, size: 10 }).then((res) => {
                console.log(res.data)
                data.push(...res.data.data)
                if (res.data.data.length < 10) {
                    // 将角色信息和状态信息转换为文字
                    rename(data)
                    exportExcel(data, excelField, '用户列表 - ' + new Date().getTime())
                } else {
                    page++
                    get()
                }
            })
        }
        get()
    } else {
        const data = JSON.parse(JSON.stringify(tableData.value))
        rename(data)
        exportExcel(data, excelField, '用户列表 - ' + new Date().getTime())
    }
}
const columns = [
    {
        key: 'uid',
        title: '学工号',
    },
    {
        key: 'name',
        title: '姓名',
    },
    {
        key: 'mail',
        title: '邮箱',
    },
    {
        key: 'rid',
        title: '角色',
        render(row: user) {
            // 根据rid查询角色名
            const name = role.value.find((item) => item.id === row.rid)
            return h('span', null, name?.name)
        },
    },
    {
        key: 'status',
        title: '状态',
        render(row: user) {
            // 先判断是否已经禁用了
            if (row.disabled === 1) {
                return h('span', null, '已禁用')
            }
            // 如果到期时间不存在或者为0
            if (!row.expire || new Date(row.expire).getTime() === 0) {
                return h('span', null, '永久有效')
            } else if (new Date(row.expire).getTime() < new Date().getTime()) {
                return h('span', null, '已过期')
            } else {
                const diff = new Date(row.expire).getTime() - new Date().getTime()
                return h('span', null, timeDescription(diff) + '后过期')
            }
        },
    },
    {
        key: 'actions',
        title: '操作',
        render(row: user) {
            const del = h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    type: row.disabled === 1 ? 'success' : 'error',
                    onClick: () => {
                        // 如果rid为1，那么就是管理员，不允许禁用
                        if (row.rid === 1 && row.disabled === 0) {
                            window.$message.error('请不要整蛊，没活可以咬打火机')
                            return
                        }
                        const data = {
                            uid: row.uid,
                            disabled: row.disabled === 1 ? 0 : 1,
                            id: row.id,
                        }
                        request.post('/user/update', data).then(() => {
                            window.$message.success('操作成功')
                            getUserList()
                        })
                    },
                },
                { default: () => row.disabled === 1 ? '启用' : '禁用' }
            )
            const edit = h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    onClick: () => {
                        // 如果rid为1，那么就是管理员，不允许编辑
                        if (row.rid === 1) {
                            window.$message.error('系统管理员只能通过数据库来维护信息')
                            return
                        }
                        // 如果是编辑模式，那么就是编辑用户
                        addMode.value = false
                        // 把用户信息赋值给表单
                        formValue.uid = row.uid
                        formValue.id = row.id
                        formValue.name = row.name
                        formValue.mail = row.mail
                        formValue.rid = row.rid!
                        formValue.expire = row.expire ? new Date(row.expire).getTime() : 0
                        showModal.value = true
                    },
                },
                { default: () => '编辑' }
            )
            return h(NSpace, null, { default: () => [del, edit] })
        },
    },
]
const addMode = ref(false)
const showModal = ref(false)
const tableData = ref<user[]>([])
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100],
    pageCount: 1,
    onChange: (page: number) => {
        paginationReactive.page = page
        getUserList()
    },
    onUpdatePageSize: (pageSize: number) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
        getUserList()
        paginationReactive.pageCount = Math.ceil(tableData.value.length / pageSize)
    }
})
const getUserList = async () => {
    const res = await request.post('/user/get', {
        page: paginationReactive.page,
        size: paginationReactive.pageSize
    })
    const data = res.data.data
    tableData.value = data
}
const role = ref<role[]>([])
const roleOptions = [] as Array<{ label: string, value: number }>
const getRoleList = async () => {
    const { data } = await request.post('/role/get')
    role.value = data.data
    role.value.forEach((item) => {
        roleOptions.push({
            label: item.name,
            value: item.id
        })
    })
}
onMounted(() => {
    getUserList()
    getRoleList()
})
const formValue = reactive({
    id: 0,
    uid: 0,
    name: '',
    mail: '',
    password: '',
    rid: 1,
    expire: 0,
})
const formRules = {
    uid: [
        {
            required: true,
            trigger: 'blur',
            validator: (rule: any, value: string) => {
                if (!value) {
                    return new Error('学工号不能为空')
                }
                return true
            },
        },
    ],
    name: [
        {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
        },
    ],
    mail: [
        {
            required: true,
            trigger: 'blur',
            validator: (rule: any, value: string) => {
                if (!value) {
                    return new Error('邮箱不能为空')
                }
                if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
                    return new Error('邮箱格式不正确')
                }
                return true
            },
        },
    ],
    password: [
        {
            required: false,
            trigger: 'blur',
            validator: (rule: any, value: string) => {
                if (value && value.length < 8 || value.length > 32) {
                    return new Error('密码长度必须在8-32位之间')
                }
                return true
            },
        },
    ],
    rid: [
        {
            required: true,
            message: '角色不能为空',
            type: "number",
            trigger: 'blur',
        },
    ],
}
const enter = async () => {
    //如果密码为空，那么使用默认12345678
    if (addMode.value) {
        var data = {
            uid: formValue.uid,
            name: formValue.name,
            mail: formValue.mail,
            rid: formValue.rid,
            expire: formValue.expire,
            password: !formValue.password ? '12345678' : formValue.password
        }
    } else {
        var data = {
            uid: formValue.uid,
            name: formValue.name,
            mail: formValue.mail,
            rid: formValue.rid,
            expire: formValue.expire,
            password: formValue.password
        }
    }
    const res = await request.post('/user/' + (addMode.value ? 'add' : 'update'), addMode.value ? data : { ...data, id: formValue.id })
    if (res.data.code === 200) {
        window.$message.success((addMode.value ? '添加成功' : '修改成功'))
        getUserList()
        addMode.value = false
    } else {
        window.$message.error(res.data.msg)
    }
    formValue.uid = 0
    formValue.name = ''
    formValue.mail = ''
    formValue.password = ''
    formValue.rid = 1
    formValue.expire = 0
    showModal.value = false
}
</script>

<template>
    <n-page-header subtitle="其实人应该是平等的，不对吗">
        <n-grid :cols="3">
            <n-gi>
                <n-statistic label="用户数量" :value="tableData.length" />
            </n-gi>
            <n-gi>
                <n-statistic label="学生数量"
                    :value="tableData.filter((item) => item.rid === 4 || item.rid === 6).length" />
            </n-gi>
            <n-gi>
                <n-statistic label="教师数量"
                    :value="tableData.length - tableData.filter((item) => item.rid === 4 || item.rid === 6).length" />
            </n-gi>
        </n-grid>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">用户管理</a>
        </template>
    </n-page-header>
    <n-space style="margin-top: 10px; margin-bottom: 10px;">
        <n-button type="primary" @click="addMode = true, showModal = true">添加用户</n-button>
        <n-button type="info">导入用户</n-button>
        <n-button type="warning" @click="getExcel()">导出当前用户</n-button>
        <n-button color="#8a2be2" @click="getExcel(true)">导出所有用户</n-button>
    </n-space>
    <n-data-table :data="tableData" :columns="columns" style="margin-top: 10px;" :pagination="paginationReactive" remote
        height="calc(100vh - 380px)" />
    <n-modal v-model:show="showModal" transform-origin="center">
        <n-card style="max-width: 700px;" :title="addMode ? '新增用户数据' : '修改用户数据'" :bordered="false" size="huge"
            role="dialog" aria-modal="true">
            <n-form :model="formValue" :rules="formRules" :label-width="80" ref="formRef">
                <n-form-item label="学工号" path="uid">
                    <n-input-number v-model:value="formValue.uid" :disabled="!addMode" :show-button="false"
                        style="width: 100%;" />
                </n-form-item>
                <n-form-item label="姓名" path="name">
                    <n-input v-model:value="formValue.name" />
                </n-form-item>
                <n-form-item label="邮箱" path="mail">
                    <n-input v-model:value="formValue.mail" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                    <n-input v-model:value="formValue.password" :placeholder="addMode ? '留空默认12345678' : '留空默认不修改'" />
                </n-form-item>
                <n-form-item label="角色" path="rid">
                    <n-select v-model:value="formValue.rid" :options="roleOptions" />
                </n-form-item>
                <n-form-item label="到期时间" path="expire">
                    <n-date-picker v-model:value="formValue.expire" type="datetime" style="width: 100%;" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space style="float: right;">
                    <n-button type="primary" @click="enter">确定</n-button>
                    <n-button @click="showModal = false">取消</n-button>
                </n-space>
            </template>
        </n-card>
    </n-modal>
</template>