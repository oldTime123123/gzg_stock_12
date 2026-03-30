<template>
  <div>
    <NuxtPage class="pageContent" />
    <Loading1 />
    <RealPop />
    <IPOactSign/>
    <login-loading   />
  <!-- <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #00dc82 0%, #34cdfe 50%, #0047e1 100%)"
    :height="4"
    :throttle="200"
  /> -->
    <van-backTop :bottom="60" :right="10"></van-backTop>
  </div>
</template>
<script setup >
import socket from "~/utils/socket.ts";

import { useHead, useSeoMeta, useRequestURL } from 'nuxt/app'
import { computed, onMounted, onUnmounted } from 'vue'
const pub = usePublicStore()

const url = useRequestURL()
// const siteConfig = computed(() => {
//   return pub.siteConfig
// })
import icon from '~/public/ico.png?v=1'
const siteName = 'QSoe Pro'
const description = `
QSoe Pro証券は機関投資家向けのサービスに特化しています。 QSoe Proは、投資学習、市場調査、戦略交流に特化した総合型プラットフォームです。異なる段階の投資家に対して、明確で理解しやすく、検証可能な投資参考情報を提供することを目指しております。プラットフォームは、理性的な投資とリスク管理を核心理念とし、体系的な市場分析、
戦略の分解、実戦の振り返りを通じて、利用者が自分自身の投資判断体系を徐々に構築できるようサポートいたします
`

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: icon },
    { rel: 'apple-touch-icon', href: icon },
    { rel: 'canonical', href: url.href }
  ],
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover',
    },
    { name: 'application-name', content: siteName },
    { name: 'theme-color', content: '#ffffff' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

useSeoMeta({
  title: siteName,
  ogTitle: siteName,
  description: description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: siteName,
  ogImage: icon,
  twitterCard: 'summary_large_image',
  twitterImage: icon,
  twitterTitle: siteName,
  twitterDescription: description,
  robots: 'index,follow'
})
const { setLocale } = useI18n()

const loginStore = useLoginStore()
onMounted(() => {
  // if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/sw.js', { scope: '/' })
  // }
    // if (loginStore.loading) {
    //   loginStore.loading = false
  // }
  if (!pub.setLang) {
      setLocale('ja')
    }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister().then(success => {
          if (success) {
            window.location.reload();
          }
        });
      }
    });
    if ('caches' in window) {
      caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (cacheName) {
          caches.delete(cacheName);
        });
      });
    }
  }
})



const user = useUserStore();

if(window){
  window.addEventListener('error', () => {
    pub.showLoading = false
  })

  window.addEventListener('unhandledrejection', () => {
    pub.showLoading = false
  })
}
const notifyTimer = ref("")
onBeforeMount(() => {
  if (user.isLogined()) {

    user.flush();
  }
  if(notifyTimer.value){
    clearInterval(notifyTimer.value)
  }
  if (pub.showIPONoticePop) {
    pub.showIPONoticePop = false
  }
  if (pub.show209PopFlag) {
    pub.show209PopFlag = false
  }
  pub.initPlantformData()
  if (window) {
    if (localStorage.getItem('token')) {
      let params = {
        token: localStorage.getItem('token')
      }
      socket.connect()
      socket.emit('ipoNotice', params)
      socket.emit('stock_status')
      notifyTimer.value = setInterval(() => {
        socket.emit('ipoNotice', params)
        socket.emit('stock_status' )
      }, 5000);
      socket.on('ipoNotice', data => {

        if (data.id) {
            pub.showIPONoticePop = true
          pub.ipoNoticeData = data
          }
      })
      socket.on('stock_status', data => {
        pub.stockStatus = data.status
      })
    }
  }
})


</script>


<style>
.van-toast {
  background: rgba(0, 0, 0, 0.9) !important;
}
html{
  min-height: 100vh;
}
</style>
