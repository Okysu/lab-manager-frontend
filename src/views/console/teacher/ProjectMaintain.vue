<script lang="ts" setup>
import { ref, onMounted, reactive, h, computed } from 'vue'
import request from '@/tools/request'
import { NButton, NSpace } from 'naive-ui'
import type { FormInst } from 'naive-ui'
// import { add } from 'lodash';
const projects = ref<project[]>([])
const getProjects = async () => {
  const response = await request.post("/project/get", { filter: false })
  if (response.data.code = 200) {
    projects.value = response.data.data
  }
}
//tc
const addMode = ref(false)
const showModal = ref(false)
// 表格的表头
const col = [
  {
    key: "pid",
    title: "项目编号",
    /*width: 150*/
  },
  {
    key: "name",
    title: "项目名称",
  },
  {
    key: "status",
    title: "项目类型",
    render: (row: project) => {
      if (row.status === 1)
        return h("span", {}, "校级项目")
      if (row.status === 2)
        return h("span", {}, "省级项目")
      if (row.status === 3)
        return h("span", {}, "国家级项目")
    }
  },
  {
    key: "user",
    title: "申报人",
    render: (row: project) => {
      return h("span", {}, `${row.user.name}[${row.user.uid}]`/*row.user.name+"["+row.user.uid+"]"*/)

    }
  },
  {
    key: "guideuser",
    title: "指导老师",
    render: (row: project) => {
      return h("span", {}, row.guideUser.name + "[" + row.guideUser.uid + "]")
    }
  },
  {
    key: "description",
    title: "介绍",
  },
  {
    key: "status",
    title: "项目状态",
    width: 150,
    render: (row: project) => {
      if (row.delFlag)
        return h("span", {}, "已删除")
      else {
        if (row.status === 0)
          return h("span", {}, "未审核")
        if (row.status === 1)
          return h("span", {}, "校级")
        if (row.status === 2)
          return h("span", {}, "省级")
        if (row.status === 3)
          return h("span", {}, "国家级")
      }
    },
    defaultFilterOptionValues: [0, 1, 2, 3, 4],
    filterOptions: [
      {
        label: "未审核",
        value: 0
      },
      {
        label: "校级",
        value: 1
      },
      {
        label: "省级",
        value: 2
      },
      {
        label: "国家级",
        value: 3
      },
      {
        label: "已删除",
        value: 4
      }
    ],
    // filter(value: number, row: project) {
    //   if (value !== 4)
    //     return row.status === value && row.delFlag === 0
    //   else
    //     return row.delFlag === 1
    // }
  },
  {
    key: "actions",
    title: "操作",
    render: (row: project) => {
      const del = h(
        NButton,
        {
          type: row.delFlag === 1 ? 'success' : 'error',
          strong: true,
          tertiary: true,
          onClick: async () => {
            const res = await request.post("/project/delete", {
              id: row.id,
              delFlag: row.delFlag === 1 ? 0 : 1
            })
            if (res.data.code === 200) {
              window.$message.success("删除成功")
              getProjects()
            } else {
              window.$message.error("删除失败")
            }
          }
        },
        { default: () => row.delFlag === 1 ? "恢复" : "删除" }
      )
      const edit = h(
        NButton,
        {
          strong: true,
          tertiary: true,
          onClick: async () => {
            addMode.value = false
            showModal.value = true
            formValue.id = String(row.id)
            formValue.name = row.name
            formValue.status = String(row.status)
            formValue.uid = String(row.uid)
            formValue.guide = String(row.guide)
            formValue.description = row.description
          }
        },
        { default: () => '编辑' }
      )
      const space = h(NSpace, {}, { default: () => [edit, del] })
      return space
    }
  }
]

//定义一个formValue,参照rules

const formValue = reactive({
  id: "",
  name: "",
  status: "",
  applyer: "",
  uid: "",
  guide: "",
  description: ""
})

//定义rules
const rules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  },
  type: {
    required: true,   //必填项
    type: 'number',    //类型为数字
    message: '请选择项目类型',
    trigger: 'blur'
  },
  applyer: {
    required: true,
    message: '请输入申报人学工号',
    trigger: ['input', 'blur']
  },
  guide: {
    required: true,
    message: '请输入指导老师学工号',
    trigger: ['input', 'blur']
  },
  description: {
    required: true,
    message: '请输入项目介绍',
    trigger: ['input']
  }
}


const value = ref(null)

const options = [
  { label: '校级项目', value: '1' },
  { label: '省级项目', value: '2' },
  { label: '国家级项目', value: '3' }
]

const formRef = ref<FormInst | null>(null)

//添加项目按钮de响应事件
const handleClick = async (e: MouseEvent) => {
  e.preventDefault()
  var data = {
    id: formValue.id,
    name: formValue.name,
    status: formValue.status,
    applyer: formValue.applyer,
    uid: formValue.uid,
    guide: formValue.guide,
    description: formValue.description
  }
  const res = await request.post('/project/' + (addMode.value ? 'start' : 'update'), addMode.value ? data : { ...data, id: formValue.id })
  formRef.value?.validate((error) => {
    if (!error) {
      window.$message.success("OK")
      showModal.value = false
      getProjects()
      return
    }
    window.$message.error("error") //挂在window对象如果输入错误
  })

}

// 搜索框
const searchValue = ref<string>("")

// projects的计算属性
const projectsList = computed(() => {
  if (searchValue.value !== "")
    return projects.value.filter((item) => item.name.includes(searchValue.value) || item.pid.includes(searchValue.value))
  else
    return projects.value
})

onMounted(() => {
  getProjects()
})
</script>


<template>
  <n-page-header subtitle="无论谁都犯过错不是么？">
    <n-grid :cols="5">
      <n-gi>
        <n-statistic label="现有项目数量" :value="projects.filter((item) => item.delFlag === 0).length" />
      </n-gi>
      <n-gi>
        <n-statistic label="校级项目数量" :value="projects.filter((item) => item.status === 1 && item.delFlag === 0).length" />
      </n-gi>
      <n-gi>
        <n-statistic label="省级项目数量" :value="projects.filter((item) => item.status === 2 && item.delFlag === 0).length" />
      </n-gi>
      <n-gi>
        <n-statistic label="国家级项目数量" :value="projects.filter((item) => item.status === 3 && item.delFlag === 0).length" />
      </n-gi>
      <n-gi>
        <n-statistic label="已删除项目数量" :value="projects.filter((item) => item.delFlag === 1).length" />
      </n-gi>
    </n-grid>
    <template #title>
      <a href="#" style="text-decoration: none; color: inherit">项目管理</a>
    </template>
    <template #extra>
      <n-input v-model:value="searchValue" type="text" placeholder="根据项目编号或项目名称搜索" />
    </template>
  </n-page-header>

  <n-space>
    <n-button type="primary" @click="addMode = true, showModal = true">添加项目</n-button>
  </n-space>

  <!-- <n-space>
                                                  <n-input v-model:value="searchValue" type="text" placeholder="模糊搜索" />
                                                </n-space> -->

  <n-data-table style="margin-top: 10px;" :columns="col" :data="projectsList" />
  <n-modal v-model:show="showModal">
    <n-card style="max-width: 700px;" :title="addMode ? '添加项目' : '修改项目'" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <n-form :model="formValue" :formRules="rules" :label-width="80" ref="formRef">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="项目名称" />
        </n-form-item>
        <n-form-item label="项目类型" path="type" placeholder="请选择项目类型">
          <!-- <n-select v-model:value="formValue.type" /> -->
          <n-select v-model:value="formValue.status" :options="options" />
          <!-- <n-select v-model:value="value" :options="options" /> -->
        </n-form-item>
        <n-form-item label="申报人学工号" path="applyer">
          <n-input v-model:value="formValue.uid" placeholder="项目申报人学号" />
        </n-form-item>
        <n-form-item label="指导老师学工号" path="guide" placeholder="项目指导老师工号">
          <n-input v-model:value="formValue.guide" />
        </n-form-item>
        <n-form-item label="项目介绍" path="description" placeholder="在这里写点对你的项目的简介">
          <n-input v-model:value="formValue.description" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space style="float: right;">
          <n-button type="primary" @click="handleClick">确定</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>  
  


  