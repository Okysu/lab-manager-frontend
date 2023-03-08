<script lang="ts" setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import request from '@/tools/request'
import { NButton, NSpace } from 'naive-ui'
import type { FormInst } from 'naive-ui'
//获取赛事信息
const contests = ref<contest[]>([])
const getContests = async () => {
    const response = await request.post("/contests/get", { filter: false })
    if (response.data.code = 200) {
        contests.value = response.data.data
    }
}
const formRef = ref<FormInst>()
//搜索框
const searchValue = ref<string>("")
// 表格的表头
const col = [
    {
        key: "id",
        title: "编号",
        width: 100
    },
    {
        key: "title",
        title: "赛事信息"
    },
    {
        key: "content",
        title: "赛事内容",
        width: 100,
        render: (row: contest) => {
            return h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    onClick: () => {
                        contestModel.value = {
                            show: true,
                            value: row.content
                        }
                    }
                },
                "查看"
            )
        }
    },
    {
        key: "date",
        title: "发布时间",
        width: 150,
        render: (row: contest) => {
            const date = new Date(row.date)
            return h("span", {}, date.toLocaleDateString())
        }
    },
    {
        key: "author",
        title: "发布作者",
        width: 150

    },
    {
        key: "file",
        title: "相关文件",
        width: 250

    }

]
const showModal = ref(false)
//搜索
const contestsList = computed(() => {
    if (searchValue.value !== "")
        return contests.value.filter((item) => item.title.includes(searchValue.value) || item.content.includes(searchValue.value))
    else
        return contests.value
})
//添加信息
const addContest = ref(false)
const AddContestInfo = () => {
    addContest.value = true
}
onMounted(() => {
    getContests()
})
const formValue = reactive({
    id: 0,
    title: '',
    author: '',
    content: '',
    date: 0,
    file: '',
})
//确认添加赛事信息
const enter = async () => {
    var data = {
        id: 0,
        title: formValue.title,
        author: formValue.author,
        content: formValue.content,
        date: formValue.date,
        file: formValue.file,

    }

    window.$dialog.warning({
        title: '增加赛事消息',
        content: `您确定要增加该赛事消息吗？`,
        positiveText: '确定',
        negativeText: '取消',
        transformOrigin: "center",
        onPositiveClick: async () => {
            const res = await request.post("/contests/add", data)
            if (res.data.code === 200) {
                window.$message.success("添加成功")
                getContests()
            } else {
                window.$message.error("添加失败")
            }
        },
    })
    formValue.id= 0,
    formValue.title= '',
    formValue.author= '',
    formValue.content ='',
    formValue.date= 0,
    formValue.file= '',
    showModal.value = false
}
const contestModel = ref(
    {
        show: false,
        value: ""
    }
)
</script>
<template>
    <n-page-header>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">赛事信息管理</a>
        </template>
        <n-button type="primary" @click="showModal = true">添加赛事信息</n-button>
        <n-modal v-model:show="showModal" transform-origin="center">
            <n-card style="max-width: 700px;" title="新增赛事信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-form :model="formValue" :label-width="80" ref="formRef">
                    <n-form-item label="赛事标题" path="title">
                        <n-input v-model:value="formValue.title" />
                    </n-form-item>
                    <n-form-item label="赛事内容" path="content">
                        <n-input type="textarea" v-model:value="formValue.content" />
                    </n-form-item>
                    <n-form-item label="发布时间" path="date">
                        <n-date-picker v-model:value="formValue.date" type="date" style="width: 100%;" />
                    </n-form-item>
                    <n-form-item label="发布作者" path="author">
                        <n-input v-model:value="formValue.author" />
                    </n-form-item>
                    <n-form-item label="上传文件" path="file">
                        <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :headers="{
                            'naive-info': 'hello!'
                        }" :data="{
    'naive-data': 'cool! naive!'
}">
                            <n-button>相关赛事文件</n-button>
                        </n-upload>
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
        <template #extra>
            <n-input v-model:value="searchValue" type="text" placeholder="查找相关通知" />
        </template>
    </n-page-header>
    <n-data-table style="margin-top: 10px;" :columns="col" :data="contestsList" />
    <n-modal v-model:show="contestModel.show">
        <n-card style="width: 600px" title="查看赛事内容" :bordered="false" size="huge" role="dialog" aria-modal="true">
            {{ contestModel.value }}
        </n-card>
    </n-modal>
</template>
