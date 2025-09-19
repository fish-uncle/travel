# 我的线路 - 携程同款交互的行程规划应用

一个基于 Nuxt3 的移动端 H5 应用，完整复刻携程「我的线路」的交互体验。

## ✨ 特性

- 🎨 **完整复刻携程交互** - 首页 Tab 切换、新建向导、详情页双视图
- 📱 **移动端优化** - 拇指友好设计，≥48px 触摸区域
- 🗺️ **高德地图集成** - 支持地图视图、标记点、信息窗口、路径规划
- 🚌 **交通管理** - 航班、火车、巴士等交通信息添加和管理
- 💾 **本地存储** - SQLite3 数据库，数据本地持久化
- 🌙 **暗黑模式** - 自动跟随系统主题，支持手动切换
- 📁 **文件管理** - 图片压缩、PDF 支持、Base64 存储
- ⚡ **性能优化** - 虚拟滚动、懒加载、防抖处理
- 🎭 **丰富动画** - 页面切换、涟漪效果、Lottie 动画
- 📲 **PWA 支持** - 离线使用、应用安装、推送通知

## 🛠️ 技术栈

- **框架**: Nuxt3 (SSR 关闭) + Vue3 + TypeScript
- **状态管理**: Pinia + SQLite3
- **样式**: SCSS + TailwindCSS
- **地图**: 高德地图 API
- **图标**: unplugin-icons + Carbon Icons
- **表单验证**: VeeValidate + Yup
- **日期处理**: Day.js
- **动画**: Lottie Web
- **数据库**: SQLite3

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 数据库配置

项目使用 SQLite3 作为本地数据库，无需额外配置。数据库文件会自动创建在 `data/trip_planner.db`。

### 配置高德地图

1. 在 [高德开放平台](https://lbs.amap.com/) 申请 API Key
2. 修改 `nuxt.config.ts` 中的 `YOUR_AMAP_KEY`

```typescript
script: [
  {
    src: "https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY",
    defer: true,
  },
],
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

## 📱 功能特性

### 首页

- 顶部 Tab 切换：全部/进行中/即将出发/已完成
- 右下角悬浮新建按钮
- 卡片左滑操作：编辑/删除
- 搜索功能
- 骨架屏加载

### 新建线路

- 三步向导流程
- 标题封面设置
- 往返日期选择
- 自动生成空白天数
- 图片压缩上传

### 线路详情

- 顶部双切换：行程/地图
- 行程页：纵向时间线布局
- 地图页：标记点 + 弧线连接
- 信息窗口：导航/编辑/删除
- 实时状态更新

### 本地存储

- IndexedDB 数据库存储
- 数据本地持久化
- 支持离线数据访问

## 🎨 设计规范

### 主色调

- 主色：`#0ABFC5`
- 辅助色：`#FF6B6B`
- 成功色：`#4CAF50`
- 警告色：`#FF9800`
- 错误色：`#F44336`

### 间距系统

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### 圆角规范

- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px

## 📁 项目结构

```
├── assets/scss/          # 样式文件
│   ├── variables.scss    # SCSS 变量
│   └── main.scss         # 主样式
├── components/           # 组件
│   ├── TripCard.vue      # 行程卡片
│   └── FileUpload.vue    # 文件上传
├── composables/          # 组合式函数
│   ├── useAnimation.ts   # 动画工具
│   ├── useFileUpload.ts  # 文件上传
│   ├── useOffline.ts     # 离线功能
│   └── useTheme.ts       # 主题管理
├── database/             # 数据库
│   └── index.ts          # Dexie 配置
├── pages/                # 页面
│   ├── index.vue         # 首页
│   ├── trip/
│   │   ├── create.vue    # 新建线路
│   │   └── [id].vue      # 线路详情
├── plugins/              # 插件
│   ├── amap.client.ts    # 高德地图
│   └── pwa.client.ts     # PWA 支持
├── stores/               # 状态管理
│   └── trip.ts           # 行程状态
├── types/                # 类型定义
│   └── index.ts          # 全局类型
└── public/               # 静态资源
    ├── manifest.json     # PWA 配置
    └── sw.js            # Service Worker
```

## 🔧 开发指南

### 添加新页面

1. 在 `pages/` 目录下创建 Vue 文件
2. 使用 `<script setup>` 语法
3. 通过 `useHead()` 设置页面元信息

### 添加新组件

1. 在 `components/` 目录下创建 Vue 文件
2. 使用 TypeScript 定义 Props 和 Emits
3. 遵循组合式 API 规范

### 状态管理

1. 使用 Pinia 创建 store
2. 通过 `defineStore` 定义状态和动作
3. 使用 `storeToRefs` 解构响应式状态

### 样式规范

1. 使用 SCSS 变量定义颜色和间距
2. 支持暗黑模式自动切换
3. 遵循移动端优先的响应式设计

## 📦 部署

### 静态部署

```bash
npm run generate
```

生成的文件在 `dist/` 目录，可部署到任何静态托管服务。

### 静态部署

项目可以部署到任何支持静态文件的服务器。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
