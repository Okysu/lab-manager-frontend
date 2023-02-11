<script lang="ts" setup>
import { ref } from "vue"
import request from '@/tools/request'
import { dateDescription, binarySize } from "@/tools/string"
const data = ref(
    {
        time: 0,
        memory: 0,
        version: 0,
    }
)
request.post('/public/system/get').then(res => {
    data.value = res.data.data
})

</script>

<style scoped>
.n-card{
    margin-top: 10px;
    min-height: calc(100vh - 240px);
}
</style>

<template>
    <n-page-header subtitle="其实很鸡肋，但大家都喜欢写">
        <n-grid :cols="3">
            <n-gi>
                <n-statistic label="运行时间" :value="dateDescription(data.time)" />
            </n-gi>
            <n-gi>
                <n-statistic label="内存占用" :value="binarySize(data.memory)" />
            </n-gi>
            <n-gi>
                <n-statistic label="系统版本" :value="data.version" />
            </n-gi>
        </n-grid>
        <template #title>
            <a href="#" style="text-decoration: none; color: inherit">系统信息</a>
        </template>
    </n-page-header>
    <n-card title="按理说这里应该有个控制台的">
        <h1>但先做业务</h1>
    </n-card>
</template>

