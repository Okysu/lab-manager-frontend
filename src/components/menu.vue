<template>
    <n-menu :collapsed-width="config.isMobile ? 0 : 64" :collapsed-icon-size="22" :options="menu" :value="value"
        @update:value="update" :default-expanded-keys="config.menu"
        @update:expanded-keys="(e: string[]) => { config.setMenu(e) }" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import type { MenuOption, MenuDividerOption, MenuGroupOption } from "naive-ui"
import sha1 from "sha1"
// 获取路由
import { useRouter, useRoute } from "vue-router"
// 异步获取图标
import { asyncRenderIcon } from "@/tools/vicons"
// 获取用户的存储
import { appConfig } from "@/stores/appConfig"
import request from "@/tools/request"
const config = appConfig()
const router = useRouter()
const route = useRoute()
// url取最后一个/后面的内容
const url = route.path.split("/").pop() as string
const value = ref(url)
const update = (v: string) => {
    value.value = v
    router.push({ name: v })
}
// 菜单
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
const menu = ref()
onMounted(async () => {
    const transMenu = ref<Array<MenuOption | MenuDividerOption | MenuGroupOption>>([])
    // 获取路由表
    const remote = await request.post("/user/menu/get")
    const data = JSON.parse(remote.data.data) as remote[]
    transMenu.value = await Promise.all(
        data.map(async (item) => {
            if (item.children) {
                return {
                    label: item.label,
                    key: item.key,
                    icon: await asyncRenderIcon(item.icon as string),
                    children: await Promise.all(
                        item.children.map(async (child) => {
                            return await getOption(child)
                        })
                    ),
                }
            } else {
                return await getOption(item)
            }
        })
    )
    menu.value = transMenu.value
})
</script>