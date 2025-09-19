import { ref, computed, watch, readonly } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)
  const systemTheme = ref<'light' | 'dark'>('light')

  // 检测系统主题
  const detectSystemTheme = () => {
    if (typeof window !== 'undefined') {
      systemTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        systemTheme.value = e.matches ? 'dark' : 'light'
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
        }
      })
    }
  }

  // 初始化主题
  const initTheme = () => {
    if (typeof window === 'undefined') return

    detectSystemTheme()
    watchSystemTheme()

    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的设置，使用系统主题
      isDark.value = systemTheme.value === 'dark'
    }

    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    
    if (isDark.value) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }

    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark.value ? '#121212' : '#0ABFC5')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // 设置主题
  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (theme === 'auto') {
      localStorage.removeItem('theme')
      isDark.value = systemTheme.value === 'dark'
    } else {
      isDark.value = theme === 'dark'
      localStorage.setItem('theme', theme)
    }
    applyTheme()
  }

  // 获取当前主题
  const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme as 'light' | 'dark'
    }
    return 'auto'
  }

  // 计算属性
  const themeClass = computed(() => isDark.value ? 'dark' : 'light')
  const isAuto = computed(() => !localStorage.getItem('theme'))

  // 监听主题变化
  watch(isDark, () => {
    applyTheme()
  })

  // 主题相关的 CSS 变量
  const themeVars = computed(() => ({
    '--primary-color': isDark.value ? '#4DD0D1' : '#0ABFC5',
    '--primary-light': isDark.value ? '#80E5E6' : '#4DD0D1',
    '--primary-dark': isDark.value ? '#00838F' : '#00838F',
    '--text-primary': isDark.value ? '#FFFFFF' : '#212121',
    '--text-secondary': isDark.value ? '#B0B0B0' : '#757575',
    '--text-disabled': isDark.value ? '#666666' : '#BDBDBD',
    '--divider': isDark.value ? '#333333' : '#E0E0E0',
    '--background': isDark.value ? '#121212' : '#FAFAFA',
    '--surface': isDark.value ? '#1E1E1E' : '#FFFFFF',
    '--shadow': isDark.value ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
  }))

  // 应用 CSS 变量
  const applyThemeVars = () => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    Object.entries(themeVars.value).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  // 监听主题变量变化
  watch(themeVars, () => {
    applyThemeVars()
  }, { deep: true })

  return {
    isDark: readonly(isDark),
    systemTheme: readonly(systemTheme),
    themeClass,
    isAuto,
    initTheme,
    toggleTheme,
    setTheme,
    getCurrentTheme,
    applyTheme,
    applyThemeVars
  }
}
