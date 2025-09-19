export default defineNuxtPlugin(() => {
  // 声明全局 AMap 类型
  declare global {
    interface Window {
      AMap: any
    }
  }

  // 高德地图工具类
  const amapUtils = {
    // 初始化地图
    initMap(container: string, options: any = {}) {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      const defaultOptions = {
        zoom: 10,
        center: [116.397428, 39.90923], // 北京
        mapStyle: 'amap://styles/dark', // 暗黑主题
        resizeEnable: true,
        rotateEnable: false,
        pitchEnable: false,
        zoomEnable: true,
        scrollWheel: true,
        touchZoom: true,
        doubleClickZoom: true,
        keyboardEnable: true,
        dragEnable: true,
        ...options
      }

      return new window.AMap.Map(container, defaultOptions)
    },

    // 创建标记
    createMarker(position: [number, number], options: any = {}) {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      const defaultOptions = {
        position,
        title: '',
        ...options
      }

      return new window.AMap.Marker(defaultOptions)
    },

    // 创建信息窗口
    createInfoWindow(content: string, options: any = {}) {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      const defaultOptions = {
        content,
        offset: new window.AMap.Pixel(0, -30),
        ...options
      }

      return new window.AMap.InfoWindow(defaultOptions)
    },

    // 创建图标
    createIcon(url: string, size: [number, number] = [32, 32]) {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      return new window.AMap.Icon({
        size: new window.AMap.Size(size[0], size[1]),
        image: url,
        imageSize: new window.AMap.Size(size[0], size[1])
      })
    },

    // 地理编码
    geocode(address: string): Promise<[number, number]> {
      return new Promise((resolve, reject) => {
        if (!window.AMap) {
          reject(new Error('高德地图API未加载'))
          return
        }

        const geocoder = new window.AMap.Geocoder({
          city: '全国'
        })

        geocoder.getLocation(address, (status: string, result: any) => {
          if (status === 'complete' && result.geocodes.length > 0) {
            const location = result.geocodes[0].location
            resolve([location.lng, location.lat])
          } else {
            reject(new Error('地理编码失败'))
          }
        })
      })
    },

    // 逆地理编码
    reverseGeocode(lng: number, lat: number): Promise<string> {
      return new Promise((resolve, reject) => {
        if (!window.AMap) {
          reject(new Error('高德地图API未加载'))
          return
        }

        const geocoder = new window.AMap.Geocoder({
          city: '全国'
        })

        geocoder.getAddress([lng, lat], (status: string, result: any) => {
          if (status === 'complete' && result.regeocode) {
            resolve(result.regeocode.formattedAddress)
          } else {
            reject(new Error('逆地理编码失败'))
          }
        })
      })
    },

    // 计算距离
    getDistance(point1: [number, number], point2: [number, number]): number {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      return window.AMap.GeometryUtil.distance(point1, point2)
    },

    // 绘制路径
    drawPath(map: any, path: [number, number][], options: any = {}) {
      if (!window.AMap) {
        throw new Error('高德地图API未加载')
      }

      const defaultOptions = {
        path,
        strokeColor: '#0ABFC5',
        strokeWeight: 3,
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        ...options
      }

      const polyline = new window.AMap.Polyline(defaultOptions)
      map.add(polyline)
      return polyline
    },

    // 设置地图中心
    setCenter(map: any, lng: number, lat: number, zoom?: number) {
      if (zoom) {
        map.setZoomAndCenter(zoom, [lng, lat])
      } else {
        map.setCenter([lng, lat])
      }
    },

    // 适应视野
    setFitView(map: any, markers: any[]) {
      if (markers.length === 0) return

      const bounds = new window.AMap.Bounds()
      markers.forEach(marker => {
        bounds.extend(marker.getPosition())
      })
      map.setBounds(bounds)
    },

    // 切换地图样式
    setMapStyle(map: any, style: 'normal' | 'dark' | 'light') {
      const styleMap = {
        normal: 'amap://styles/normal',
        dark: 'amap://styles/dark',
        light: 'amap://styles/light'
      }
      map.setMapStyle(styleMap[style])
    }
  }

  return {
    provide: {
      amap: amapUtils
    }
  }
})
