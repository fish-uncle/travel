import { ref, computed, readonly } from 'vue'
import { useOnline } from '@vueuse/core'

export const useOffline = () => {
  const isOnline = useOnline()
  const isOffline = computed(() => !isOnline.value)

  // 缓存数据到本地存储
  const cacheData = (key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('缓存数据失败:', error)
    }
  }

  // 从本地存储获取缓存数据
  const getCachedData = (key: string, maxAge: number = 24 * 60 * 60 * 1000) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      return data
    } catch (error) {
      console.error('获取缓存数据失败:', error)
      return null
    }
  }

  // 清除过期缓存
  const clearExpiredCache = () => {
    const keys = Object.keys(localStorage)
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7天

    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const { timestamp } = JSON.parse(cached)
            if (now - timestamp > maxAge) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // 忽略解析错误，直接删除
          localStorage.removeItem(key)
        }
      }
    })
  }

  // 获取缓存大小
  const getCacheSize = () => {
    let size = 0
    const keys = Object.keys(localStorage)
    
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        const value = localStorage.getItem(key)
        if (value) {
          size += value.length
        }
      }
    })

    return size
  }

  // 清除所有缓存
  const clearAllCache = () => {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key)
      }
    })
  }

  return {
    isOnline,
    isOffline,
    cacheData,
    getCachedData,
    clearExpiredCache,
    getCacheSize,
    clearAllCache
  }
}
