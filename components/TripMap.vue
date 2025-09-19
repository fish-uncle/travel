<template>
  <div class="trip-map">
    <div ref="mapContainer" class="map-container"></div>

    <!-- 地图控制按钮 -->
    <div class="map-controls">
      <button
        class="control-btn"
        @click="toggleMapType"
        :title="isDarkMap ? '切换到亮色地图' : '切换到暗色地图'"
      >
        <Icon :name="isDarkMap ? 'carbon:sun' : 'carbon:moon'" size="20" />
      </button>

      <button class="control-btn" @click="centerMap" title="回到中心">
        <Icon name="carbon:location" size="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { Trip, Item } from "~/types";

interface Props {
  trip: Trip;
  selectedItem?: Item | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  itemClick: [item: Item];
}>();

const mapContainer = ref<HTMLDivElement>();
let map: any = null;
let markers: any[] = [];
let polylines: any[] = [];
const isDarkMap = ref(false);

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value) return;

  // 等待 AMap 加载
  await waitForAMap();

  // 创建地图实例
  map = new (window as any).AMap.Map(mapContainer.value, {
    zoom: 10,
    center: [116.397428, 39.90923], // 北京
    mapStyle: isDarkMap.value ? "amap://styles/dark" : "amap://styles/normal",
    features: ["bg", "road", "building"],
    viewMode: "3D",
    resizeEnable: true,
  });

  // 添加地图控件
  map.addControl(new (window as any).AMap.Scale());
  map.addControl(new (window as any).AMap.ToolBar());

  // 渲染行程点
  renderTripItems();
};

// 等待 AMap 加载
const waitForAMap = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).AMap) {
      resolve();
    } else {
      const checkAMap = () => {
        if ((window as any).AMap) {
          resolve();
        } else {
          setTimeout(checkAMap, 100);
        }
      };
      checkAMap();
    }
  });
};

// 渲染行程点
const renderTripItems = () => {
  if (!map) return;

  // 清除现有标记
  clearMarkers();

  const allItems: Item[] = [];
  props.trip.days.forEach((day) => {
    allItems.push(...day.items);
  });

  if (allItems.length === 0) return;

  // 创建标记
  allItems.forEach((item, index) => {
    // 处理单个坐标点
    if (item.lat && item.lng) {
      const marker = new (window as any).AMap.Marker({
        position: [item.lng, item.lat],
        title: item.address || item.from || item.to || "未知位置",
        icon: new (window as any).AMap.Icon({
          size: new (window as any).AMap.Size(32, 32),
          image: getMarkerIcon(item.type),
          imageSize: new (window as any).AMap.Size(32, 32),
        }),
      });

      // 创建信息窗口
      const infoWindow = new (window as any).AMap.InfoWindow({
        content: createInfoWindowContent(item),
        offset: new (window as any).AMap.Pixel(0, -30),
      });

      // 点击标记显示信息窗口
      marker.on("click", () => {
        infoWindow.open(map, marker.getPosition());
        emit("itemClick", item);
      });

      map.add(marker);
      markers.push(marker);
    }

    // 处理坐标对（出发地和到达地）
    if (item.coordinates) {
      // 出发地标记
      if (item.coordinates.from) {
        const fromMarker = new (window as any).AMap.Marker({
          position: [item.coordinates.from.lng, item.coordinates.from.lat],
          title: `${item.from || "出发地"} - ${item.address || ""}`,
          icon: new (window as any).AMap.Icon({
            size: new (window as any).AMap.Size(28, 28),
            image: getMarkerIcon("from"),
            imageSize: new (window as any).AMap.Size(28, 28),
          }),
        });

        const fromInfoWindow = new (window as any).AMap.InfoWindow({
          content: createCoordinateInfoWindow(item, "from"),
          offset: new (window as any).AMap.Pixel(0, -30),
        });

        fromMarker.on("click", () => {
          fromInfoWindow.open(map, fromMarker.getPosition());
          emit("itemClick", item);
        });

        map.add(fromMarker);
        markers.push(fromMarker);
      }

      // 到达地标记
      if (item.coordinates.to) {
        const toMarker = new (window as any).AMap.Marker({
          position: [item.coordinates.to.lng, item.coordinates.to.lat],
          title: `${item.to || "到达地"} - ${item.address || ""}`,
          icon: new (window as any).AMap.Icon({
            size: new (window as any).AMap.Size(28, 28),
            image: getMarkerIcon("to"),
            imageSize: new (window as any).AMap.Size(28, 28),
          }),
        });

        const toInfoWindow = new (window as any).AMap.InfoWindow({
          content: createCoordinateInfoWindow(item, "to"),
          offset: new (window as any).AMap.Pixel(0, -30),
        });

        toMarker.on("click", () => {
          toInfoWindow.open(map, toMarker.getPosition());
          emit("itemClick", item);
        });

        map.add(toMarker);
        markers.push(toMarker);
      }
    }
  });

  // 创建路径线
  createPolylines(allItems);

  // 调整地图视野
  if (markers.length > 0) {
    map.setFitView(markers);
  }
};

// 创建路径线
const createPolylines = (items: Item[]) => {
  const validItems = items.filter((item) => item.lat && item.lng);

  if (validItems.length < 2) return;

  // 按时间排序
  const sortedItems = validItems.sort((a, b) => {
    const timeA = a.time ? a.time : "00:00";
    const timeB = b.time ? b.time : "00:00";
    return timeA.localeCompare(timeB);
  });

  // 创建路径点
  const path = sortedItems.map((item) => [item.lng!, item.lat!]);

  // 创建路径线
  const polyline = new (window as any).AMap.Polyline({
    path: path,
    strokeColor: "#0ABFC5",
    strokeWeight: 4,
    strokeOpacity: 0.8,
    strokeStyle: "solid",
  });

  map.add(polyline);
  polylines.push(polyline);
};

// 创建信息窗口内容
const createInfoWindowContent = (item: Item): string => {
  const time = item.time ? `<div class="info-time">${item.time}</div>` : "";
  const title = item.address || item.from || item.to || "未知位置";
  const type = getItemTypeText(item.type);

  return `
    <div class="info-window">
      ${time}
      <div class="info-title">${title}</div>
      <div class="info-type">${type}</div>
      <div class="info-actions">
        <button onclick="navigateToItem('${item.id}')" class="action-btn">
          <i class="icon">🧭</i> 导航
        </button>
        <button onclick="editItem('${item.id}')" class="action-btn">
          <i class="icon">✏️</i> 编辑
        </button>
        <button onclick="deleteItem('${item.id}')" class="action-btn danger">
          <i class="icon">🗑️</i> 删除
        </button>
      </div>
    </div>
  `;
};

// 获取标记图标
const getMarkerIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    flight:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMjAgOEwyOCA2TDI0IDEyTDI4IDE4TDIwIDE2TDE2IDIyTDEyIDE2TDQgMThMOCAxMkw0IDZMMTIgOEwxNiAyWiIgZmlsbD0iIzBBQkZDNCIvPgo8L3N2Zz4K",
    train:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTJIMjhWMjBINFYxMloiIGZpbGw9IiMwQUJGQzQiLz4KPHBhdGggZD0iTTYgMTRIMjZWMThINlYxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    bus: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTBIMjhWMjJINFYxMFoiIGZpbGw9IiMwQUJGQzQiLz4KPHBhdGggZD0iTTYgMTJIMjZWMjBINlYxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    hotel:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTBIMjhWMjJINFYxMFoiIGZpbGw9IiMwQUJGQzQiLz4KPHBhdGggZD0iTTYgMTJIMjZWMjBINlYxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    spot: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMwQUJGQzQiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
    other:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMjAgOEwyOCA2TDI0IDEyTDI4IDE4TDIwIDE2TDE2IDIyTDEyIDE2TDQgMThMOCAxMkw0IDZMMTIgOEwxNiAyWiIgZmlsbD0iIzBBQkZDNCIvPgo8L3N2Zz4K",
  };
  return iconMap[type] || iconMap.other;
};

// 获取项目类型文本
const getItemTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    flight: "航班",
    train: "火车",
    bus: "巴士",
    hotel: "酒店",
    spot: "景点",
    other: "其他",
  };
  return typeMap[type] || "其他";
};

// 清除标记
const clearMarkers = () => {
  markers.forEach((marker) => map.remove(marker));
  markers = [];

  polylines.forEach((polyline) => map.remove(polyline));
  polylines = [];
};

// 切换地图类型
const toggleMapType = () => {
  isDarkMap.value = !isDarkMap.value;
  if (map) {
    map.setMapStyle(
      isDarkMap.value ? "amap://styles/dark" : "amap://styles/normal"
    );
  }
};

// 回到中心
const centerMap = () => {
  if (map && markers.length > 0) {
    map.setFitView(markers);
  }
};

// 监听行程变化
watch(
  () => props.trip,
  () => {
    if (map) {
      renderTripItems();
    }
  },
  { deep: true }
);

// 监听选中项目变化
watch(
  () => props.selectedItem,
  (newItem) => {
    if (map && newItem && newItem.lat && newItem.lng) {
      map.setCenter([newItem.lng, newItem.lat]);
      map.setZoom(15);
    }
  }
);

onMounted(async () => {
  await nextTick();
  await initMap();
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});

// 暴露方法给全局使用
if (typeof window !== "undefined") {
  (window as any).navigateToItem = (itemId: string) => {
    console.log("导航到项目:", itemId);
  };

  (window as any).editItem = (itemId: string) => {
    console.log("编辑项目:", itemId);
  };

  (window as any).deleteItem = (itemId: string) => {
    console.log("删除项目:", itemId);
  };
}
</script>

<style scoped lang="scss">
.trip-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
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
  z-index: 1000;
}

.control-btn {
  @include button-circle;
  width: 40px;
  height: 40px;
  background: white;
  color: $text-primary;
  box-shadow: $shadow-md;

  &:hover {
    background: #f8f9fa;
    transform: scale(1.05);
  }
}

// 信息窗口样式
:global(.info-window) {
  padding: $spacing-sm;
  min-width: 200px;

  .info-time {
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
  }

  .info-title {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  .info-type {
    font-size: 12px;
    color: $primary-color;
    margin-bottom: $spacing-sm;
  }

  .info-actions {
    display: flex;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: $spacing-xs $spacing-sm;
    border: none;
    border-radius: $radius-sm;
    background: $primary-color;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: color.adjust($primary-color, $lightness: -10%);
    }

    &.danger {
      background: #ff4757;

      &:hover {
        background: color.adjust(#ff4757, $lightness: -10%);
      }
    }

    .icon {
      margin-right: 2px;
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .control-btn {
    background: $dark-background;
    color: $dark-text-primary;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
