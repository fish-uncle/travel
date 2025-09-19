import { ref, nextTick, readonly } from 'vue'

export const useAnimation = () => {
  const isAnimating = ref(false)

  // 页面切换动画
  const pageTransition = {
    name: 'page',
    mode: 'out-in'
  }

  // 淡入动画
  const fadeIn = (element: HTMLElement, duration = 300) => {
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
        
        setTimeout(resolve, duration)
      })
    })
  }

  // 淡出动画
  const fadeOut = (element: HTMLElement, duration = 300) => {
    return new Promise<void>((resolve) => {
      element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`
      element.style.opacity = '0'
      element.style.transform = 'translateY(-20px)'
      
      setTimeout(resolve, duration)
    })
  }

  // 滑入动画
  const slideIn = (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 300) => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    }

    element.style.transform = transforms[direction]
    element.style.opacity = '0'
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
        element.style.transform = 'translate(0, 0)'
        element.style.opacity = '1'
        
        setTimeout(resolve, duration)
      })
    })
  }

  // 滑出动画
  const slideOut = (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 300) => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    }

    return new Promise<void>((resolve) => {
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
      element.style.transform = transforms[direction]
      element.style.opacity = '0'
      
      setTimeout(resolve, duration)
    })
  }

  // 缩放动画
  const scaleIn = (element: HTMLElement, duration = 300) => {
    element.style.transform = 'scale(0.8)'
    element.style.opacity = '0'
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
        element.style.transform = 'scale(1)'
        element.style.opacity = '1'
        
        setTimeout(resolve, duration)
      })
    })
  }

  // 缩放动画
  const scaleOut = (element: HTMLElement, duration = 300) => {
    return new Promise<void>((resolve) => {
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
      element.style.transform = 'scale(0.8)'
      element.style.opacity = '0'
      
      setTimeout(resolve, duration)
    })
  }

  // 旋转动画
  const rotateIn = (element: HTMLElement, duration = 300) => {
    element.style.transform = 'rotate(-180deg) scale(0.8)'
    element.style.opacity = '0'
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`
        element.style.transform = 'rotate(0deg) scale(1)'
        element.style.opacity = '1'
        
        setTimeout(resolve, duration)
      })
    })
  }

  // 弹跳动画
  const bounceIn = (element: HTMLElement, duration = 600) => {
    element.style.transform = 'scale(0.3)'
    element.style.opacity = '0'
    
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity ${duration}ms ease`
        element.style.transform = 'scale(1)'
        element.style.opacity = '1'
        
        setTimeout(resolve, duration)
      })
    })
  }

  // 摇摆动画
  const shake = (element: HTMLElement, duration = 500) => {
    const originalTransform = element.style.transform
    
    return new Promise<void>((resolve) => {
      element.style.transition = `transform ${duration}ms ease`
      
      const keyframes = [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ]
      
      let currentFrame = 0
      const frameDuration = duration / keyframes.length
      
      const animate = () => {
        if (currentFrame < keyframes.length) {
          element.style.transform = keyframes[currentFrame].transform
          currentFrame++
          setTimeout(animate, frameDuration)
        } else {
          element.style.transform = originalTransform
          resolve()
        }
      }
      
      animate()
    })
  }

  // 脉冲动画
  const pulse = (element: HTMLElement, duration = 1000) => {
    const originalTransform = element.style.transform
    
    return new Promise<void>((resolve) => {
      element.style.transition = `transform ${duration}ms ease`
      
      const animate = () => {
        element.style.transform = 'scale(1.1)'
        setTimeout(() => {
          element.style.transform = 'scale(1)'
          setTimeout(() => {
            element.style.transform = originalTransform
            resolve()
          }, duration / 2)
        }, duration / 2)
      }
      
      animate()
    })
  }

  // 涟漪效果
  const ripple = (element: HTMLElement, event: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const rippleElement = document.createElement('div')
    rippleElement.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `
    
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(rippleElement)
    
    setTimeout(() => {
      rippleElement.remove()
    }, 600)
  }

  // 添加涟漪样式
  const addRippleStyles = () => {
    if (typeof document === 'undefined') return
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // 交错动画
  const staggerIn = (elements: HTMLElement[], delay = 100) => {
    return Promise.all(
      elements.map((element, index) => 
        new Promise<void>((resolve) => {
          setTimeout(() => {
            fadeIn(element).then(resolve)
          }, index * delay)
        })
      )
    )
  }

  // 打字机效果
  const typewriter = (element: HTMLElement, text: string, speed = 50) => {
    element.textContent = ''
    
    return new Promise<void>((resolve) => {
      let index = 0
      
      const type = () => {
        if (index < text.length) {
          element.textContent += text[index]
          index++
          setTimeout(type, speed)
        } else {
          resolve()
        }
      }
      
      type()
    })
  }

  // 进度条动画
  const animateProgress = (element: HTMLElement, from: number, to: number, duration = 1000) => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = from + (to - from) * progress
        
        element.style.width = `${current}%`
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animate()
    })
  }

  // 初始化
  addRippleStyles()

  return {
    isAnimating: readonly(isAnimating),
    pageTransition,
    fadeIn,
    fadeOut,
    slideIn,
    slideOut,
    scaleIn,
    scaleOut,
    rotateIn,
    bounceIn,
    shake,
    pulse,
    ripple,
    staggerIn,
    typewriter,
    animateProgress
  }
}
