import legacy from "@vitejs/plugin-legacy";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
export default defineNuxtConfig({
  builder: "vite",
  ssr: true,
  spaLoadingTemplate: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
    // "@vite-pwa/nuxt",
  ],
  routeRules: {
    // 首页缓存 1 小时 (3600秒)，后台异步更新
    "/tabbar/home": { swr: 3600 },
  },
  i18n: {
    strategy: "no_prefix",
    langDir: "./",
    defaultLocale: "ja",
    locales: [
      {
        code: "ja",
        iso: "ja-JP",
        name: "日本語",
        file: "ja.json",
        isCatchallLocale: true,
      },
      // { code: "en", iso: "en-US", name: "English", file: "en.json" },
    ],
    langStorage: { key: "lang", sync: true },
  },
  icon: {
    mode: "svg", // 强制使用单个 SVG 文件（不走 sprite）
    serverBundle: "none", // 完全不生成 sprite bundle（重要！）
    clientBundle: {
      scan: true, // 扫描并预打包用到的图标
      sizeLimit: 1000, // 最多打包 1000 个图标，够用了
    },
  },

  vite: {
    build: {
      // 这里的 cssTarget 设置得更低一点，确保 vite 处理 hex 颜色等
      cssTarget: ["chrome50", "firefox50", "safari10", "ios10"],
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/pages/")) {
              return "all-pages";
            }
          },
        },
      },
    },
    css: {
      transformer: "postcss",
    },

    plugins: [
      Components({
        resolvers: [VantResolver({ importStyle: true })],
      }),
      legacy({
        // 针对低版本安卓调整 targets
        targets: ["chrome 52", "Android > 39", "iOS >= 10.3"],
        modernPolyfills: true,
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
    ],
    optimizeDeps: {
      include: [
        "@iconify-json/lucide/icons.json",
        "@iconify-json/simple-icons/icons.json",
      ],
    },
  },

  css: ["~/assets/css/main.css", "~/assets/css/public.less"],
  postcss: {
    plugins: {
      // 3. Preset Env 放在最后
      "postcss-preset-env": {
        stage: 3,
        features: {
          "nesting-rules": true,
          "custom-properties": false, // 禁用保留 CSS 变量，强制编译成静态值（针对极老安卓）
          "opacity-percentage": true, // 修复 #rrggbbaa 颜色格式
          "color-function": true, // 修复 lab/lch 等新颜色
        },
        autoprefixer: {
          grid: "autoplace",
          overrideBrowserslist: [
            "Android >= 5",
            "iOS >= 10",
            "Chrome >= 60",
            "Firefox >= 60",
          ],
        },
      },
    },
  },

  build: {
    transpile: ["vant"],
  },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  devtools: {
    enabled: false,
  },
  app: {
    head: {
      link: [{ rel: "manifest", href: "/manifest.json" }],
    },
  },

  nitro: {
    // 确保输出格式为 esm
    format: "esm",
    externals: {
      traceInclude: ["debug", "@vue/devtools-api"],
      inline: ["@vue/devtools-api", "vue-router"],
    },
  },
});
