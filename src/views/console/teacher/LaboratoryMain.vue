<script lang="ts" setup>
import { ref, onMounted, h, computed, reactive } from 'vue'
import request from '@/tools/request'
import { NButton, NSpace } from 'naive-ui'
import type { FormInst } from 'naive-ui'
const showModal = ref(false)
const formValue = reactive({
    name: '',
    teacher: '',
})
const formRef = ref<FormInst>()
const lab = ref<lab[]>([])
const getLabs = async () => {
    const response = await request.post("/lab/get", { filter: false })
    if (response.data.code = 200) {
        lab.value = response.data.data
    }
}

//添加实验室信息的响应事件
const enter = async () => {
    var data ={
        name: formValue.name,
        teacher: formValue.teacher,
    }

    const res = await request.post("/lab/add", data)
    showModal.value=false

    formRef.value?.validate((error) => {
    if (!error) {
      window.$message.success("添加实验室成功")
      showModal.value = false
      getLabs()
      return
    }
    window.$message.error("添加失败") //挂在window对象如果输入错误
  })

}

//表格的表头（列信息）
const col =[
    {
        key:"name",
        title:"实验室名称",
        width:230
    },
    {
        key:"teacher",
        title:"指导老师",
        width:250
    }
]

//搜索框
const searchValue = ref<string>("")
const lablist = computed(() => {
    if(searchValue.value !== "")
        return lab.value.filter((item) => item.name.includes(searchValue.value) || item.teacher.includes(searchValue.value)) 
    else 
        return lab.value
})
onMounted(() => {
    getLabs()
})
</script>

<template>
    <n-page-header>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">实验室管理</a>
        </template>
        <n-button type="primary" @click="showModal = true">添加实验室信息</n-button>
        <!-- <n-modal v-modal:show="showModal" transform-origin="center">
            <n-card style="max-width: 500px;" title="新增实验室信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-form :model="formValue" :label-width="80" ref="formRef">
                    <n-form-item label="实验室名称" path="name">
                        <n-input v-model:value="formValue.name" />
                    </n-form-item>
                    <n-form-item label="发布作者" path="teacher">
                        <n-input v-model:value="formValue.teacher" />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space style="float: right;">
                        <n-button type="primary" @click="enter">确定</n-button>
                        <n-button @click="showModal = false">取消</n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal> -->
        <n-modal v-model:show="showModal" transform-origin="center">
            <n-card style="max-width: 700px;" title="新增赛事信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-form :model="formValue" :label-width="80" ref="formRef">
                    <n-form-item label="实验室名称" path="name">
                        <n-input v-model:value="formValue.name" />
                    </n-form-item>

                    <n-form-item label="实验室指导老师" path="teacher">
                        <n-input v-model:value="formValue.teacher" />
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
    </n-page-header>

    <n-data-table style="margin-top: 10px;" :columns="col" :data="lablist" />
</template>
