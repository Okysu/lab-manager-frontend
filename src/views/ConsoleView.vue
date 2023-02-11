<script lang="ts" setup>
import { onMounted, reactive, computed, h } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import { appConfig } from '@/stores/appConfig'
import { userCommon } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { RouterView, useRouter } from 'vue-router'
import { randomColor, reverseColor } from '@/tools/string'
import request from '@/tools/request'
import Menu from '@/components/menu.vue'
// 引入事件总线
import { events } from '@/tools/eventBus'
import {
  SettingsOutline as SettingsIcon,
  RefreshOutline as RefreshIcon,
  SunnyOutline as SunnyIcon,
  MoonOutline as MoonIcon,
  TimeOutline as TimeIcon,
  PeopleOutline as PeopleIcon,
  LogOutOutline as LogoutIcon,
} from '@vicons/ionicons5'
// 渲染图标
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const router = useRouter()
const config = appConfig()
const box = reactive(
  {
    width: window.innerWidth,
    height: window.innerHeight,
  }
)
const color = {
  color: randomColor(),
}
// 挂载后回调
onMounted(() => {
  box.width = window.innerWidth
  box.height = window.innerHeight
  window.addEventListener('resize', () => {
    box.width = window.innerWidth
    box.height = window.innerHeight
  })
})

// sider的相关逻辑
const { collapsed } = storeToRefs(config)

// popover的相关逻辑
const popover = reactive({
  hello: computed(() => {
    // 根据时间来判断
    const hour = new Date().getHours()
    if (hour > 6 && hour < 12) {
      return '早上好'
    } else if (hour >= 12 && hour < 18) {
      return '下午好'
    } else if (hour >= 18 && hour < 24) {
      return '晚上好'
    } else {
      return '夜深了'
    }
  }),
})

const { user } = userCommon()

// menu的相关逻辑
const popoverMenu = reactive({
  menu: [
    {
      label: '个人中心',
      key: 'profile',
      icon: renderIcon(PeopleIcon),
    },
    // {
    //   label: '系统设置',
    //   key: 'settings',
    //   icon: renderIcon(SettingsIcon),
    // },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: renderIcon(LogoutIcon),
    }
  ],
  update: (v: string) => {
    if (v === 'logout') {
      request.post('/user/logout').then(() => {
        router.push('/')
        userCommon().logout()
      })
    }
    return
  }
})

const changeTheme = (value: string) => {
  events.emit('theme', value)
}


// 获取当前主题
const currentTheme = computed(() => {
  if (config.theme === 'auto') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    } else {
      return 'light'
    }
  } else {
    return config.theme
  }
})

// 使用router刷新本页面
const refresh = () => {
  router.go(0)
}

</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.float-right {
  float: right;
}

.header-bar-right {
  display: flex;
  align-items: center;
  gap: 32px;
}
</style>

<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px;" bordered>
      <div class="header-bar">
        <h2>控制台</h2>
        <div class="header-bar-right">
          <n-button text style="font-size: 22px;" @click="refresh">
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </n-button>
          <n-popover trigger="hover" style="width: 250px">
            <template #trigger>
              <n-avatar :style="{
                color: color.color,
                backgroundColor: reverseColor(color.color)
              }">
                {{ user.name[0] }}
              </n-avatar>
            </template>
            <n-list>
              <n-list-item>
                <template #prefix>
                  <n-avatar :size="48" :style="{
                    color: color.color,
                    backgroundColor: reverseColor(color.color)
                  }">
                    {{ user.name[0] }}
                  </n-avatar>
                </template>
                <h3>{{ popover.hello }}，</h3>
                <p>{{ user.name }}</p>
              </n-list-item>
              <n-list-item>
                <n-menu :options="popoverMenu.menu" :value="null" @update:value="popoverMenu.update" />
              </n-list-item>
              <n-list-item>
                <n-button-group class="float-right">
                  <n-button icon-placement="left" size="tiny" @click="changeTheme('auto')">
                    <n-icon>
                      <TimeIcon />
                    </n-icon>
                    <span>自动</span>
                  </n-button>
                  <n-button icon-placement="left" size="tiny"
                    @click="changeTheme(currentTheme === 'light' ? 'dark' : 'light')">
                    <n-icon>
                      <MoonIcon v-if="currentTheme === 'light'" />
                      <SunnyIcon v-else />
                    </n-icon>
                    <span>{{ currentTheme === 'light' ? '深色' : '浅色' }}</span>
                  </n-button>
                </n-button-group>
              </n-list-item>
            </n-list>
          </n-popover>
        </div>
      </div>
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px;" has-sider>
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="config.isMobile ? 0 : 64"
        :width="240" :native-scrollbar="false" v-model:collapsed="collapsed" @contextmenu.prevent="">
        <Menu />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <RouterView />
      </n-layout>
    </n-layout>
  </n-layout>
</template>