<script setup lang="ts">
import { ipoApplyDataApi } from '~/api/ipo'
const { t, locale } = useI18n()


const pages = ref({
    page: 1,
    size: 10,
  status: 2,
    type:2
})

const showVanSkeletonLoading = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {

    ipoApplyDataApi(pages.value).then(res => {
        totalSize.value = res.total
        recordList.value = recordList.value.concat(res.data)
    }).finally(() => {
        loading.value = false
        if (recordList.value.length == totalSize.value) {
            finished.value = true
        } else {
            pages.value.page++;
        }
        showVanSkeletonLoading.value = false
    })
}

onMounted(() => {
    getRecordList()
})
</script>

<template>
    <div>
        <second-page-nav-bar :title="$t('record.a1')"></second-page-nav-bar>

        <div class="mt-3 px-3 bg-white">
            <div class="recordBoxEl mt-3 pb-2">


                <div class="" v-if="recordList.length == 0">
                    <div class="nullData mt-10"></div>
                    <div class="text-lg mt-2 color text-blue-300 text-center">
                        {{$t('record.r2')}}
                    </div>
                </div>
                <div v-else>
                    <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
                        :finished-text="' '" @load="getRecordList">
                        <div class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-xl" v-for="(item, index) in recordList"
                            :key="index">

                            <div class=" rounded-xl space-y-1">
                                <div class="flex  items-baseline border-b-blue-500  border-b-2 pb-2">
                                    <span class="mainTextColor font-bold"> {{ item.product?.pro_name }}</span>
                                    <div class=" px-1  rounded-xs color000 text-xs">
                                        {{ item.pro_code }}
                                    </div>

                                </div>

                                <!-- <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r3')}}
                                    </div>
                                    <div class="">
                                        {{ item.create_time }}
                                    </div>
                                </div> -->
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{ $t('record.a2') }}
                                    </div>
                                    <div class="">
                                        {{ item.number }}
                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r4')}}
                                    </div>
                                    <div class="">
                                        {{ UseExchangeNumber(item.price) }}
                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r5')}}
                                    </div>
                                    <div class="">
                                        {{ UseExchangeNumber(item.ipo?.show_price) }}
                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r6')}}
                                    </div>
                                    <div class="" :class="item.income_formart > 0 ? ' colorUp' : 'colorDown'">
                                        {{ item.income_formart }}

                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r7')}}
                                    </div>
                                    <div class="" :class="item.income_formart > 0 ? ' colorUp' :'colorDown'">
                                        {{ item.income_100_formart }}

                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r8')}}
                                    </div>
                                    <div class="">
                                        {{item.create_time}}
                                    </div>
                                </div>
                                <div class="flex justify-between items-center color000">
                                    <div class="text-[#404040]">
                                        {{$t('record.r9')}}
                                    </div>
                                    <div class="colorDown">
                                   {{ item.status == 1 ? $t('trade.t111')
                                    : item.status == 2 ? t('trade.t112') : item.status == 3 ? $t('trade.t146') :
                                        item.status == 4 ? $t('trade.t147') : $t('trade.t148') }} </div>
                                </div>
                                <!--
                                <div class="contentBtn mt-2">
                                    ワンクリックで閉じる
                                </div> -->
                            </div>
                        </div>
                    </van-list>
                </div>

            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.recordBoxEl {
    border-radius: 10px;


}
</style>
