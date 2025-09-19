<template>
  <div 
    ref="containerRef" 
    class="lottie-loader"
    :style="{ width: size, height: size }"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLottie } from '~/composables/useLottie'

interface Props {
  size?: string
  type?: 'loading' | 'empty' | 'error'
  loop?: boolean
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: '48px',
  type: 'loading',
  loop: true,
  autoplay: true
})

const containerRef = ref<HTMLElement>()
const { loadAnimation, destroy } = useLottie()

// 动画数据
const animationData = {
  loading: {
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
  },
  empty: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 100,
    h: 100,
    nm: "Empty",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Document",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 30, s: [10] }, { t: 60, s: [0] }, { t: 90, s: [0] }] },
          p: { a: 0, k: [50, 50, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] }, o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] }, t: 0, s: [80, 80, 100] }, { t: 30, s: [100, 100, 100] }, { t: 60, s: [100, 100, 100] }, { t: 90, s: [80, 80, 100] }] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "rc",
                s: { a: 0, k: [60, 80] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 8 },
                nm: "Rectangle Path 1",
                mn: "ADBE Vector Shape - Rect",
                hd: false
              },
              {
                ty: "st",
                c: { a: 0, k: [0.067, 0.753, 0.773, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 2 },
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
            nm: "Rectangle 1",
            np: 2,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false
          }
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0
      }
    ],
    markers: []
  },
  error: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: "Error",
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
          r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 30, s: [360] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [50, 50, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] }, o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] }, t: 0, s: [80, 80, 100] }, { t: 30, s: [100, 100, 100] }, { t: 60, s: [80, 80, 100] }] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [50, 50] },
                p: { a: 0, k: [0, 0] },
                nm: "Ellipse Path 1",
                mn: "ADBE Vector Shape - Ellipse",
                hd: false
              },
              {
                ty: "st",
                c: { a: 0, k: [0.957, 0.263, 0.212, 1] },
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
}

onMounted(async () => {
  if (containerRef.value) {
    try {
      await loadAnimation(containerRef.value, animationData[props.type], {
        loop: props.loop,
        autoplay: props.autoplay,
        renderer: 'svg'
      })
    } catch (error) {
      console.error('Lottie 动画加载失败:', error)
    }
  }
})

onUnmounted(() => {
  destroy()
})
</script>

<style scoped lang="scss">
.lottie-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
