### 角色设定

你 =「移动端产品主设 + 携程交互研究师 + 高德 L5 开发者」三位一体，正在给 AI 下需求。  
输出必须可直接粘贴到 Cursor / Windsurf / v0.dev / Lovable，零改动即可生成「携程·我的线路」同款交互的 Nuxt3 H5 项目。

### 0. 交互对标

1. 完整复刻携程「我的线路」交互：
   - 首页：顶部 tab「全部/进行中/即将出发/已完成」+ 右下角「⊕ 新建线路」+ 卡片左滑「编辑/删除」。
   - 新建：三步向导（标题封面 → 往返日期 → 自动生成空白天数）。
   - 详情：顶部「行程·地图」双切换；行程页纵向时间线，地图页 marker+弧线，点击 info-window 出现「导航/编辑/删除」。
2. 拇指友好 ≥48 px，主色 #0ABFC5，暗黑自动切换，图标 unplugin-icons carbon 系。
3. 路由切换用 pageRef + opacity 模拟原生左滑；所有按钮 ripple mixin；骨架屏 lottie-web。

### 1. 技术锁死

- Nuxt3（SSR 关）+ Vue3 + Composition API + TypeScript + SCSS。
- 状态：SQLite3 + reactive，debounce 1 s 写库。
- 地图：amap-js（CDN manual chunk），暗黑底图自动切换。
- 文件：图片压缩 ≤1 MB、PDF ≤5 MB，统一转 base64 存 SQLite3。
- 虚拟滚动：vue-virtual-scroller。
- 日期：dayjs。
- 校验：vee-validate + yup。

### 2. 数据模型（自动导入）

```ts
export interface Trip {
  id: string;
  title: string;
  cover: string; // base64
  startAt: string; // YYYY-MM-DD
  endAt: string;
  days: Day[];
  createdAt: number;
  updatedAt: number;
  deletedAt?: number; // 软删
}

export interface Day {
  date: string;
  items: Item[];
}

export type ItemType = "flight" | "train" | "bus" | "hotel" | "spot" | "other";

export interface Item {
  id: string;
  type: ItemType;
  time?: string; // HH:mm
  flightNo?: string;
  trainNo?: string;
  from?: string; // 城市
  to?: string; // 城市
  address?: string; // 酒店/景点地址
  lat?: number;
  lng?: number;
  note?: Note;
}

export interface Note {
  text?: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  type: "pdf" | "image";
  data: string; // base64
  name: string;
}
```

### 3. 当前实现状态

#### ✅ 已完成功能

- **基础架构**: Nuxt3 + Vue3 + TypeScript + SCSS
- **数据库**: SQLite3 本地存储，自动创建表结构
- **状态管理**: Pinia + 响应式数据
- **路由系统**: 页面路由和动态路由
- **UI 组件**: 基础组件和布局
- **表单验证**: VeeValidate + Yup 集成
- **日期处理**: Day.js 集成
- **图标系统**: unplugin-icons + Carbon 图标
- **动画系统**: Lottie Web 集成

#### ✅ 新增完成功能

- **卡片左滑**: 编辑/删除手势交互
- **按钮涟漪**: 点击反馈效果
- **页面切换**: 原生左滑动画
- **文件上传**: 图片压缩和 Base64 存储
- **虚拟滚动**: 大数据量优化
- **地图集成**: 高德地图 + 暗黑模式

#### 📋 待实现功能

- **搜索功能**: 行程搜索和筛选
- **分享功能**: 行程分享和导出
- **推送通知**: 行程提醒功能
- **数据同步**: 云端数据同步
