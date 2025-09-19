<template>
  <div class="hello-page">
    <h1>Hello World!</h1>
    <p>如果你能看到这个页面，说明 Nuxt3 项目运行正常！</p>
    
    <div class="features">
      <h2>功能测试</h2>
      <ul>
        <li>✅ Vue 3 运行正常</li>
        <li>✅ Nuxt 3 运行正常</li>
        <li>✅ TypeScript 运行正常</li>
        <li>✅ SCSS 运行正常</li>
      </ul>
    </div>

    <div class="actions">
      <button @click="goHome" class="btn">返回首页</button>
      <button @click="goSimple" class="btn">简单测试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const goHome = () => {
  navigateTo('/')
}

const goSimple = () => {
  navigateTo('/simple')
}

useHead({
  title: 'Hello World - 测试页面'
})
</script>

<style scoped lang="scss">
.hello-page {
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #0ABFC5;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
}

.features {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin: 30px 0;
  text-align: left;
}

.features h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 10px 0;
  font-size: 1.1rem;
  color: #555;
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
}

.btn {
  padding: 12px 24px;
  background: #0ABFC5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #00838F;
}
</style>
