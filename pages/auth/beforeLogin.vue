<script setup lang="ts">

const router = useRouter()
const changePage = (url: any) => {
  router.push(url)
}
const pub = usePublicStore()
onMounted(() => {
  pub.showLoading = false
})
</script>
<template>
  <div class="beforeLoginPage flex   flex-col-reverse">
    <div class="px-3">
      <div class="pb-[15vh]">
        <div class="contentBtn" @click="changePage('/auth/login')">{{ $t('login.l1') }}</div>
        <div class="mt-3 colorfff">
          {{ $t('login.l2') }} <span class="text-[#FFDA1C]  cursor-pointer" @click="changePage('/auth/register')">{{
            $t('login.l3') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="less" scoped>
.beforeLoginPage {
  background: url('~/assets/images/img/beforeLogin.png');
  height: 100vh;
  background-size: cover;
  // padding-bottom: 15vh;
  width: 100vw;
}
</style>
