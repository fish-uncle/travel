<template>
  <div class="icon-test">
    <h1>图标测试页面</h1>

    <div class="icon-grid">
      <div class="icon-item">
        <Icon name="carbon:airplane" size="24" />
        <span>carbon:airplane</span>
      </div>
      <div class="icon-item">
        <Icon name="carbon:train" size="24" />
        <span>carbon:train</span>
      </div>
      <div class="icon-item">
        <Icon name="carbon:bus" size="24" />
        <span>carbon:bus</span>
      </div>
      <div class="icon-item">
        <Icon name="carbon:hotel" size="24" />
        <span>carbon:hotel</span>
      </div>
      <div class="icon-item">
        <Icon name="carbon:location" size="24" />
        <span>carbon:location</span>
      </div>
      <div class="icon-item">
        <Icon name="carbon:circle-dot" size="24" />
        <span>carbon:circle-dot</span>
      </div>
    </div>

    <div class="actions">
      <button @click="goHome" class="btn">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const goHome = () => {
  navigateTo("/");
};

useHead({
  title: "图标测试页面",
});
</script>

<style scoped lang="scss">
.icon-test {
  padding: $spacing-lg;
  max-width: 800px;
  margin: 0 auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
  margin: $spacing-lg 0;
}

.icon-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
}

.btn {
  padding: $spacing-sm $spacing-md;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: $radius-sm;
  cursor: pointer;

  &:hover {
    background: color.adjust($primary-color, $lightness: -10%);
  }
}
</style>
