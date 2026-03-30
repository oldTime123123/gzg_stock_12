<script setup lang="ts">
const { t, locale } = useI18n()
const botDataTemplate = ref([
    {
        name: '日経225',
        currentVal: '38,910.5',
        changeVal: '1.25',
        isUp: true,
        changeRate: 1.25,
        // 走势：强劲上升（N字型上涨）
        series: [30, 55, 40, 70, 60, 90, 80, 100, 95, 120]
    },
    {
        name: '日経225',
        currentVal: '38,910.5',
        changeVal: '1.25',
        isUp: true,
        changeRate: 1.25,
        // 走势：强劲上升（N字型上涨）
        series: [30, 55, 40, 70, 60, 90, 80, 100, 95, 120]
    },
])

const pages = ref({
    page: 1,
    size: 10,
})

const showVanSkeletonLoading = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {
    // setTimeout(() => {
    recordList.value = botDataTemplate.value
    totalSize.value = 1
    loading.value = false
    if (recordList.value.length == totalSize.value) {
        finished.value = true
    } else {
        pages.value.page++;
    }
    showVanSkeletonLoading.value = false

    // },3000)
    // euteresLogApi(pages.value).then(res => {
    //     totalSize.value = res.total
    //     recordList.value = recordList.value.concat(res.data)
    // }).finally(() => {
    //     loading.value = false
    //     if (recordList.value.length == totalSize.value) {
    //         finished.value = true
    //     } else {
    //         pages.value.page++;
    //     }
    //     showVanSkeletonLoading.value = false
    // })
}
const recordContent = [
    {
        name: t('record.r18'),
        value: '買い増し'
    },
    {
        name: t('record.r19'),
        value: '17616286124045'
    },
    {
        name: t('record.r20'),
        value: '3,000'
    },
    {
        name: t('record.r21'),
        value: '3,000'
    },
    {
        name: t('record.r22'),
        value: '3,000'
    },
    {
        name: t('record.r23'),
        value: '3,000'
    },
    {
        name: t('record.r24'),
        value: '3,000'
    },
    {
        name: t('record.r25'),
        value: '12,054,000'
    },
    {
        name: t('record.r26'),
        value: '1'
    },
    {
        name: t('record.r27'),
        value: '12,054,000'
    },
]
onMounted(() => {
    getRecordList()
})
</script>

<template>
    <div>
        <second-page-nav-bar :title="$t('record.r28')"></second-page-nav-bar>

        <div class="mt-3 px-3 bg-white">
            <div class="saleContentBox">
                <div class="px-4 pt-3">
                    <div class="flex items-center justify-between  ">
                        <div class="flex items-baseline colorfff  ">
                            <div>{{$t('record.r29')}}</div>
                            <div class="text-[#FFDA1C] text-sm ml-2">7011</div>
                        </div>
                        <div class="text-sm pr-5 ">
                            {{$t('record.r30')}}
                        </div>
                    </div>
                    <div class="mt-5 text-center">
                        <div class="colorUp font-bold">10.48%</div>
                        <div class="text-sm">
                            {{$t('record.r31')}}1,263,000
                        </div>
                    </div>
                    <div class="mt-4 flex">
                        <div class="bg-[var(--mainColor)] px-2 py-0.5 colorfff rounded-xs">
                            {{$t('record.r32')}}
                        </div>
                    </div>
                    <div class="mt-1.5 flex items-center justify-between " v-for="(item, index) in recordContent"
                        :key="index" :class="index == 0 ? 'mt-2 text-sm' : 'f13'">
                        <div class="text-[#404040]">{{ item.name }}</div>
                        <div>{{ item.value }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.saleContentBox {
    background: url('~/assets/images/img/saleRecordBg.png') no-repeat;
    background-size: 100%;
    height: 420px;

    .f13 {
        font-size: 13px;
    }
}
</style>
