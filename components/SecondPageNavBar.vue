<script lang="ts" setup>

const isFixed = ref(false)
const changeFixedHandle = (e) => {
    isFixed.value = e
}
const props = defineProps<{
    title: String;
    rightIcon?: string;
    hasNoBg?: boolean;
    rightClickHandle?:Function
}>()
const router = useRouter()
const route = useRoute()
const changePage = (url: any) => {
    if (url !=='back') {
        router.push(url)
    } else {
        // 方法一的变种：判断 state.back
      if (window.history.state.back) {
        router.back()
      } else {
        // 如果没有上一页，强制跳转到首页（兜底）
        router.replace({ path: '/' })
      }
    }
}

</script>

<template>
    <div>
        <van-sticky offset-top="0" @change="changeFixedHandle">
            <div class="px-3 py-3 flex justify-between items-center colorfff "
                :class="isFixed || !props.hasNoBg ?'bg-[#2D57FF]':''">
                <div class="w-[40px] flex items-center">
                    <Icon name="line-md:chevron-left" size="28" class="cursor-pointer" @click="changePage('back')" />
                </div>
                <div class="flex-1 text-center text-xl  font-bold truncate">
                    {{ props.title }}
                </div>
                <div class="w-[40px] flex flex-row-reverse cursor-pointer ">
                  <slot></slot>
                    <div v-if="props.rightIcon"
                        @click="props.rightClickHandle">
                        <img :src="props.rightIcon" class="w-8 h-8" />
                    </div>
                </div>
            </div>
        </van-sticky>


    </div>
</template>


<style lang="less" scoped>

</style>
