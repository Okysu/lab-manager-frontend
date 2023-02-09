<template>
  <n-global-style />
  <n-result class="box" status="403" title="403 访问被拒绝" description="总有些门是对你关闭的">
    <template #footer>
      <n-button @click="back" size="large" round>返回上一页</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
const back = () => {
  window.history.back();
};
</script>

<style scoped>
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>