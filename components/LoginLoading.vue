<script setup lang="ts">
import { computed } from 'vue';


const pub = usePublicStore()
const siteConfig = computed(() => {
  return pub.siteConfig
})

const loginStore = useLoginStore()

const showLoading = computed(() => {
  return loginStore.loading
})

const showLoadingText = computed(() => {
  return loginStore.loadingText
})
</script>

<template>
  <ClientOnly>

    <div class="loginLoadingPage" v-if="showLoading">
      <div class="px-20 mt-10 text-center">
        <img src="~/assets/images/img/loginLoading.png" class="w-full">
        <div class="mt-3 text-4xl font-bold   text-[#FFDB1D]">
          {{ showLoadingText }}
        </div>
        <div class="mt-3 text-2xl colorfff">
          {{ $t('comm.c66') }}
        </div>

        <div class="flex justify-center mt-6">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="botLogo bg-white flex items-center justify-center">
        <div class=" w-[64px] h-[64px] ">
          <img src="/ico.png?v=3" class=" w-[64px] h-[64px]  rounded-xl">
        </div>
        <!-- <div class="text-2xl font-bold ml-2">
          {{ siteConfig.seo_title }}
        </div> -->
      </div>
    </div>
  </ClientOnly>
</template>


<style lang="less" scoped>
.loginLoadingPage {
  width: 100%;
  height: 100vh;
  background: url('~/assets/images/img/loginLoadingBg.png') no-repeat;
  background-size: cover;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: var(--pageWidth);

  .botLogo {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
  }

  .spinner {
    width: 100px;
    height: 100px;
    display: grid;
    border-radius: 50%;
    -webkit-mask: radial-gradient(farthest-side, #0000 40%, #FFDB1D 41%);
    background: linear-gradient(0deg, rgba(255, 218, 28, 0.5) 50%, rgba(255, 218, 28, 1) 0) center/4.5px 100%,
      linear-gradient(90deg, rgba(255, 218, 28, 0.25) 50%, rgba(255, 218, 28, 0.75) 0) center/100% 4.5px;
    background-repeat: no-repeat;
    animation: spinner-d3o0rx 1s infinite steps(12);
  }

  .spinner::before,
  .spinner::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
  }

  .spinner::after {
    opacity: 0.83;
    transform: rotate(60deg);
  }

  @keyframes spinner-d3o0rx {
    100% {
      transform: rotate(1turn);
    }
  }
}
</style>
