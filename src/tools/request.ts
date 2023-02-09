import axios from 'axios'
import sha1 from 'sha1'

// 引入userCommon
import { userCommon } from '@/stores/user'
const user = userCommon()
const { login, token } = user

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

request.interceptors.request.use(function (config) {
    // 请求拦截器
    // 如果请求的内容有password字段，就对其进行sha1加密
    if (config.data.password)
        config.data.password = sha1(config.data.password)

    // 如果用户已登录，就在请求头中添加token
    if (login)
        config.headers.Authorization = "Bearer " + token
    else
        user.setLoginTime(0)

    return config
}, function (error) {

    return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
    // 响应拦截器
    const result = response.data as response
    if (result.code === 401) {
        // 未认证
    }
    if (result.code === 400) {
        // 请求错误
        window.$notify.error({
            title: "请求错误",
            content: result.msg,
            duration: 2000,
        })
    }
    if (result.code === 500) {
        // 服务器错误
        if (result.data.error !== "用户名或密码错误")
            window.$notify.error({
                title: "服务器错误",
                content: "这是我们的服务器问题，请放心，这并不是你的问题。",
                duration: 2000,
            })
        console.error(result.msg)
    }
    if (result.code === 403) {
        // 权限不足
        window.$notify.error({
            title: "权限不足",
            content: "别着急，总有一天你会拥有你所想要的。",
            duration: 2000,
        })
    }
    return response
}, function (error) {

    return Promise.reject(error)
})

export default request