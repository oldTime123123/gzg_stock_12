<script lang="ts" setup>

import { getSettingService } from '~/api/pay/realse';


const serviceList = ref([])
const getData = () => {
    getSettingService().then(res => {
        serviceList.value = res.list
    })
}
const jumpPage = item => {
    if (window) {
        window.open(item.contact_link)
    }
}
onBeforeMount(() => {
    getData()
})
</script>

<template>

    <div>
        <second-page-nav-bar :title="$t('pay.p4')"></second-page-nav-bar>

        <div class="serviceBg flex flex-row-reverse p3-2 ">
            <div class="w-1/2  text-xs  px-2   py-2 flex items-center justify-center font-bold mt-3 rounded-l-full text-center bg-[#FFDA1C]" >
                {{$t('service.s1')}}
            </div>
        </div>
        <div class="mt-4 px-3">
            <div class="flex justify-between cursor-pointer items-center py-2 bg-[var(--mainColor)] px-3 mb-3 rounded-sm"
                v-for="item in serviceList" :key="item" @click="jumpPage(item)">
                <div class="flex items-center">
                    <img :src="item.avatar" class="w-10 h-10 rounded-xs">
                    <div class="ml-2 colorfff text-sm">
                        <div>{{ item.service_name }}</div>
                        <div>
                            {{ item.start_working_time + '-' + item.end_working_time }}
                        </div>
                    </div>
                </div>
                <Icon class="w-7 h-7  colorfff" name="line-md:chevron-right" />

            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.serviceBg {
  background: url('~/assets/images/img/serviceBg.png') no-repeat;
  background-size: 100%;
  height: 78px;
  // padding-top: 20px;
}
</style>
