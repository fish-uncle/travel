<template>
  <div id="app" :class="themeClass" class="page-container">
    <div class="page-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

// 页面元信息
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

// 主题管理
const { themeClass, initTheme } = useTheme()

// 初始化
onMounted(() => {
  initTheme()
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
}

#app {
  height: 100%;
  background: var(--background, #fafafa);
  color: var(--text-primary, #212121);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 暗黑模式滚动条 */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 选择文本样式 */
::selection {
  background: rgba(10, 191, 197, 0.2);
  color: inherit;
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid var(--primary-color, #0ABFC5);
  outline-offset: 2px;
}

/* 按钮焦点样式 */
button:focus-visible {
  outline: 2px solid var(--primary-color, #0ABFC5);
  outline-offset: 2px;
}

/* 输入框焦点样式 */
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--primary-color, #0ABFC5);
  outline-offset: 2px;
}

/* 禁用状态 */
[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* 加载状态 */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 骨架屏动画 */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.dark .skeleton {
  background: linear-gradient(
    90deg,
    #333 25%,
    #444 50%,
    #333 75%
  );
  background-size: 200% 100%;
}

/* 涟漪效果 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::before {
  width: 300px;
  height: 300px;
}

/* 工具类 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式断点 */
@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 769px) {
  .container {
    padding: 0 32px;
  }
}

/* 暗黑模式 */
.dark {
  --primary-color: #4DD0D1;
  --primary-light: #80E5E6;
  --primary-dark: #00838F;
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-disabled: #666666;
  --divider: #333333;
  --background: #121212;
  --surface: #1E1E1E;
  --shadow: rgba(0, 0, 0, 0.3);
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --primary-color: #0066CC;
    --text-primary: #000000;
    --text-secondary: #333333;
    --divider: #666666;
    --background: #FFFFFF;
  }
  
  .dark {
    --primary-color: #66B3FF;
    --text-primary: #FFFFFF;
    --text-secondary: #CCCCCC;
    --divider: #999999;
    --background: #000000;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
