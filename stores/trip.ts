import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tripDb } from '~/database'
import type { Trip, TripStatus, TripFilter } from '~/types'

export const useTripStore = defineStore('trip', () => {
  // 状态
  const trips = ref<Trip[]>([])
  const currentTrip = ref<Trip | null>(null)
  const loading = ref(false)
  const searchKeyword = ref('')

  // 计算属性
  const filteredTrips = computed(() => {
    return trips.value
  })

  // 动作
  const loadTrips = async () => {
    loading.value = true
    try {
      trips.value = await tripDb.getAllTrips()
    } catch (error) {
      console.error('加载行程失败:', error)
    } finally {
      loading.value = false
    }
  }

  const loadTrip = async (id: string) => {
    loading.value = true
    try {
      currentTrip.value = await tripDb.getTrip(id)
    } catch (error) {
      console.error('加载行程详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await tripDb.createTrip(tripData)
      await loadTrips()
      return id
    } catch (error) {
      console.error('创建行程失败:', error)
      throw error
    }
  }

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      await tripDb.updateTrip(id, updates)
      await loadTrips()
      if (currentTrip.value?.id === id) {
        await loadTrip(id)
      }
    } catch (error) {
      console.error('更新行程失败:', error)
    }
  }

  const deleteTrip = async (id: string) => {
    try {
      await tripDb.deleteTrip(id)
      await loadTrips()
      if (currentTrip.value?.id === id) {
        currentTrip.value = null
      }
    } catch (error) {
      console.error('删除行程失败:', error)
    }
  }

  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  const clearSearch = () => {
    searchKeyword.value = ''
  }

  return {
    // 状态
    trips,
    currentTrip,
    loading,
    searchKeyword,
    
    // 计算属性
    filteredTrips,
    
    // 动作
    loadTrips,
    loadTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    setSearchKeyword,
    clearSearch
  }
})
