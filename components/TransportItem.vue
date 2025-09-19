<template>
  <div class="transport-item" :class="`transport-${item.type}`">
    <div class="transport-icon">
      <Icon :name="getTransportIcon(item.type)" size="20" />
    </div>

    <div class="transport-content">
      <div class="transport-header">
        <div class="transport-time">{{ item.time }}</div>
        <div class="transport-title">{{ getTransportTitle() }}</div>
      </div>

      <div class="transport-details">
        <div v-if="item.from || item.to" class="transport-route">
          <span v-if="item.from" class="from">{{ item.from }}</span>
          <Icon
            v-if="item.from && item.to"
            name="carbon:arrow-right"
            size="12"
            class="arrow"
          />
          <span v-if="item.to" class="to">{{ item.to }}</span>
        </div>

        <div v-if="getTransportNumber()" class="transport-number">
          {{ getTransportNumber() }}
        </div>

        <div v-if="item.address" class="transport-address">
          <Icon name="carbon:location" size="12" />
          {{ item.address }}
        </div>
        
        <!-- 坐标信息 -->
        <div v-if="item.coordinates" class="transport-coordinates">
          <div v-if="item.coordinates.from" class="coordinate-item">
            <Icon name="carbon:location-filled" size="12" class="coordinate-icon from" />
            <span class="coordinate-label">出发地:</span>
            <span class="coordinate-value">{{ formatCoordinates(item.coordinates.from) }}</span>
          </div>
          <div v-if="item.coordinates.to" class="coordinate-item">
            <Icon name="carbon:location-filled" size="12" class="coordinate-icon to" />
            <span class="coordinate-label">到达地:</span>
            <span class="coordinate-value">{{ formatCoordinates(item.coordinates.to) }}</span>
          </div>
        </div>
      </div>

      <div v-if="item.note?.text" class="transport-note">
        {{ item.note.text }}
      </div>
    </div>

    <div class="transport-actions">
      <button class="action-btn" @click="$emit('edit', item)">
        <Icon name="carbon:edit" size="14" />
      </button>
      <button class="action-btn danger" @click="$emit('delete', item)">
        <Icon name="carbon:trash-can" size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item, ItemType } from "~/types";

interface Props {
  item: Item;
}

const props = defineProps<Props>();

defineEmits<{
  edit: [item: Item];
  delete: [item: Item];
}>();

// 获取交通图标
const getTransportIcon = (type: ItemType): string => {
  const iconMap: Record<ItemType, string> = {
    flight: "carbon:airplane",
    train: "carbon:train",
    bus: "carbon:bus",
    hotel: "carbon:hotel",
    spot: "carbon:location",
    other: "carbon:car",
  };
  return iconMap[type] || "carbon:car";
};

// 获取交通标题
const getTransportTitle = (): string => {
  switch (props.item.type) {
    case "flight":
      return `航班 ${props.item.flightNo || ""}`;
    case "train":
      return `火车 ${props.item.trainNo || ""}`;
    case "bus":
      return `巴士 ${props.item.busNo || ""}`;
    case "hotel":
      return "酒店";
    case "spot":
      return "景点";
    default:
      return "其他交通";
  }
};

// 获取交通班次号
const getTransportNumber = (): string => {
  switch (props.item.type) {
    case "flight":
      return props.item.flightNo || "";
    case "train":
      return props.item.trainNo || "";
    case "bus":
      return props.item.busNo || "";
    default:
      return "";
  }
};

// 格式化坐标显示
const formatCoordinates = (coords: { lat: number; lng: number }): string => {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
};
</script>

<style scoped lang="scss">
.transport-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-sm;
  transition: all $transition-normal;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-1px);
  }
}

.transport-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.transport-flight .transport-icon {
  background: rgba(74, 144, 226, 0.1);
  color: #4a90e2;
}

.transport-train .transport-icon {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.transport-bus .transport-icon {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.transport-hotel .transport-icon {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.transport-spot .transport-icon {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.transport-other .transport-icon {
  background: rgba(96, 125, 139, 0.1);
  color: #607d8b;
}

.transport-content {
  flex: 1;
  min-width: 0;
}

.transport-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
}

.transport-time {
  font-size: 12px;
  font-weight: 500;
  color: $primary-color;
  background: rgba($primary-color, 0.1);
  padding: 2px 6px;
  border-radius: $radius-sm;
}

.transport-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.transport-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.transport-route {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 13px;
  color: $text-secondary;

  .from {
    font-weight: 500;
  }

  .arrow {
    color: $text-disabled;
  }

  .to {
    font-weight: 500;
  }
}

.transport-number {
  font-size: 12px;
  color: $text-secondary;
  font-family: monospace;
}

  .transport-address {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: $text-secondary;
  }

  .transport-coordinates {
    margin-top: 4px;
    
    .coordinate-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: $text-disabled;
      margin-bottom: 2px;
      
      .coordinate-icon {
        &.from {
          color: #4CAF50;
        }
        
        &.to {
          color: #FF9800;
        }
      }
      
      .coordinate-label {
        font-weight: 500;
        min-width: 40px;
      }
      
      .coordinate-value {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.05);
        padding: 1px 4px;
        border-radius: 2px;
      }
    }
  }

.transport-note {
  margin-top: $spacing-xs;
  padding: $spacing-xs;
  background: #f8f9fa;
  border-radius: $radius-sm;
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.4;
}

.transport-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  flex-shrink: 0;
}

.action-btn {
  @include button-circle;
  width: 28px;
  height: 28px;
  background: transparent;
  color: $text-secondary;
  padding: 0;
  min-height: 28px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.danger {
    color: $error-color;

    &:hover {
      background: rgba($error-color, 0.1);
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .transport-item {
    background: $dark-background;
  }

  .transport-title {
    color: $dark-text-primary;
  }

  .transport-route {
    color: $dark-text-secondary;
  }

  .transport-number {
    color: $dark-text-secondary;
  }

  .transport-address {
    color: $dark-text-secondary;
  }

  .transport-note {
    background: rgba(255, 255, 255, 0.05);
    color: $dark-text-secondary;
  }
}
</style>
