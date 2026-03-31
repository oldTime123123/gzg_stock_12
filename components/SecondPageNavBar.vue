<script lang="ts" setup>
const isFixed = ref(false)
const changeFixedHandle = (e: boolean) => {
  isFixed.value = e
}

const props = defineProps<{
  title: String;
  rightIcon?: string;
  hasNoBg?: boolean;
  rightClickHandle?: Function
}>()

const router = useRouter()
const changePage = (url: any) => {
  if (url !== 'back') {
    router.push(url)
  } else if (window.history.state.back) {
    router.back()
  } else {
    router.replace({ path: '/' })
  }
}

const handleRightClick = () => {
  props.rightClickHandle?.()
}
</script>

<template>
  <div>
    <van-sticky offset-top="0" @change="changeFixedHandle">
      <div
        class="flex items-center justify-between gap-3 px-4 py-3 colorfff transition-colors duration-200"
        :class="isFixed || !props.hasNoBg ? 'bg-[#2D57FF]' : ''"
      >
        <div class="flex w-10 shrink-0 items-center">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            @click="changePage('back')"
          >
            <Icon name="line-md:chevron-left" size="24" />
          </button>
        </div>

        <div class="min-w-0 flex-1 truncate text-center text-[1.125rem] font-extrabold leading-tight tracking-[-0.02em]">
          {{ props.title }}
        </div>

        <div class="flex w-10 shrink-0 items-center justify-end">
          <slot></slot>
          <button
            v-if="props.rightIcon"
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            @click="handleRightClick"
          >
            <img :src="props.rightIcon" class="h-7 w-7" alt="" />
          </button>
        </div>
      </div>
    </van-sticky>
  </div>
</template>
