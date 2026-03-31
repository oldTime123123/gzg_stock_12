<script lang="ts" setup>
import iCom1 from '~/assets/images/icon/i_com1.png'
import iCom2 from '~/assets/images/icon/i_com2.png'
import iCom3 from '~/assets/images/icon/i_com3.png'
import iCom4 from '~/assets/images/icon/i_com4.png'
import iSCom3 from '~/assets/images/icon/i_s_com3.png'
import iSCom4 from '~/assets/images/icon/i_s_com4.png'
import { homeNoitceBarInfo, getNewsList, getTradeProduct, getStockIndexList } from '~/api/home/home'

const { t } = useI18n()

const commList = computed(() => {
  return [
    {
      name: t('index.i10'),
      icon: iCom1,
      url: '/trade/insiderTrade'
    },
    {
      name: t('index.i15'),
      icon: iSCom3,
      url: '/trade/blockTrade'
    },
    {
      name: t('index.i13'),
      icon: iCom4,
      url: '/trade/leveragedTrade'
    },
    {
      name: t('index.i11'),
      icon: iCom2,
      url: '/trade/spoRecord'
    },
    {
      name: t('index.i12'),
      icon: iCom3,
      url: '/fund'
    },
    {
      name: t('index.i16'),
      icon: iSCom4,
      url: '/loan'
    },
  ]
})

const isSticky = ref(false)
const topFixedChange = (val: boolean) => {
  isSticky.value = val
}

const lineDataList = ref([])
const router = useRouter()
const changePage = (url: any) => {
  if (url) {
    router.push(url)
  }
}

const newsList = ref([])
const pub = usePublicStore()
const noticeTxt = ref('')
const selectStockInfo = ref({
  price: 0,
  chart: {
    rise_rate: 0,
    rise: 0,
  },
  rise_rate: 0
})
const HomeKlineRef = ref('')
const homeKlineEmitData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
})
const showSeketLoading = ref(true)
const showNewsSeketLoading = ref(true)
const selfData = ref({
  high: 0,
  low: 0
})

const featuredTradeList = computed(() => lineDataList.value.slice(0, 4))
const featuredNewsList = computed(() => newsList.value.slice(0, 3))

const getData = () => {
  homeNoitceBarInfo().then(res => {
    if (res.status > 0) {
      noticeTxt.value = res.content
    }
  })

  getNewsList({
    pos: 1,
    size: 10,
    page: 1
  }).then(res => {
    newsList.value = res.list
  }).finally(() => {
    showNewsSeketLoading.value = false
  })

  getTradeProduct({
    vol: 1,
    size: 10
  }).then(res => {
    lineDataList.value = res
  }).finally(() => {
    showSeketLoading.value = false
  })

  getStockIndexList().then(res => {
    selectStockInfo.value = res.index[0]
    if (selectStockInfo.value.chart) {
      HomeKlineRef.value.initKlineData(selectStockInfo.value.chart)
      selfData.value.high = selectStockInfo.value.chart.meta.regularMarketDayHigh
      selfData.value.low = selectStockInfo.value.chart.meta.regularMarketDayLow
    }
  })
}

const updateHomeKlineTopData = data => {
  homeKlineEmitData.value = data
}

const goNewsDetail = item => {
  if (item.type !== 2) {
    pub.selectNews = item
    router.push('/mine/newsDetail')
  } else {
    window.open(item.url)
  }
}

const useSocketStore = socketStore()
const goTrade = item => {
  useSocketStore.currentCoin = item
  router.push('/trade')
}

const loginStore = useLoginStore()
onMounted(() => {
  if (loginStore.loading) {
    loginStore.loading = false
  }
  pub.ipoActRecordType = 0
  pub.spoActRecordType = 0
  pub.actRecordType = 3
  getData()
})
</script>

<template>
  <section>
    <ClientOnly>
      <div class="min-h-full">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="tabbarPageTopNav flex items-center justify-between gap-3 px-4 py-3" :class="isSticky ? 'topStickyEl' : ''">
            <div class="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 backdrop-blur-[2px]">
              <van-notice-bar scrollable :text="noticeTxt" background="transparent" color="#fff" />
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full bg-white/12" @click="changePage('/setting/identify')">
                <img src="~/assets/images/icon/notice.png" class="h-5 w-5" alt="" />
              </button>
              <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full bg-white/12" @click="changePage('/service')">
                <img src="~/assets/images/icon/service.png" class="h-5 w-5" alt="" />
              </button>
            </div>
          </div>
        </van-sticky>

        <div class="pageContainer mt-3 space-y-5 px-4 pb-2">
          <div class="rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#eef3ff_100%)] p-3 shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(item, index) in commList"
                :key="index"
                type="button"
                class="flex min-w-0 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition-colors duration-200 hover:bg-white/60"
                @click="changePage(item.url)"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#2D57FF_0%,#244ee6_100%)] shadow-[0_10px_18px_rgba(45,87,255,0.16)]">
                  <img :src="item.icon" class="h-8 w-8" alt="" />
                </div>
                <div class="line-clamp-2 text-[0.8125rem] font-semibold leading-[1.35] tracking-[-0.01em] text-[#243253]">{{ item.name }}</div>
              </button>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,#dfe7ff_0%,#ffffff_22%,#ffffff_100%)] shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
            <div class="px-4 pt-4">
              <div class="text-[1.0625rem] font-extrabold leading-tight tracking-[-0.01em] text-[#243253]">{{ selectStockInfo.exchange_name }}</div>
              <div class="mt-4 flex flex-col gap-4 min-[421px]:flex-row min-[421px]:items-start min-[421px]:justify-between">
                <div class="w-full min-[421px]:w-[34%]" :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                  <div class="text-[2rem] font-black leading-none tracking-[-0.03em] tabular-nums">{{ UseExchangeNumber(selectStockInfo.price) }}</div>
                  <div class="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[0.875rem] font-semibold tabular-nums">
                    <span>{{ getNumberType(true, selectStockInfo.is_rise) + UseExchangeNumber(selectStockInfo.chart.rise) }}</span>
                    <span>{{ getNumberType(true, selectStockInfo.is_rise) + selectStockInfo.rise_rate }} %</span>
                  </div>
                </div>
                <div class="colorSecond grid w-full grid-cols-2 gap-x-5 gap-y-4 text-[0.8125rem] min-[421px]:w-[40%]">
                  <div class="space-y-[6px]">
                    <div class="font-medium tracking-[0.02em] text-[#5f7090]">{{ $t('index.i19') }}</div>
                    <div class="text-[0.9375rem] font-bold tracking-[-0.01em] tabular-nums text-[#243253]">{{ UseExchangeNumber(selfData.high) }}</div>
                  </div>
                  <div class="space-y-[6px]">
                    <div class="font-medium tracking-[0.02em] text-[#5f7090]">{{ $t('index.i20') }}</div>
                    <div class="text-[0.9375rem] font-bold tracking-[-0.01em] tabular-nums text-[#243253]">{{ UseExchangeNumber(selfData.low) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5 border-t border-[rgba(45,87,255,0.10)] px-3 pt-4">
              <ClientOnly>
                <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData"></HomeKLine>
              </ClientOnly>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-[1.0625rem] font-extrabold leading-tight tracking-[-0.01em] text-[#243253]">{{ $t('index.i21') }}</div>
              <button type="button" class="flex items-center gap-1 text-[0.875rem] font-semibold leading-none text-[var(--mainColor)]" @click="changePage('/tabbar/market?type=1')">
                {{ $t('index.i22') }}
                <Icon name="solar:alt-arrow-right-bold"></Icon>
              </button>
            </div>

            <div class="flex gap-3 overflow-x-auto pb-1">
              <div
                v-if="showSeketLoading"
                v-for="(item, index) in 3"
                :key="index"
                class="h-[170px] w-[42%] shrink-0 animate-pulse rounded-2xl bg-[#eaf0ff]"
              ></div>

              <button
                v-else
                v-for="(item, index) in featuredTradeList"
                :key="item.pro_code || index"
                type="button"
                class="w-[42%] shrink-0 overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white text-left shadow-[0_12px_28px_rgba(2,26,123,0.10)]"
                @click="goTrade(item)"
              >
                <div class="bg-[linear-gradient(135deg,#2D57FF_0%,#244ee6_100%)] px-3 py-2 text-center">
                  <div class="truncate text-[0.9375rem] font-semibold leading-[1.25] tracking-[-0.01em] colorfff">{{ item.pro_name }}</div>
                  <div class="mt-1 text-[0.75rem] font-medium tracking-[0.04em] text-[#FFDA1C]">{{ item.pro_code }}</div>
                </div>
                <div class="px-3 py-3">
                  <div>
                    <div class="text-[1.375rem] font-black tracking-[-0.03em] tabular-nums text-[#243253]">{{ item.price }}</div>
                    <div class="mt-2 flex items-center justify-between gap-2 text-[0.8125rem] font-semibold tabular-nums"
                      :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                      <div>{{ getNumberType(true, item.is_rise) + item.rise }}</div>
                      <div>{{ getNumberType(true, item.is_rise) + item.rise_rate }}%</div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-[1.0625rem] font-extrabold leading-tight tracking-[-0.01em] text-[#243253]">{{ t('x.a8') }}</div>
              <button type="button" class="flex items-center gap-1 text-[0.875rem] font-semibold leading-none text-[var(--mainColor)]" @click="changePage('/tabbar/news')">
                {{ $t('index.i23') }}
                <Icon name="solar:alt-arrow-right-bold"></Icon>
              </button>
            </div>

            <div class="space-y-3">
              <div v-if="showNewsSeketLoading" v-for="item in 4" :key="item" class="h-[92px] animate-pulse rounded-2xl bg-[#eaf0ff]"></div>

              <button
                v-else
                v-for="(item, index) in featuredNewsList"
                :key="index"
                type="button"
                class="w-full rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white p-4 text-left text-base shadow-[0_12px_28px_rgba(2,26,123,0.10)]"
                @click="goNewsDetail(item)"
              >
                <div class="line-clamp-2 font-semibold leading-[1.55] tracking-[-0.01em] text-[#243253]">{{ item.name }}</div>
                <div class="mt-3 text-[0.8125rem] font-medium color999">{{ item.show_time_format }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
    <Tabbar />
  </section>
</template>
