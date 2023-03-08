<script lang="ts" setup>
import { ref, onMounted, h, computed } from 'vue'
import request from '@/tools/request'
import { NButton, NSpace } from 'naive-ui'
const projects = ref<project[]>([])
const getProjects = async () => {
  const response = await request.post("/project/get", { filter: false })
  if (response.data.code = 200) {
    projects.value = response.data.data
  }
}
// 表格的表头
const col = [
  {
    key: "pid",
    title: "项目编号",
    width: 150
  },
  {
    key: "name",
    title: "项目名称",
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
    filter(value: number, row: project) {
      if (value !== 4)
        return row.status === value && row.delFlag === 0
      else
        return row.delFlag === 1
    }
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
            const res = await request.post("/project/del", {
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
      const space = h(NSpace, {}, { default: () => [del] })
      return space
    }
  }
]

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
  <!-- <n-space>
                              <n-input v-model:value="searchValue" type="text" placeholder="模糊搜索" />
                            </n-space> -->
  <n-data-table style="margin-top: 10px;" :columns="col" :data="projectsList" />
</template>  
  


  