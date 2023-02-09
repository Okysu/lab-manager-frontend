<template>
  <n-global-style />
    <n-result class="box" status="404" title="404 资源不存在" description="你拼命想要得到的，很有可能在别人那里唾手可得。">
      <template #footer>
        <n-button @click="back" size="large" round>返回上一页</n-button>
      </template>
    </n-result>
</template>

<script setup lang="ts">
const back = () => {
  window.history.back()
}
</script>

<style scoped>
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>