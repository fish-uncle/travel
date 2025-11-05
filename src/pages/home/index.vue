<template>
  <div class="container">
    <top />
    <tab />
    <list />
  </div>
</template>
<script lang="ts" setup>
import top from "./components/top.vue";
import tab from "./components/tab.vue";
import list from "./components/list.vue";
</script>
<style lang="scss" scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
