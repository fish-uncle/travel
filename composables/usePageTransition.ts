import { ref, nextTick, readonly } from 'vue'

export function usePageTransition() {
  const isTransitioning = ref(false)
  const direction = ref<'forward' | 'backward'>('forward')
  
  // 开始页面切换
  const startTransition = async (dir: 'forward' | 'backward' = 'forward') => {
    direction.value = dir
    isTransitioning.value = true
    
    // 等待下一帧确保动画开始
    await nextTick()
  }
  
  // 结束页面切换
  const endTransition = async () => {
    isTransitioning.value = false
    
    // 等待动画完成
    await nextTick()
  }
  
  // 页面进入动画类名
  const getEnterClass = () => {
    if (direction.value === 'forward') {
      return 'page-enter-forward'
    } else {
      return 'page-enter-backward'
    }
  }
  
  // 页面离开动画类名
  const getLeaveClass = () => {
    if (direction.value === 'forward') {
      return 'page-leave-forward'
    } else {
      return 'page-leave-backward'
    }
  }
  
  return {
    isTransitioning: readonly(isTransitioning),
    direction: readonly(direction),
    startTransition,
    endTransition,
    getEnterClass,
    getLeaveClass
  }
}
