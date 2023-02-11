<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from "vue"
import request from '@/tools/request'
import routes from '@/routes'
import { appConfig } from "@/stores/appConfig"
import { asyncRenderIcon } from "@/tools/vicons"
import { CloseOutline as CloseIcon } from "@vicons/ionicons5"
import { useRouter } from "vue-router"
import sha1 from "sha1"
const config = appConfig()
const roles = reactive<role[]>([])
const menus = reactive<menu[]>([])
const router = useRouter()
onMounted(async () => {
    const { data } = await request.post('/role/get')
    roles.push(...data.data)
    const { data: menusData } = await request.post('/menu/get')
    menus.push(...menusData.data)
    setActive(roles[0])
})
const active = ref<role>(
    {
        id: 1,
        name: 'ADMIN',
        description: '',
    }
)
const getOption = async (menu: remote) => {
    // 如果label是divider，那么就是分割线
    if (menu.label === "divider") {
        return {
            type: "divider",
            key: sha1(Date.now().toString() + Math.random()),
        }
    }
    if (menu.icon)
        return {
            label: menu.label,
            key: menu.key,
            icon: await asyncRenderIcon(menu.icon),
        }
    return {
        label: menu.label,
        key: menu.key,
    }
}
const chosedMenu = ref()
const setActive = async (role: role) => {
    active.value = role
    // 获取菜单，根据角色id寻找menu
    const menu = menus.find(menu => menu.rid === role.id)
    if (!menu) return
    const data = JSON.parse(menu.menu) as remote[]
    customValue.value = remoteToDesign(data)
    chosedMenu.value = await Promise.all(
        data!.map(async (item) => {
            if (item.children) {
                return {
                    label: item.label,
                    key: item.key,
                    icon: await asyncRenderIcon(item.icon as string),
                    children: await Promise.all(
                        item.children.map(async (child: remote) => {
                            return await getOption(child)
                        })
                    ),
                }
            } else {
                return await getOption(item)
            }
        })
    )
}
const testMenu = (value: string) => {
    window.$message.success("它将前往的路由是/consoel/" + value)
}
interface design {
    id?: number
    label: string
    key?: string
    icon?: string
    children?: design[]
}
const showModal = ref(false)
const customValue = ref<design[]>([
    {
        id: 1,
        label: "",
        key: "",
        icon: ""
    }
])
const onCreate = () => {
    return {
        id: 1,
        label: "",
        key: "",
        icon: ""
    }
}
const previewDesign = ref()
const preview = async (result: remote[]) => {
    const data = JSON.parse(JSON.stringify(result)) as remote[]
    previewDesign.value = await Promise.all(
        data!.map(async (item) => {
            if (item.children) {
                return {
                    label: item.label,
                    key: item.key,
                    icon: await asyncRenderIcon(item.icon as string),
                    children: await Promise.all(
                        item.children.map(async (child: remote) => {
                            return await getOption(child)
                        })
                    ),
                }
            } else {
                return await getOption(item)
            }
        })
    )
}
// 将remote菜单转换为design菜单
const remoteToDesign = (remote: remote[]): design[] => {
    const result: design[] = []
    // 自增id
    let id = 1
    remote.forEach(item => {
        // 如果有children，那么就使用相同id push进去
        if (item.children) {
            result.push({
                id: id,
                label: item.label,
                key: item.key,
                icon: item.icon,
            })
            item.children.forEach(child => {
                result.push({
                    id: id,
                    label: child.label,
                    key: child.key,
                    icon: child.icon,
                })
            })
            id++
        } else {
            result.push({
                id: id++,
                label: item.label,
                key: item.key,
                icon: item.icon,
            })
        }
    })
    return result
}
const mergeDesigns = (designs: design[]): design[] => {
    // 如果有相同id的，那么就合并到第一个出现该id的children里面
    const origin = JSON.parse(JSON.stringify(designs)) as design[]
    const result: design[] = []
    const map = new Map<number, design>()
    origin.forEach(design => {
        if (map.has(design.id!)) {
            const item = map.get(design.id!)
            if (item!.children) {
                item!.children.push(design)
            } else {
                item!['children'] = [design]
            }
        } else {
            map.set(design.id!, design)
            result.push(design)
        }
    })
    // 删除所有的id字段
    result.forEach(item => {
        delete item.id
        if (item.children) {
            item.children.forEach(child => {
                delete child.id
            })
        }
    })
    preview(result)
    return result
}
watch(customValue, (value) => {
    mergeDesigns(value)
}, { deep: true })

const save = async () => {
    const result = mergeDesigns(customValue.value)
    const push = {
        id: active.value.id,
        menu: JSON.stringify(result),
    }
    const res = await request.post("/menu/set", push)
    if (res.data.code === 200) {
        window.$message.success("保存成功")
    } else {
        window.$message.error("保存失败")
    }
    showModal.value = false
    router.go(0)
}

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
    <n-page-header subtitle="这个其实不是用来点菜的">
        <n-grid :cols="3">
            <n-gi>
                <n-statistic label="角色数量" :value="roles.length" />
            </n-gi>
            <n-gi>
                <n-statistic label="菜单数量" :value="menus.length" />
            </n-gi>
            <n-gi>
                <n-statistic label="路由数量" :value="routes.length" />
            </n-gi>
        </n-grid>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">菜单管理</a>
        </template>
    </n-page-header>
    <n-grid :cols="2" style="margin-top: 10px;" x-gap="12" y-gap="12">
        <n-gi>
            <n-grid :cols="config.isMobile ? 1 : 2" x-gap="10" y-gap="10" class="scoped">
                <n-gi v-for="role in roles">
                    <n-card :title="role.name" :class="active?.id === role.id ? 'active' : ''" @click="setActive(role)">
                        {{ role.description }}
                    </n-card>
                </n-gi>
            </n-grid>
        </n-gi>
        <n-gi>
            <n-page-header subtitle="主菜，辅料，生活">
                <template #title>
                    <a href="#" style="text-decoration: none; color: inherit">预览</a>
                </template>
                <template #extra>
                    <n-button @click="showModal = true">设计器</n-button>
                </template>
            </n-page-header>
            <n-menu :options="chosedMenu" @update:value="testMenu" />
        </n-gi>
    </n-grid>
    <n-modal v-model:show="showModal" transform-origin="center">
        <n-card style="min-width: 100%; min-height: 100vh;" title="菜单设计器" :bordered="false" size="huge" role="dialog"
            aria-modal="true">
            <template #header-extra>
                <n-button text style="font-size: 22px;" @click="showModal = false">
                    <n-icon>
                        <CloseIcon />
                    </n-icon>
                </n-button>
            </template>
            <template #footer>
                <n-space style="float: right;">
                    <n-button @click="showModal = false">取消</n-button>
                    <n-button type="primary" @click="save">确定</n-button>
                </n-space>
            </template>
            <n-blockquote>
                第一个是id，第二个是显示的标签，第三个是key，第四个是图标名称
                <br>
                当相同id时，会自动合并为第一个出现该id的子级
                <br>
                图标名称来自于<n-a href="https://www.xicons.org/#/">ionicons5</n-a>
            </n-blockquote>
            <n-dynamic-input show-sort-button v-model:value="customValue" @create="onCreate" :min="1">
                <template #default="{ value }">
                    <div style="display: flex; align-items: center; width: 100%">
                        <n-input-number v-model:value="value.id" style="margin-right: 12px; width: 180px" />
                        <n-input v-model:value="value.label" placeholder="显示的标签"
                            style="margin-right: 12px; width: 180px" />
                        <n-input v-model:value="value.key" placeholder="当无子级时会跳转到name为key的页面"
                            style="margin-right: 12px; width: 180px" />
                        <n-input v-model:value="value.icon" placeholder="图标名称" style="margin-right: 12px;" />
                    </div>
                </template>
            </n-dynamic-input>
            <n-menu :options="previewDesign" @update:value="testMenu" />
        </n-card>
    </n-modal>
</template>