import { defineStore } from 'pinia'

const expireTime = 1000 * 60 * 60 * 24 * 7 // 7天

// 有关用户的store
export const userCommon = defineStore('usrCommon', {
    state: () => ({
        user: {} as user,
        token: '',
        loginTime: 0,
    }),
    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        getLoginTime: (state) => state.loginTime,
        login: (state) => state.loginTime + expireTime > Date.now(),
    },
    actions: {
        setUser(user: user) {
            this.user = user
        },
        setToken(token: string) {
            this.token = token
        },
        setLoginTime(loginTime: number) {
            this.loginTime = loginTime
        }
    },
    persist: true,
})
