<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import {
  zhCN,
  dateZhCN,
  enUS,
  dateEnUS,
  lightTheme,
  darkTheme,
} from 'naive-ui'
// 引入事件总线
import { events } from '@/tools/eventBus'
// 引入provider component
import Xdialog from '@/components/dialog.vue'
import notification from './components/notification.vue'
import message from '@/components/message.vue'
import loadingBar from '@/components/loadingBar.vue'
// 引入系统配置store
import { appConfig } from '@/stores/appConfig'
import { storeToRefs } from 'pinia'
const config = appConfig()

// 配置的响应式数据
const settings = reactive({
  locale: zhCN,
  dateLocale: dateZhCN,
  theme: lightTheme,
})

// naiveui的全局主题配置
const themeOverrides = {
  common: {},
  Button: {}
}

// 设置本土化
const localeHandler = (locale: string) => {
  switch (locale) {
    case 'zh-CN':
      settings.locale = zhCN
      settings.dateLocale = dateZhCN
      break
    case 'en-US':
      settings.locale = enUS
      settings.dateLocale = dateEnUS
      break
    default:
      settings.locale = zhCN
      settings.dateLocale = dateZhCN
      break
  }
}

// 设置主题
const themeHandler = (theme: string) => {
  switch (theme) {
    case 'dark':
      settings.theme = darkTheme
      break
    case 'light':
      settings.theme = lightTheme
      break
    case 'auto':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        settings.theme = darkTheme
      } else {
        settings.theme = lightTheme
      }
      break
    default:
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        settings.theme = darkTheme
      } else {
        settings.theme = lightTheme
      }
      break
  }
}
const { locale, theme, isMobile } = storeToRefs(config)
localeHandler(locale.value)
themeHandler(theme.value)


onMounted(() => {
  // 监听主题变化
  events.on('theme', (e) => {
    const data = e as string
    themeHandler(data)
    theme.value = data
  })

  // 监听窗口大小变化
  const handleResize = () => {
    if (window.innerWidth < 768) {
      isMobile.value = true
    } else {
      isMobile.value = false
    }
  }
  window.addEventListener('resize', handleResize)
  handleResize()
})

// 销毁时移除事件监听
onBeforeUnmount(() => {
  events.off('theme')
})

</script>

<template>
  <n-message-provider>
    <message />
  </n-message-provider>
  <n-notification-provider>
    <notification />
  </n-notification-provider>
  <n-dialog-provider>
    <Xdialog />
  </n-dialog-provider>
  <n-loading-bar-provider>
    <loadingBar />
  </n-loading-bar-provider>
  <n-config-provider :locale="settings.locale" :date-locale="settings.dateLocale" :theme-overrides="themeOverrides"
    :theme="settings.theme" inline-theme-disabled>
    <RouterView />
  </n-config-provider>
</template>