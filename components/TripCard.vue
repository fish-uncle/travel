<template>
  <div
    class="trip-card ripple"
    @click="handleCardClick"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    :style="{ transform: `translateX(${translateX}px)` }"
  >
    <div class="card-image">
      <img
        v-if="trip.cover"
        :src="trip.cover"
        :alt="trip.title"
        class="cover-image"
      />
      <div v-else class="cover-placeholder">
        <Icon name="carbon:location" size="32" />
      </div>
      <div class="card-overlay">
        <div class="card-actions">
          <button class="action-btn" @click.stop="$emit('edit', trip)">
            <Icon name="carbon:edit" size="16" />
          </button>
          <button class="action-btn danger" @click.stop="$emit('delete', trip)">
            <Icon name="carbon:trash-can" size="16" />
          </button>
        </div>
      </div>

      <!-- 左滑操作按钮 -->
      <div class="swipe-actions" :class="{ visible: showSwipeActions }">
        <button class="swipe-btn edit-btn" @click="handleEdit">
          <Icon name="carbon:edit" size="20" />
          <span>编辑</span>
        </button>
        <button class="swipe-btn delete-btn" @click="handleDelete">
          <Icon name="carbon:trash-can" size="20" />
          <span>删除</span>
        </button>
      </div>
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ trip.title }}</h3>
      <div class="card-meta">
        <div class="date-range">
          <Icon name="carbon:calendar" size="14" />
          <span>{{ formatDateRange(trip.startAt, trip.endAt) }}</span>
        </div>
        <div class="day-count">
          <Icon name="carbon:time" size="14" />
          <span>{{ getDayCount(trip.startAt, trip.endAt) }}天</span>
        </div>
      </div>
      <div class="card-status">
        <span :class="['status-badge', getStatusClass(trip)]">
          {{ getStatusText(trip) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import type { Trip } from "~/types";

interface Props {
  trip: Trip;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [trip: Trip];
  edit: [trip: Trip];
  delete: [trip: Trip];
}>();

// 触摸相关状态
const translateX = ref(0);
const startX = ref(0);
const currentX = ref(0);
const isDragging = ref(false);
const showSwipeActions = ref(false);

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX;
  currentX.value = startX.value;
  isDragging.value = true;
};

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;

  currentX.value = e.touches[0].clientX;
  const deltaX = currentX.value - startX.value;

  // 只允许向左滑动
  if (deltaX < 0) {
    translateX.value = Math.max(deltaX, -120); // 限制最大滑动距离
  }
};

// 触摸结束
const handleTouchEnd = () => {
  if (!isDragging.value) return;

  isDragging.value = false;
  const deltaX = currentX.value - startX.value;

  // 如果滑动距离超过阈值，显示操作按钮
  if (deltaX < -60) {
    translateX.value = -120;
    showSwipeActions.value = true;
  } else {
    // 否则回弹
    translateX.value = 0;
    showSwipeActions.value = false;
  }
};

// 卡片点击
const handleCardClick = () => {
  if (showSwipeActions.value) {
    // 如果正在显示操作按钮，先隐藏
    translateX.value = 0;
    showSwipeActions.value = false;
  } else {
    emit("click", props.trip);
  }
};

// 编辑操作
const handleEdit = () => {
  translateX.value = 0;
  showSwipeActions.value = false;
  emit("edit", props.trip);
};

// 删除操作
const handleDelete = () => {
  translateX.value = 0;
  showSwipeActions.value = false;
  emit("delete", props.trip);
};

// 格式化日期范围
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

// 计算天数
const getDayCount = (startAt: string, endAt: string): number => {
  const start = dayjs(startAt);
  const end = dayjs(endAt);
  return end.diff(start, "day") + 1;
};

// 获取状态文本
const getStatusText = (trip: Trip): string => {
  const now = dayjs();
  const start = dayjs(trip.startAt);
  const end = dayjs(trip.endAt);

  if (now.isBefore(start)) {
    return "即将出发";
  } else if (now.isAfter(end)) {
    return "已完成";
  } else {
    return "进行中";
  }
};

// 获取状态样式类
const getStatusClass = (trip: Trip): string => {
  const now = dayjs();
  const start = dayjs(trip.startAt);
  const end = dayjs(trip.endAt);

  if (now.isBefore(start)) {
    return "upcoming";
  } else if (now.isAfter(end)) {
    return "completed";
  } else {
    return "ongoing";
  }
};
</script>

<style scoped lang="scss">
.trip-card {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all $transition-normal;
  position: relative;
  touch-action: pan-y;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);

    .card-overlay {
      opacity: 1;
    }
  }
}

.card-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-light, $primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-normal;
}

.card-actions {
  display: flex;
  gap: $spacing-sm;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: $text-primary;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  &.danger {
    color: $error-color;

    &:hover {
      background: $error-color;
      color: white;
    }
  }
}

.card-content {
  padding: $spacing-md;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;
}

.date-range,
.day-count {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 14px;
  color: $text-secondary;
}

.card-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 4px 8px;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 500;

  &.upcoming {
    background: rgba($warning-color, 0.1);
    color: $warning-color;
  }

  &.ongoing {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }

  &.completed {
    background: rgba($success-color, 0.1);
    color: $success-color;
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .trip-card {
    background: $dark-background;
  }

  .card-title {
    color: $dark-text-primary;
  }

  .date-range,
  .day-count {
    color: $dark-text-secondary;
  }
}

// 左滑操作按钮样式
.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
  z-index: 1;

  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
}

.swipe-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  border: none;
  background: transparent;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    margin-top: 4px;
    font-size: 10px;
  }
}

.edit-btn {
  background: $primary-color;
}

.delete-btn {
  background: #ff4757;
}
</style>
