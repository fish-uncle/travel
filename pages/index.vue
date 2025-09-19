<template>
  <div class="trip-home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <h1 class="title">我的线路</h1>
        <button 
          class="search-btn"
          @click="toggleSearch"
        >
          <Icon name="carbon:search" size="20" />
        </button>
      </div>
      
      <!-- 搜索框 -->
      <div v-if="showSearch" class="search-bar">
        <div class="search-input-wrapper">
          <Icon name="carbon:search" size="20" class="search-icon" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索线路..."
            class="search-input"
            @input="handleSearch"
          />
          <button 
            v-if="searchKeyword"
            class="clear-btn"
            @click="clearSearch"
          >
            <Icon name="carbon:close" size="16" />
          </button>
        </div>
      </div>
    </header>

    <!-- 标签页 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab', { active: currentTab === tab.key }]"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- 内容区域 -->
    <main class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <LottieLoader type="loading" size="64px" />
        <p class="loading-text">加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredTrips.length === 0" class="empty-state">
        <LottieLoader 
          :type="searchKeyword ? 'empty' : 'empty'" 
          size="80px" 
        />
        <h3 class="empty-title">暂无线路</h3>
        <p class="empty-desc">
          {{ searchKeyword ? '没有找到相关线路' : '创建你的第一条线路吧' }}
        </p>
        <button 
          v-if="!searchKeyword"
          class="btn btn-primary"
          @click="goToCreate"
        >
          创建线路
        </button>
      </div>

      <!-- 线路列表 -->
      <div v-else class="trip-list-container">
        <VirtualTripList
          :trips="filteredTrips"
          @trip-click="viewTrip"
          @trip-edit="editTrip"
          @trip-delete="deleteTrip"
        />
      </div>
    </main>

    <!-- 新建按钮 -->
    <button 
      class="fab ripple"
      @click="goToCreate"
    >
      <Icon name="carbon:add" size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTripStore } from '~/stores/trip'
import type { TripStatus } from '~/types'

// 页面元信息
useHead({
  title: '我的线路'
})

// 状态管理
const tripStore = useTripStore()
const { trips, loading, searchKeyword } = storeToRefs(tripStore)

// 计算属性
const filteredTrips = computed(() => {
  let result = trips.value

  // 按状态过滤
  if (currentTab.value !== 'all') {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    result = result.filter(trip => {
      switch (currentTab.value) {
        case 'ongoing':
          return trip.startAt <= today && trip.endAt >= today
        case 'upcoming':
          return trip.startAt > today
        case 'completed':
          return trip.endAt < today
        default:
          return true
      }
    })
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(trip => 
      trip.title.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 本地状态
const currentTab = ref<TripStatus>('all')
const showSearch = ref(false)

// 标签页配置
const tabs = computed(() => [
  { key: 'all', label: '全部', count: trips.value.length },
  { key: 'ongoing', label: '进行中', count: getTripCountByStatus('ongoing') },
  { key: 'upcoming', label: '即将出发', count: getTripCountByStatus('upcoming') },
  { key: 'completed', label: '已完成', count: getTripCountByStatus('completed') }
])

// 计算各状态下的行程数量
const getTripCountByStatus = (status: TripStatus): number => {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  return trips.value.filter(trip => {
    switch (status) {
      case 'ongoing':
        return trip.startAt <= today && trip.endAt >= today
      case 'upcoming':
        return trip.startAt > today
      case 'completed':
        return trip.endAt < today
      default:
        return true
    }
  }).length
}

// 切换标签页
const switchTab = (tab: TripStatus) => {
  currentTab.value = tab
  tripStore.setFilter({ status: tab })
}

// 切换搜索
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    clearSearch()
  }
}

// 处理搜索
const handleSearch = () => {
  tripStore.setSearchKeyword(searchKeyword.value)
  // 简单的客户端搜索
  const keyword = searchKeyword.value.toLowerCase()
  if (keyword) {
    // 这里可以实现简单的客户端搜索逻辑
    console.log('搜索关键词:', keyword)
  }
}

// 清除搜索
const clearSearch = () => {
  tripStore.clearSearch()
  showSearch.value = false
}

// 查看行程详情
const viewTrip = (trip: any) => {
  navigateTo(`/trip/${trip.id}`)
}

// 编辑行程
const editTrip = (trip: any) => {
  navigateTo(`/trip/${trip.id}/edit`)
}

// 删除行程
const deleteTrip = async (trip: any) => {
  if (confirm('确定要删除这条线路吗？')) {
    await tripStore.deleteTrip(trip.id)
  }
}

// 创建新线路
const goToCreate = () => {
  navigateTo('/trip/create')
}

// 页面加载
onMounted(() => {
  tripStore.loadTrips()
})
</script>

<style scoped lang="scss">
.trip-home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background, #{$background});
}

.header {
  background: white;
  box-shadow: $shadow-sm;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  min-height: 56px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
}

.search-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: $text-secondary;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.search-bar {
  padding: 0 $spacing-md $spacing-md;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  color: $text-disabled;
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 $spacing-md 0 40px;
  border: 1px solid $divider;
  border-radius: $radius-lg;
  font-size: 16px;
  background: #f5f5f5;

  &:focus {
    outline: none;
    border-color: $primary-color;
    background: white;
  }
}

.clear-btn {
  position: absolute;
  right: $spacing-md;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: $text-disabled;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid $divider;
}

.tab {
  flex: 1;
  padding: $spacing-md;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-fast;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  position: relative;

  &.active {
    color: $primary-color;
    border-bottom-color: $primary-color;
  }

  &:hover {
    color: $primary-color;
  }
}

.tab-count {
  margin-left: $spacing-xs;
  font-size: 12px;
  background: $divider;
  color: $text-secondary;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.tab.active .tab-count {
  background: $primary-color;
  color: white;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  gap: $spacing-md;
}

.loading-text {
  color: $text-secondary;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  text-align: center;
  min-height: 300px;
}

.empty-icon {
  color: $text-disabled;
  margin-bottom: $spacing-md;
}

.empty-title {
  font-size: 18px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.empty-desc {
  color: $text-secondary;
  margin-bottom: $spacing-lg;
}

.trip-list-container {
  flex: 1;
  height: 0; // 确保容器有固定高度
  overflow: hidden;
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.fab {
  @include fab;
  width: 56px;
  height: 56px;
  font-size: 24px;
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .header,
  .tabs {
    background: $dark-background;
    border-color: $dark-divider;
  }

  .title {
    color: $dark-text-primary;
  }

  .tab {
    color: $dark-text-secondary;

    &.active {
      color: $primary-color;
    }
  }

  .search-input {
    background: $dark-divider;
    color: $dark-text-primary;
    border-color: $dark-divider;

    &:focus {
      background: $dark-background;
    }
  }

  .skeleton-card {
    background: $dark-background;
  }

  .empty-title {
    color: $dark-text-primary;
  }

  .empty-desc {
    color: $dark-text-secondary;
  }
}
</style>
