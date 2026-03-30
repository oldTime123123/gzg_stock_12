<script lang="ts" setup>
import { LineOption } from '~/utils/indexLineStyle';
import iCom1 from '~/assets/images/icon/i_com1.png';
import iCom2 from '~/assets/images/icon/i_com2.png';
import iCom3 from '~/assets/images/icon/i_com3.png';
import iCom4 from '~/assets/images/icon/i_com4.png';

import iSCom1 from '~/assets/images/icon/i_s_com1.png';
import iSCom2 from '~/assets/images/icon/i_s_com2.png';
import iSCom3 from '~/assets/images/icon/i_s_com3.png';
import iSCom4 from '~/assets/images/icon/i_s_com4.png';

import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';
const { t, locale } = useI18n()
import { homeNoitceBarInfo, getNewsList, getTradeProduct, getStockIndexList } from '~/api/home/home'
import HomeLoading from '../components/HomeLoading.vue';
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

    // {
    //   name: 'IPO',
    //   icon: iSCom1,
    //   url: '/trade/ipoRecord'
    // },
    // {
    //   name:  t('index.i14'),
    //   icon: iSCom2,
    //   url: '/trade/dailyRecord'
    // },

    {
      name: t('index.i16'),
      icon: iSCom4,
      url: '/loan'

    },
  ]
});

// const commSList = computed(() => {
//   return [

//   ]
// });

const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val
};

const lineDataList = ref([])


const router = useRouter()
const changePage = (url: any) => {
  if (url) {
    router.push(url)

  }
}
const newsList = ref([])
const pub = usePublicStore();
const noticeTxt = ref("")
const selectStockInfo = ref({
  price: 0,
  chart: {
    rise_rate: 0,
    rise: 0,
  },
  rise_rate: 0
})
const HomeKlineRef = ref("")
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
    // console.log('res',res);
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
    // console.log('', selectStockInfo.value);
    if (selectStockInfo.value.chart) {
      HomeKlineRef.value.initKlineData(selectStockInfo.value.chart)
      selfData.value.high = selectStockInfo.value.chart.meta.regularMarketDayHigh
      selfData.value.low = selectStockInfo.value.chart.meta.regularMarketDayLow
    }


  })
}
const changeLineTypeData = data => {
  const result = Array(100).fill(null).map((_, i) => data[i] ?? null);
  for (let i = 1; i < 100; i++) {
    if (result[i] == null) {
      result[i] = result[i - 1];
    }
  }

  return result;
}

const updateHomeKlineTopData = (data) => {
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


const loginStore = useLoginStore();
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
      <div class="hasNormalBg">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="px-3 py-3 flex justify-between items-center tabbarPageTopNav"
            :class="isSticky ? 'topStickyEl' : ''">
            <div class="noticeContent w-4/5">
              <van-notice-bar scrollable :text="noticeTxt" background="transparent" color="#fff" />
            </div>
            <div class="flex flex-row-reverse ml-5 w-1/5">
              <img src="~/assets/images/icon/notice.png" class="w-8 h-8 cursor-pointer "
                @click="changePage('/setting/identify')" />

              <img src="~/assets/images/icon/service.png" class="w-8 h-8 mx-3 cursor-pointer"
                @click="changePage('/service')" />
            </div>
          </div>
        </van-sticky>
        <div class="pageContainer px-3 mt-3">
          <div class="commBoxEl  gap-2 grid grid-cols-3 py-2 rounded-2xl">
            <div class="relative cursor-pointer  w-full" v-for="(item, index) in commList" @click="changePage(item.url)"
              :key="index">
              <div class="flex flex-col items-center pb-1  ">
                <img :src="item.icon" class="w-10 h-10" />
                <div class="commWord mt-1 pt-2  w-full px-2 line-clamp-2 ">
                  <div class="font-black     text-center text-xs ">{{ item.name }}</div>

                </div>
              </div>
            </div>


          </div>

          <div class="lineBox mt-3 p-3 rounded-xl">
            <div class="text-lg font-bold">
              {{ selectStockInfo.exchange_name }}
            </div>
            <div class="flex justify-between  mt-1 aligns-center">
              <div class="w-1/3 " :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                <div class="font-black">
                  {{ UseExchangeNumber(selectStockInfo.price) }}
                </div>
                <div class="flex justify-between items-center text-xs ">
                  <span>{{ getNumberType(true, selectStockInfo.is_rise) + UseExchangeNumber(selectStockInfo.chart.rise) }}</span>
                  <span class="">{{ getNumberType(true, selectStockInfo.is_rise) + selectStockInfo.rise_rate }} %</span>
                </div>
              </div>
              <div class=" colorSecond text-xs grid grid-cols-2  gap-x-4 gap-y-1  justify-between  ">
                <div class="">
                  {{ $t('index.i17') }}: {{ UseExchangeNumber(homeKlineEmitData.open) }}
                </div>
                <div class="">
                  {{ $t('index.i18') }}:{{ UseExchangeNumber(homeKlineEmitData.close) }}
                </div>
                <div class="">
                  {{ $t('index.i19') }}: {{ UseExchangeNumber(selfData.high) }}
                </div>
                <div class="">
                  {{ $t('index.i20') }}:{{ UseExchangeNumber(selfData.low) }}
                </div>
              </div>
            </div>

            <div class="mt-5 bg-gray-300 h-px">

            </div>
            <div class="mt-3">
              <ClientOnly>
                <!-- 可选：加载时的占位符 -->
                <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData"></HomeKLine>
              </ClientOnly>
            </div>
          </div>


        </div>
        <div class="px-3 mt-4">
          <div class="flex justify-between items-center">
            <div class="hasBotLine  ">
              <span class="z-10 relative font-black text-base">{{ $t('index.i21') }}</span>
            </div>
            <div class="flex items-center cursor-pointer justify-center text-sm colorfff titleRightBg "
              @click="changePage('/tabbar/market?type=1')">
              {{ $t('index.i22') }}
              <Icon name="solar:alt-arrow-right-bold"></Icon>
            </div>
          </div>
        </div>

        <div class=" mt-3 ">
          <div class="flex  overflow-x-auto space-x-3 px-3  pb-4">
            <div v-if="showSeketLoading"
              class="proGoodsItemEl s h-[150px] animate-pulse cursor-pointer pb-1 w-2/5 shrink-0 rounded-2xl"
              v-for="(item, index) in 3" :key="index">

            </div>
            <div v-else class="proGoodsItemEl cursor-pointer pb-1 w-2/5 shrink-0 rounded-2xl"
              v-for="item in lineDataList" :key="item" @click="goTrade(item)">
              <div class="header text-center">
                <div class=" colorfff text-base pt-1 truncate">{{ item.pro_name }}</div>
                <div class="text-xs currentVal pb-1 mt-1">{{ item.pro_code }}</div>
              </div>
              <div class=" mt-1">
                <div class="" style="height: 50px;" v-if="item.chart.length > 0">
                  <ClientOnly>
                    <apexchart width="100%" height="50" type="area" :options="LineOption"
                      :series="[{ data: changeLineTypeData(item.chart.indicators.quote[0].close) }]" />

                    <!-- 可选：加载时的占位符 -->
                    <template #fallback>
                      <div class="h-[0px]  w-full bg-gray-100 animate-pulse rounded"></div>
                    </template>
                  </ClientOnly>
                </div>
                <div class="px-2">

                  <div class="text-base font-black mt-1">
                    {{ item.price }}
                  </div>
                  <div class="mt-1  text-xs flex justify-between items-center"
                    :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                    <div class="font-black">{{ getNumberType(true, item.is_rise) + item.rise }}</div>
                    <div class="flex items-center">{{ getNumberType(true, item.is_rise) + item.rise_rate }}%
                      <img :src="item.is_rise > 1 ? upIcon : downIcon" class="w-3 h-3">
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div class="px-3 ">
            <div class="flex justify-between items-center">
              <div class="hasBotLine  ">
                <span class="z-10 relative font-black text-base">{{ t('x.a8') }}</span>
              </div>
              <div class="flex items-center justify-center cursor-pointer text-sm colorfff titleRightBg "
                @click="changePage('/tabbar/news')">
                {{ $t('index.i23') }}
                <Icon name="solar:alt-arrow-right-bold"></Icon>
              </div>
            </div>
          </div>
          <div class="px-3 mt-3">
            <div v-if="showNewsSeketLoading"
              class="newItemEl text-sm h-[80px] cursor-pointer animate-pulse my-4 p-3 rounded-2xl" v-for="item in 4">
            </div>
            <div v-else class="newItemEl text-sm cursor-pointer my-4 p-3 rounded-2xl" v-for="(item, index) in newsList"
              :key="index" @click="goNewsDetail(item)" :class="`newItemEl${item}`">
              <div class="newsContent">
                {{ item.name }}
              </div>
              <div class="newsBot text-xs mt-2 color999">
                {{ item.show_time_format }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </ClientOnly>
    <Tabbar />
  </section>
</template>


<style lang="less" scoped>
:deep(.apexcharts-tooltip-candlestick) {
  padding: 10px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

:deep(.apexcharts-tooltip-candlestick div) {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.newItemEl {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);



  .leftBorderBlue {
    background: #E5F0FE;
    border-radius: 2px 2px 2px 2px;
    color: var(--mainColor);
  }
}

// 定义循环生成样式
each(range(3), {
  .newItemEl@{value} {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: -15px;
      left: 0;
      width: 30px;
      height: 30px;
      z-index: 0;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url('~/assets/images/icon/i_n@{value}.png');
    }
  }
});

.proGoodsItemEl {
  background: linear-gradient(180deg, #DFE5FF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  overflow: hidden;

  .header {
    background: var(--mainColor);
  }

  .currentVal {
    color: #FFDA1C;
  }
}

::-webkit-scrollbar {
  display: none;
}

.titleRightBg {
  background: url('~/assets/images/icon/i_rightBg.png') no-repeat;
  background-size: contain;
  width: 105px;
  height: 28px;
}

.hasBotLine {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #2D57FF 0%, rgba(27, 52, 153, 0) 100%);
    border-radius: 10px 0 0 10px;
    z-index: 0;
  }
}

.noticeContent {
  background: url('~/assets/images/img/noticeC.png') no-repeat;
  background-size: 100%;
  padding-left: 30px;
  padding-top: 3px;

}

.commBoxEl {
  background: linear-gradient(180deg, #FFFFFF 0%, #DFE5FF 100%);

  .commWord {
    background: url('~/assets/images/icon/i_c_shad.png') no-repeat;
    background-size: 100%;
    background-position: top center;
  }
}

.shadEl {
  width: 100%;
  left: 50%;
  bottom: 25px;
  z-index: 0;
  filter: blur(4px);
  transform: translateX(-50%);
}

.secCommItemEl {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 62px;
  color: #fff;
}

.lineBox {
  background: linear-gradient(180deg, #DFE5FF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
}
</style>
