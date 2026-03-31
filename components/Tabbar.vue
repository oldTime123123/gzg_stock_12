<script setup>
import { useRouter, useRoute } from 'vue-router'
import t1Icon from '~/assets/images/tabbar/t1.png'
import t11Icon from '~/assets/images/tabbar/t11.png'
import t2Icon from '~/assets/images/tabbar/t2.png'
import t22Icon from '~/assets/images/tabbar/t22.png'
import t3Icon from '~/assets/images/tabbar/t3.png'
import t33Icon from '~/assets/images/tabbar/t33.png'
import t4Icon from '~/assets/images/tabbar/t4.png'
import t44Icon from '~/assets/images/tabbar/t44.png'
import t5Icon from '~/assets/images/tabbar/t5.png'
import t55Icon from '~/assets/images/tabbar/t55.png'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const active = ref(0)

const tabs = computed(() => {
  return [
    {
      name: t('comm.c77'),
      path: '/tabbar/home',
      icon: t1Icon,
      selectIcon: t11Icon,
    },
    {
      name: t('comm.c78'),
      path: '/tabbar/market',
      icon: t2Icon,
      selectIcon: t22Icon,
    },
    {
      name: t('comm.c79'),
      path: '/tabbar/invest',
      icon: t3Icon,
      selectIcon: t33Icon,
    },
    {
      name: t('comm.c80'),
      path: '/tabbar/news',
      icon: t4Icon,
      selectIcon: t44Icon,
    },
    {
      name: t('comm.c81'),
      path: '/tabbar/mine',
      icon: t5Icon,
      selectIcon: t55Icon,
    }
  ]
})

const onChange = (index) => {
  active.value = index
  router.push(tabs.value[index].path)
}

const setActiveTab = () => {
  const currentPath = route.path
  const index = tabs.value.findIndex(tab => tab.path === currentPath)
  if (index !== -1) {
    active.value = index
  }
}

watch(() => route.path, () => {
  setActiveTab()
}, { immediate: true })
</script>

<template>
  <div>
    <van-tabbar
      v-model="active"
      @change="onChange"
      :safe-area-inset-bottom="true"
      class="!bottom-0 !left-1/2 z-[100] h-[58px] w-full max-w-[var(--pageWidth)] -translate-x-1/2 border-t border-[rgba(45,87,255,0.08)] bg-[#F3F8FF]"
    >
      <van-tabbar-item :name="0" :index="0">
        <template #icon="props">
            <div class="flex flex-col items-center justify-center" :class="props.active ? 'text-[var(--mainColor)]' : 'text-[#C1C0C0]'">
              <img :src="props.active ? tabs[0].selectIcon : tabs[0].icon" class="mb-1 h-6 w-6" alt="" />
            <div class="text-center text-[0.75rem] font-medium leading-none tracking-[0.02em]">{{ tabs[0].name }}</div>
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item :index="1" :name="1" :dot="false">
        <template #icon="props">
          <van-badge :content="tabs[1].badge" :show-zero="false">
            <div class="flex flex-col items-center justify-center" :class="props.active ? 'text-[var(--mainColor)]' : 'text-[#C1C0C0]'">
              <img :src="props.active ? tabs[1].selectIcon : tabs[1].icon" class="mb-1 h-6 w-6" alt="" />
              <div class="text-center text-[0.75rem] font-medium leading-none tracking-[0.02em]">{{ tabs[1].name }}</div>
            </div>
          </van-badge>
        </template>
      </van-tabbar-item>
      <van-tabbar-item :index="2" :name="2">
        <template #icon="props">
          <div class="flex flex-col items-center justify-center" :class="props.active ? 'text-[var(--mainColor)]' : 'text-[#C1C0C0]'">
            <img :src="props.active ? tabs[2].selectIcon : tabs[2].icon" class="mb-1 h-6 w-6" alt="" />
            <div class="text-center text-[0.75rem] font-medium leading-none tracking-[0.02em]">{{ tabs[2].name }}</div>
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item :index="3" :name="3">
        <template #icon="props">
          <div class="flex flex-col items-center justify-center" :class="props.active ? 'text-[var(--mainColor)]' : 'text-[#C1C0C0]'">
            <img :src="props.active ? tabs[3].selectIcon : tabs[3].icon" class="mb-1 h-6 w-6" alt="" />
            <div class="text-center text-[0.75rem] font-medium leading-none tracking-[0.02em]">{{ tabs[3].name }}</div>
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item :index="4" :name="4">
        <template #icon="props">
          <div class="flex flex-col items-center justify-center" :class="props.active ? 'text-[var(--mainColor)]' : 'text-[#C1C0C0]'">
            <img :src="props.active ? tabs[4].selectIcon : tabs[4].icon" class="mb-1 h-6 w-6" alt="" />
            <div class="text-center text-[0.75rem] font-medium leading-none tracking-[0.02em]">{{ tabs[4].name }}</div>
          </div>
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <div class="h-[70px]"></div>
  </div>
</template>
