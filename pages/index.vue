<script lang="ts" setup>
import { onBeforeMount } from 'vue';

const pub = usePublicStore()
const showFlag = computed(() => {
  return pub.isLoginFlag
})

const router = useRouter()
const loginStore = useLoginStore();

onBeforeMount(() => {
  if (window.location.search.includes("?t=")) {
    const token = window.location.search.split("?t=")[1];
    localStorage.setItem("token", token);
    window.location.href = "/tabbar/home";
    return;
  }
})
onMounted(() => {
  if (localStorage.getItem('token')) {
    setTimeout(() => {
      router.push('/tabbar/home')
      // router.push('/auth/beforeLogin')
    }, 2000)
  } else {
    loginStore.showLoadingText = ""
    setTimeout(() => {
      router.push('/auth/beforeLogin')
    }, 2000)
  }
})
const showLoadingText = computed(() => {
  return loginStore.loadingText
})
</script>


<template>
  <div class="h-[200px]">
    <ClientOnly>

      <div class="loginLoadingPage">
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
            <img src="/ico.png" class=" w-[64px] h-[64px]  rounded-xl">
          </div>

        </div>
      </div>
    </ClientOnly>
  </div>
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
