<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue"
import type { FormInst, FormItemRule } from "naive-ui"
// 验证码类
import vaildcode from "@/tools/validcode"
// http请求
import request from "@/tools/request"
// 用户的存储
import { userCommon } from "@/stores/user"
// 路由跳转
import { useRouter } from "vue-router"
// 引入事件总线
import { events } from '@/tools/eventBus'
const router = useRouter()
// 获取用户的存储
const u = userCommon()
// 表单实例
const form = ref<FormInst>()
// 用户登录的value ref
const loginValue = reactive({
    id: "10001",
    password: "12345678",
    codecheck: "",
    loading: false,
})
// 验证码实例
const code = ref<HTMLCanvasElement>()
const vaild = new vaildcode()
// 用户登录的表单验证规则
const loginRules = {
    id: [
        {
            required: true,
            message: '请输入你的账号',
            trigger: 'blur'
        },
        {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
        }
    ],
    password: [
        {
            required: true,
            message: '请输入你的密码',
            trigger: 'blur'
        },
        {
            min: 6,
            max: 64,
            message: "长度在 6 到 64 个字符",
            trigger: "blur",
        }
    ],
    codecheck: {
        required: true,
        trigger: 'blur',
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error('请输入验证码')
            }
            if (!vaild.validate(value)) {
                return new Error('验证码错误')
            }
            return true
        },
    }
}
// 登录逻辑
const login = (e: MouseEvent) => {
    // 验证表单
    e.preventDefault()
    form.value?.validate(async (errors) => {
        if (errors) {
            return
        }
        // 发送请求
        const data = {
            uid: loginValue.id,
            password: loginValue.password,
        }
        loginValue.loading = true
        const res = await request.post("/user/login", data)
        // 登录成功
        const { code, data: { token, user, error }, msg } = res.data as response
        if (code === 200 && msg === "登录成功") {
            u.setLoginTime(Date.now())
            u.setToken(token)
            u.setUser(user)
            window.$notify.success({
                title: "登录成功",
                description: "欢迎回来！",
                duration: 2000,
            })
            //TODO: 路由表
            router.push("/console/user")
        } else {
            window.$notify.error({
                title: "登录失败",
                description: error,
                duration: 2000,
            })
            vaild.draw()
        }
        loginValue.loading = false
    })
}
onMounted(() => {
    // 生成验证码
    vaild.setRef(code.value as HTMLCanvasElement)
    vaild.draw()
})
</script>
<template>
    <n-global-style />
    <div class="background"></div>
    <n-card :bordered="true" class="box">
        <n-tabs value="signin" class="card-tabs" default-value="signin" size="large" animated style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
            <n-tab-pane name="signin" tab="登录">
                <n-form size="large" ref="form" :model="loginValue" :rules="loginRules">
                    <n-form-item path="id" label="用户名">
                        <n-input v-model:value="loginValue.id" type="text" placeholder="请输入登录账号..." />
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="loginValue.password" type="password" placeholder="请输入登录密码..." />
                    </n-form-item>
                    <n-form-item path="codecheck" label="验证码">
                        <n-input v-model:value="loginValue.codecheck" type="text" placeholder="请输入验证码..." />
                        <canvas ref="code" @click="vaild.draw" height="40" width="120"></canvas>
                    </n-form-item>
                </n-form>
                <n-button :loading="loginValue.loading" :disabled="loginValue.loading || u.login" @click="login"
                    type="primary" block secondary strong>{{ u.login ? "已登录" : "登录" }}</n-button>
            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
}

@media only screen and (min-width: 550px) {
    .background {
        -webkit-filter: brightness(0.8);
        -ms-filter: brightness(0.8);
        -moz-filter: brightness(0.8);
        filter: brightness(0.8);
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: url(https://source.yby.zone/upload/images/1655001503_P15Qqvxb1oe.jpg) center no-repeat;
        background-size: cover;
    }

    .box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 400px;
    }
}

@media only screen and (max-width: 550px) {
    .box {
        width: 100%;
        height: 100%;
    }
}
</style>