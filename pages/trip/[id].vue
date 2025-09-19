<template>
  <div class="trip-detail">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="back-btn" @click="goBack">
        <Icon name="carbon:arrow-left" size="20" />
      </button>
      <h1 class="title">{{ trip?.title || "线路详情" }}</h1>
      <button class="menu-btn" @click="showMenu = !showMenu">
        <Icon name="carbon:overflow-menu-horizontal" size="20" />
      </button>
    </header>

    <!-- 封面图片 -->
    <div v-if="trip?.cover" class="cover-section">
      <img :src="trip.cover" :alt="trip.title" class="cover-image" />
      <div class="cover-overlay">
        <div class="trip-info">
          <h2 class="trip-title">{{ trip.title }}</h2>
          <div class="trip-meta">
            <div class="date-range">
              <Icon name="carbon:calendar" size="14" />
              <span>{{ formatDateRange(trip.startAt, trip.endAt) }}</span>
            </div>
            <div class="day-count">
              <Icon name="carbon:time" size="14" />
              <span>{{ getDayCount(trip.startAt, trip.endAt) }}天</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 切换标签 -->
    <div class="tab-switcher">
      <button
        :class="['tab-btn', { active: activeTab === 'timeline' }]"
        @click="activeTab = 'timeline'"
      >
        <Icon name="carbon:list" size="16" />
        <span>行程</span>
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'map' }]"
        @click="activeTab = 'map'"
      >
        <Icon name="carbon:location" size="16" />
        <span>地图</span>
      </button>
    </div>

    <!-- 内容区域 -->
    <main class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="skeleton-timeline" v-for="i in 3" :key="i">
          <div class="skeleton-day"></div>
          <div class="skeleton-items">
            <div class="skeleton-item" v-for="j in 2" :key="j"></div>
          </div>
        </div>
      </div>

      <!-- 行程时间线 -->
      <div v-else-if="activeTab === 'timeline'" class="timeline">
        <div
          v-for="(day, index) in trip?.days"
          :key="day.date"
          class="timeline-day"
        >
          <div class="day-header">
            <div class="day-number">{{ index + 1 }}</div>
            <div class="day-info">
              <div class="day-date">{{ formatDayDate(day.date) }}</div>
              <div class="day-week">{{ getWeekDay(day.date) }}</div>
            </div>
            <button
              class="add-item-btn"
              @click="openAddTransportModal(day.date)"
            >
              <Icon name="carbon:add" size="16" />
            </button>
          </div>

          <div class="day-items">
            <TransportItem
              v-for="item in day.items"
              :key="item.id"
              :item="item"
              @edit="editItem"
              @delete="deleteItem"
            />

            <div v-if="day.items.length === 0" class="empty-day">
              <Icon name="carbon:add-alt" size="24" />
              <span>点击添加行程</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 地图视图 -->
      <div v-else-if="activeTab === 'map'" class="map-container">
        <TripMap
          :trip="trip"
          :selected-item="selectedItem"
          @item-click="handleItemClick"
        />
      </div>
    </main>

    <!-- 操作菜单 -->
    <div v-if="showMenu" class="menu-overlay" @click="showMenu = false">
      <div class="menu" @click.stop>
        <button class="menu-item" @click="editTrip">
          <Icon name="carbon:edit" size="16" />
          <span>编辑线路</span>
        </button>
        <button class="menu-item" @click="shareTrip">
          <Icon name="carbon:share" size="16" />
          <span>分享线路</span>
        </button>
        <button class="menu-item danger" @click="deleteTrip">
          <Icon name="carbon:trash-can" size="16" />
          <span>删除线路</span>
        </button>
      </div>
    </div>

    <!-- 交通添加模态框 -->
    <AddTransportModal
      :show="showAddTransportModal"
      :day-date="selectedDayDate"
      @close="closeAddTransportModal"
      @add="handleAddTransport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTripStore } from "~/stores/trip";
import dayjs from "dayjs";
import type { Trip, Item, ItemType } from "~/types";

// 路由参数
const route = useRoute();
const tripId = route.params.id as string;

// 确保 crypto 可用
const crypto = globalThis.crypto || window.crypto;

// 状态管理
const tripStore = useTripStore();
const { currentTrip, loading } = storeToRefs(tripStore);

// 计算属性
const trip = computed(() => currentTrip.value);
const isDev = computed(() => import.meta.env.DEV);

// 页面元信息
useHead({
  title: computed(() => trip.value?.title || "线路详情"),
});

// 本地状态
const activeTab = ref<"timeline" | "map">("timeline");
const showMenu = ref(false);
const selectedItem = ref<any>(null);
const showAddTransportModal = ref(false);
const selectedDayDate = ref("");

// 方法
const goBack = () => {
  navigateTo("/");
};

const formatDateRange = (startAt: string, endAt: string): string => {
  const start = dayjs(startAt);
  const end = dayjs(endAt);

  if (start.format("YYYY") === end.format("YYYY")) {
    if (start.format("MM") === end.format("MM")) {
      return `${start.format("MM月DD日")} - ${end.format("DD日")}`;
    } else {
      return `${start.format("MM月DD日")} - ${end.format("MM月DD日")}`;
    }
  } else {
    return `${start.format("YYYY年MM月DD日")} - ${end.format(
      "YYYY年MM月DD日"
    )}`;
  }
};

const getDayCount = (startAt: string, endAt: string): number => {
  const start = dayjs(startAt);
  const end = dayjs(endAt);
  return end.diff(start, "day") + 1;
};

const formatDayDate = (date: string): string => {
  return dayjs(date).format("MM月DD日");
};

const getWeekDay = (date: string): string => {
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekDays[dayjs(date).day()];
};

const getItemIcon = (type: ItemType): string => {
  const iconMap = {
    flight: "carbon:airplane",
    train: "carbon:train",
    bus: "carbon:bus",
    hotel: "carbon:hotel",
    spot: "carbon:location",
    other: "carbon:circle-dot",
  };
  return iconMap[type] || iconMap.other;
};

const getItemTitle = (item: Item): string => {
  switch (item.type) {
    case "flight":
      return `${item.flightNo || "航班"} ${item.from} → ${item.to}`;
    case "train":
      return `${item.trainNo || "火车"} ${item.from} → ${item.to}`;
    case "bus":
      return `巴士 ${item.from} → ${item.to}`;
    case "hotel":
      return `酒店 ${item.address}`;
    case "spot":
      return `景点 ${item.address}`;
    default:
      return item.address || "其他";
  }
};

// 处理项目点击
const handleItemClick = (item: any) => {
  selectedItem.value = item;
  console.log("选中项目:", item);
};

// 打开交通添加模态框
const openAddTransportModal = (dayDate: string) => {
  selectedDayDate.value = dayDate;
  showAddTransportModal.value = true;
};

// 关闭交通添加模态框
const closeAddTransportModal = () => {
  showAddTransportModal.value = false;
  selectedDayDate.value = "";
};

// 处理添加交通
const handleAddTransport = (item: any) => {
  if (!trip.value) return;

  const day = trip.value.days.find((d) => d.date === selectedDayDate.value);
  if (!day) return;

  day.items.push(item);

  // 更新行程
  tripStore.updateTrip(trip.value.id, { days: trip.value.days });

  console.log("添加交通项目:", item);
};

const addItem = (date: string) => {
  // 临时添加测试项目
  if (!trip.value) return;

  const testItems = [
    {
      id: crypto.randomUUID(),
      type: "flight" as ItemType,
      time: "09:00",
      flightNo: "CA1234",
      from: "北京",
      to: "上海",
      address: "首都机场T3",
    },
    {
      id: crypto.randomUUID(),
      type: "hotel" as ItemType,
      time: "14:00",
      address: "上海外滩华尔道夫酒店",
      lat: 121.4998,
      lng: 31.2397,
    },
    {
      id: crypto.randomUUID(),
      type: "spot" as ItemType,
      time: "16:00",
      address: "外滩观景台",
      lat: 121.4998,
      lng: 31.2397,
    },
  ];

  // 找到对应的日期并添加测试项目
  const day = trip.value.days.find((d) => d.date === date);
  if (day) {
    const randomItem = testItems[Math.floor(Math.random() * testItems.length)];
    day.items.push(randomItem);

    // 更新数据库
    tripStore.updateTrip(tripId, { days: trip.value.days });
  }

  console.log("添加行程项", date);
};

const editItem = (item: Item) => {
  // TODO: 打开编辑行程项弹窗
  console.log("编辑行程项", item);
};

const deleteItem = async (item: Item) => {
  if (confirm("确定要删除这个行程项吗？")) {
    if (!trip.value) return;

    // 找到包含该项目的日期
    const day = trip.value.days.find((d) =>
      d.items.some((i) => i.id === item.id)
    );
    if (day) {
      const index = day.items.findIndex((i) => i.id === item.id);
      if (index > -1) {
        day.items.splice(index, 1);
        // 更新行程
        tripStore.updateTrip(trip.value);
        console.log("删除行程项", item);
      }
    }
  }
};

const editTrip = () => {
  navigateTo(`/trip/${tripId}/edit`);
  showMenu.value = false;
};

const shareTrip = () => {
  // TODO: 实现分享功能
  console.log("分享线路");
  showMenu.value = false;
};

const deleteTrip = async () => {
  if (confirm("确定要删除这条线路吗？")) {
    await tripStore.deleteTrip(tripId);
    navigateTo("/");
  }
  showMenu.value = false;
};

const initMap = async () => {
  if (!mapContainer.value) return;

  // 等待高德地图API加载
  await new Promise((resolve) => {
    if (window.AMap) {
      resolve(true);
    } else {
      const checkAMap = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkAMap);
          resolve(true);
        }
      }, 100);
    }
  });

  // 创建地图实例
  mapInstance.value = new window.AMap.Map("amap-container", {
    zoom: 10,
    center: [116.397428, 39.90923], // 北京
    mapStyle: "amap://styles/dark", // 暗黑主题
  });

  // 添加标记点
  addMapMarkers();
};

const addMapMarkers = () => {
  if (!mapInstance.value || !trip.value) return;

  const markers: any[] = [];

  trip.value.days.forEach((day) => {
    day.items.forEach((item) => {
      if (item.lat && item.lng) {
        const marker = new window.AMap.Marker({
          position: [item.lng, item.lat],
          title: getItemTitle(item),
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(32, 32),
            image: getMarkerIcon(item.type),
            imageSize: new window.AMap.Size(32, 32),
          }),
        });

        // 添加信息窗口
        const infoWindow = new window.AMap.InfoWindow({
          content: createInfoWindowContent(item),
          offset: new window.AMap.Pixel(0, -30),
        });

        marker.on("click", () => {
          infoWindow.open(mapInstance.value, marker.getPosition());
        });

        markers.push(marker);
      }
    });
  });

  // 添加标记到地图
  mapInstance.value.add(markers);

  // 如果有标记点，调整地图视野
  if (markers.length > 0) {
    mapInstance.value.setFitView(markers);
  }
};

const getMarkerIcon = (type: ItemType): string => {
  // 返回不同类型的标记图标URL
  const iconMap = {
    flight:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMjAgMTBIMjZMMjIgMTRIMjZMMjAgMjBIMTZMMTIgMTRIMTZMMTYgMloiIGZpbGw9IiMwQUJGQzUiLz4KPC9zdmc+",
    train:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTBIMjhWMjJINFYxMFoiIGZpbGw9IiMwQUJGQzUiLz4KPC9zdmc+",
    hotel:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMjYgMTJWMTBIMjBWNkgxMlYxMEg2VjEyTDE2IDJaIiBmaWxsPSIjMEFCRkM1Ii8+Cjwvc3ZnPg==",
    spot: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMwQUJGQzUiLz4KPC9zdmc+",
    other:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iIzBBQkZDNSIvPgo8L3N2Zz4=",
  };
  return iconMap[type] || iconMap.other;
};

const createInfoWindowContent = (item: Item): string => {
  return `
    <div style="padding: 8px; min-width: 120px;">
      <div style="font-weight: 500; margin-bottom: 4px;">${getItemTitle(
        item
      )}</div>
      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${
        item.time || "全天"
      }</div>
      <div style="display: flex; gap: 4px;">
        <button onclick="navigateToItem('${
          item.id
        }')" style="padding: 4px 8px; background: #0ABFC5; color: white; border: none; border-radius: 4px; font-size: 12px;">导航</button>
        <button onclick="editItem('${
          item.id
        }')" style="padding: 4px 8px; background: #666; color: white; border: none; border-radius: 4px; font-size: 12px;">编辑</button>
      </div>
    </div>
  `;
};

const centerMap = () => {
  if (mapInstance.value) {
    mapInstance.value.setZoomAndCenter(10, [116.397428, 39.90923]);
  }
};

// 监听标签切换
watch(activeTab, (newTab) => {
  if (newTab === "map") {
    nextTick(() => {
      initMap();
    });
  }
});

// 页面加载
onMounted(async () => {
  await tripStore.loadTrip(tripId);
});

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy();
  }
});
</script>

<style scoped lang="scss">
.trip-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background, #{$background});
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background: white;
  box-shadow: $shadow-sm;
  min-height: 56px;
  z-index: 10;
}

.back-btn,
.menu-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: $text-secondary;
  border-radius: $radius-md;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
  text-align: center;
  margin: 0 $spacing-md;
}

.cover-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: $spacing-lg $spacing-md $spacing-md;
  color: white;
}

.trip-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: $spacing-sm;
}

.trip-meta {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.date-range,
.day-count {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 14px;
  opacity: 0.9;
}

.tab-switcher {
  display: flex;
  background: white;
  border-bottom: 1px solid $divider;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  border: none;
  background: transparent;
  color: $text-secondary;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;
  border-bottom: 2px solid transparent;

  &.active {
    color: $primary-color;
    border-bottom-color: $primary-color;
  }

  &:hover {
    color: $primary-color;
  }
}

.content {
  flex: 1;
  overflow-y: auto;
}

.loading-container {
  padding: $spacing-md;
}

.skeleton-timeline {
  margin-bottom: $spacing-lg;
}

.skeleton-day {
  height: 40px;
  background: $divider;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
}

.skeleton-items {
  padding-left: $spacing-lg;
}

.skeleton-item {
  height: 60px;
  background: $divider;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
}

.timeline {
  padding: $spacing-md;
}

.timeline-day {
  margin-bottom: $spacing-xl;
}

.day-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.day-number {
  width: 32px;
  height: 32px;
  background: $primary-color;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.day-info {
  flex: 1;
}

.day-date {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.day-week {
  font-size: 14px;
  color: $text-secondary;
}

.add-item-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: $primary-color;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: $primary-dark;
    transform: scale(1.1);
  }
}

.day-items {
  padding-left: $spacing-lg;
  border-left: 2px solid $divider;
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-md;
  padding-left: $spacing-lg;

  &::before {
    content: "";
    position: absolute;
    left: -6px;
    top: 8px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $primary-color;
  }
}

.item-time {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  background: white;
  padding: $spacing-md;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
}

.item-icon {
  width: 32px;
  height: 32px;
  background: rgba($primary-color, 0.1);
  color: $primary-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.debug-icon {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  z-index: 10;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.item-address {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.item-note {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.4;
}

.item-actions {
  display: flex;
  gap: $spacing-xs;
  flex-shrink: 0;
}

.action-btn {
  @include button-base;
  width: 28px;
  height: 28px;
  background: transparent;
  color: $text-secondary;
  border-radius: $radius-sm;
  padding: 0;
  min-height: 28px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.danger {
    color: $error-color;

    &:hover {
      background: rgba($error-color, 0.1);
    }
  }
}

.empty-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  color: $text-disabled;
  text-align: center;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $primary-color;
  }
}

.map-container {
  position: relative;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: $text-primary;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: $primary-color;
    color: white;
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.menu {
  width: 100%;
  background: white;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $spacing-md;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border: none;
  background: transparent;
  color: $text-primary;
  font-size: 16px;
  cursor: pointer;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.danger {
    color: $error-color;
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .header,
  .tab-switcher,
  .menu {
    background: $dark-background;
    border-color: $dark-divider;
  }

  .title,
  .day-date,
  .item-title {
    color: $dark-text-primary;
  }

  .day-week,
  .item-address,
  .item-note {
    color: $dark-text-secondary;
  }

  .item-content {
    background: $dark-background;
  }

  .control-btn {
    background: $dark-background;
    color: $dark-text-primary;
  }
}
</style>
