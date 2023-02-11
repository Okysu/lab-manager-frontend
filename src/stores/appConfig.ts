import { defineStore } from 'pinia'

// 有关系统配置的store
export const appConfig = defineStore('appConfig', {
  state: () => ({
    locale: 'zhCN',
    theme: 'auto',
    collapsed: true, // 侧边栏是否展开
    isMobile: false,
    menu: [] as string[], // 菜单选择的key
  }),
  getters: {
    getLocale: (state) => state.locale,
    getTheme: (state) => state.theme,
    getcollapsed: (state) => state.collapsed,
    getIsMobile: (state) => state.isMobile,
    getMenu: (state) => state.menu,
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    setTheme(theme: string) {
      this.theme = theme
    },
    setcollapsed(collapsed: boolean) {
      this.collapsed = collapsed
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },
    setMenu(menu: string[]) {
      this.menu = menu
    },
  },
  persist: true,
})
