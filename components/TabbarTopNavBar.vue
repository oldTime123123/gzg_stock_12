<script lang="ts" setup>
const isSticky = ref(false)
const topFixedChange = (val: boolean) => {
  isSticky.value = val
}

const router = useRouter()
const changePage = (url: any) => {
  router.push(url)
}
</script>

<template>
  <div>
    <van-sticky offset-top="0" @change="topFixedChange">
      <div class="tabbarPageTopNav px-4 py-3" :class="isSticky ? 'topStickyEl' : ''">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-full bg-white/50 px-3 py-2 text-left shadow-[0_4px_10px_rgba(0,0,0,0.08)] backdrop-blur-[2px]"
          @click="changePage('/search')"
        >
          <div class="flex h-[35px] w-[70px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2D57FF_0%,#244ee6_100%)] shadow-[0_8px_18px_rgba(45,87,255,0.18)]">
            <img src="~/assets/images/icon/m_search.png" class="h-5 w-5" alt="" />
          </div>
          <div class="min-w-0 flex-1 truncate text-[0.9375rem] font-medium tracking-[-0.01em] colorfff">
            {{ $t('comm.c82') }}
          </div>
        </button>
      </div>
    </van-sticky>
  </div>
</template>
