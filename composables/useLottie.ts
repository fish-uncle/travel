import { ref, onUnmounted, readonly } from 'vue'

export interface LottieOptions {
  loop?: boolean
  autoplay?: boolean
  speed?: number
  direction?: 1 | -1
  renderer?: 'svg' | 'canvas' | 'html'
  rendererSettings?: any
}

export const useLottie = () => {
  const lottieInstance = ref<any>(null)
  const isPlaying = ref(false)
  const isLoaded = ref(false)
  const currentFrame = ref(0)
  const totalFrames = ref(0)
  const duration = ref(0)

  // 加载 Lottie 动画
  const loadAnimation = async (
    container: HTMLElement | string,
    animationData: any,
    options: LottieOptions = {}
  ) => {
    try {
      // 动态导入 lottie-web
      const lottie = await import('lottie-web')
      
      const defaultOptions = {
        loop: true,
        autoplay: true,
        speed: 1,
        direction: 1,
        renderer: 'svg',
        ...options
      }

      lottieInstance.value = lottie.default.loadAnimation({
        container: typeof container === 'string' ? document.querySelector(container) : container,
        renderer: defaultOptions.renderer,
        loop: defaultOptions.loop,
        autoplay: defaultOptions.autoplay,
        animationData,
        rendererSettings: defaultOptions.rendererSettings
      })

      // 设置速度
      if (defaultOptions.speed !== 1) {
        lottieInstance.value.setSpeed(defaultOptions.speed)
      }

      // 设置方向
      if (defaultOptions.direction === -1) {
        lottieInstance.value.setDirection(-1)
      }

      // 监听事件
      lottieInstance.value.addEventListener('complete', () => {
        isPlaying.value = false
      })

      lottieInstance.value.addEventListener('loopComplete', () => {
        isPlaying.value = false
      })

      lottieInstance.value.addEventListener('enterFrame', () => {
        currentFrame.value = Math.round(lottieInstance.value.currentFrame)
      })

      // 获取动画信息
      totalFrames.value = lottieInstance.value.totalFrames
      duration.value = lottieInstance.value.getDuration()
      isLoaded.value = true

      return lottieInstance.value
    } catch (error) {
      console.error('Lottie 动画加载失败:', error)
      throw error
    }
  }

  // 播放动画
  const play = () => {
    if (lottieInstance.value) {
      lottieInstance.value.play()
      isPlaying.value = true
    }
  }

  // 暂停动画
  const pause = () => {
    if (lottieInstance.value) {
      lottieInstance.value.pause()
      isPlaying.value = false
    }
  }

  // 停止动画
  const stop = () => {
    if (lottieInstance.value) {
      lottieInstance.value.stop()
      isPlaying.value = false
      currentFrame.value = 0
    }
  }

  // 跳转到指定帧
  const goToAndStop = (frame: number) => {
    if (lottieInstance.value) {
      lottieInstance.value.goToAndStop(frame, true)
      currentFrame.value = frame
    }
  }

  // 跳转到指定帧并播放
  const goToAndPlay = (frame: number) => {
    if (lottieInstance.value) {
      lottieInstance.value.goToAndPlay(frame, true)
      isPlaying.value = true
    }
  }

  // 设置播放速度
  const setSpeed = (speed: number) => {
    if (lottieInstance.value) {
      lottieInstance.value.setSpeed(speed)
    }
  }

  // 设置播放方向
  const setDirection = (direction: 1 | -1) => {
    if (lottieInstance.value) {
      lottieInstance.value.setDirection(direction)
    }
  }

  // 设置循环
  const setLoop = (loop: boolean) => {
    if (lottieInstance.value) {
      lottieInstance.value.loop = loop
    }
  }

  // 销毁动画
  const destroy = () => {
    if (lottieInstance.value) {
      lottieInstance.value.destroy()
      lottieInstance.value = null
      isPlaying.value = false
      isLoaded.value = false
      currentFrame.value = 0
      totalFrames.value = 0
      duration.value = 0
    }
  }

  // 获取进度百分比
  const getProgress = () => {
    if (totalFrames.value > 0) {
      return (currentFrame.value / totalFrames.value) * 100
    }
    return 0
  }

  // 预加载动画数据
  const preloadAnimation = async (url: string) => {
    try {
      const response = await fetch(url)
      const animationData = await response.json()
      return animationData
    } catch (error) {
      console.error('动画数据预加载失败:', error)
      throw error
    }
  }

  // 创建简单的加载动画
  const createLoadingAnimation = (container: HTMLElement) => {
    const loadingData = {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 100,
      h: 100,
      nm: "Loading",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Circle",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
            p: { a: 0, k: [50, 50, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [40, 40] },
                  p: { a: 0, k: [0, 0] },
                  nm: "Ellipse Path 1",
                  mn: "ADBE Vector Shape - Ellipse",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0.067, 0.753, 0.773, 1] },
                  o: { a: 0, k: 100 },
                  w: { a: 0, k: 4 },
                  lc: 2,
                  lj: 1,
                  ml: 4,
                  bm: 0,
                  d: [
                    {
                      n: "d",
                      v: { a: 0, k: 0 }
                    }
                  ],
                  nm: "Stroke 1",
                  mn: "ADBE Vector Graphic - Stroke",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                  sk: { a: 0, k: 0 },
                  sa: { a: 0, k: 0 },
                  nm: "Transform"
                }
              ],
              nm: "Ellipse 1",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false
            }
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0
        }
      ],
      markers: []
    }

    return loadAnimation(container, loadingData, {
      loop: true,
      autoplay: true,
      renderer: 'svg'
    })
  }

  // 组件卸载时自动销毁
  onUnmounted(() => {
    destroy()
  })

  return {
    lottieInstance: readonly(lottieInstance),
    isPlaying: readonly(isPlaying),
    isLoaded: readonly(isLoaded),
    currentFrame: readonly(currentFrame),
    totalFrames: readonly(totalFrames),
    duration: readonly(duration),
    loadAnimation,
    play,
    pause,
    stop,
    goToAndStop,
    goToAndPlay,
    setSpeed,
    setDirection,
    setLoop,
    destroy,
    getProgress,
    preloadAnimation,
    createLoadingAnimation
  }
}
