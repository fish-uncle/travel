import Icons from "unplugin-icons/vite";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  dev: process.env.NODE_ENV === "development",
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/tailwindcss",
  ],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  css: ["~/assets/scss/main.scss"],
  app: {
    head: {
      title: "我的线路",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0ABFC5" },
        {
          name: "description",
          content: "专业的旅行线路规划工具，支持离线使用",
        },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "我的线路" },
        { name: "msapplication-TileColor", content: "#0ABFC5" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/icon-192.png" },
      ],
      script: [
        {
          innerHTML: `
            window._AMapSecurityConfig = {
              securityJsCode: "${
                process.env.AMAP_SECRET || "6171dc6a7993ecde4079b2646d36f5bb"
              }",
            };
          `,
          type: "text/javascript",
        },
        {
          src: `https://webapi.amap.com/maps?v=2.0&key=${
            process.env.AMAP_KEY || "95b533dc58b44f3cbae93cd9efff0858"
          }`,
          defer: true,
        },
      ],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "sass:color"; @import "~/assets/scss/variables.scss"; @import "~/assets/scss/mixins.scss";',
        },
      },
    },
    plugins: [
      Icons({
        autoInstall: true,
      }),
    ],
    define: {
      __VUE_PROD_DEVTOOLS__: false,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            amap: ["https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"],
          },
        },
      },
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
  },
});
