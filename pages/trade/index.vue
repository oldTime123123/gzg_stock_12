<script setup lang="ts">
import { showToast } from 'vant';
import { getProductInfo } from '~/api/home/home';
import { subBuyStockHandle } from '~/api/trade';

import socket from "~/utils/socket.ts";
import { stockCollect } from '../../api/home/home';
import { computed } from 'vue';
const { t, locale } = useI18n()

const useSocketStore = socketStore();
const selectCurrentStock = computed(() => {
  return useSocketStore.currentCoin
})

const priceVal = ref(1)
const numVal = ref(1)

const normalizeTradeNumber = (value: unknown, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const safePriceVal = computed(() => normalizeTradeNumber(priceVal.value, topStockData.value.price || 0))
const safeNumVal = computed(() => {
  const num = normalizeTradeNumber(numVal.value, 1)
  return num < 1 ? 1 : num
})

const actTimeEl = ref(0)
//  type: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const selectTimeList = [
  {
    name: t('trade.t39'),
    value: '1d_1m',
    type:'second'
  },
  {
    name: t('trade.t40'),
    value: '5d_2m',
    type:'day'
  },
  {
    name: t('trade.t41'),
    value: '1y_1d',
    type:'hour',
  },
  {
    name: t('trade.t42'),
    value: '2y_1wk',
    type: 'week',

  },
  {
    name: t('trade.t43'),
    value: '15y_1mo',
    type: 'month',

  },
  {
    name: t('trade.t44'),
    value: '30y_3mo',
    type: 'year',

  }
]
// 修改周期
const changeActTimeType = (index) => {
  pub.showLoading = true
  actTimeEl.value = index
  TradeKlineRef.value.showSkeletonLoading = true
  socketParams.value.range = selectTimeList[actTimeEl.value].value
  socket.emit('yahoo', {
    ...socketParams.value
  })
}
const pub = usePublicStore()
const socketParams = ref({
  pro_code: "",
  range: "1d_1m"
})
const buyType = ref(0)
const productInfo = ref({})
const isCollect = ref(0)
const getData = () => {
  getProductInfo({ pid: selectCurrentStock.value.id }).then(res => {
    productInfo.value = res
    userBalance.value = res.balance
    selfData.value.high =res.pro_info.high
    selfData.value.low = res.pro_info.low
    isCollect.value = res.pro_info.isCollect
    // priceVal.value  = res.pro_info.price
  }).finally(() => {
  })
}
const TradeKlineRef = ref("")
const socketTimer = ref("")
const selfData = ref({
  high: 0,
  low: 0
})
const topStockData = ref({
  price: 0,
  rise: 0,
  is_rise: 0,
  rise_rate: 0,
})
const startSocketTimerHandle = () => {
  // socket.emit('yahoo', {
  //     ...socketParams.value
  // })
  if(socketTimer.value){
    clearInterval(socketTimer.value)
    socketTimer.value = null
  }
  socketTimer.value = setInterval(() => {
    socketParams.value.range = selectTimeList[actTimeEl.value].value
    socket.emit('yahoo', {
      ...socketParams.value
    })
  }, 1500);

}
const topData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
})
const isChangeType = ref(false)
const updateHomeKlineTopData = data => {
  topData.value = data
  const closePrice = normalizeTradeNumber(data.close, topStockData.value.price || 0)
  topStockData.value.price = closePrice
  if (!isChangeType.value) {
    priceVal.value = closePrice
    isChangeType.value = true
  }
}
const changeActTradeType = index => {
  actTradeType.value = index
  isChangeType.value = false
}
socket.on('yahoo', (data: any) => {
  pub.showLoading = false
  if (TradeKlineRef.value && data.info.chart && data.info.chart.result[0]) {
    topStockData.value.is_rise = data.info.chart.result[0].is_rise
    topStockData.value.rise = data.info.chart.result[0].rise
    topStockData.value.rise_rate = data.info.chart.result[0].rise_rate
    TradeKlineRef.value.updateKlineData(data.info.chart.result[0], selectTimeList[actTimeEl.value].type)
  }
})
const stockStatus = computed(() => {
  return pub.stockStatus
})
onBeforeMount(() => {
  socketParams.value.pro_code = selectCurrentStock.value.pro_code
  // 获取k线
  socket.emit('yahoo', {
      ...socketParams.value
  })
  if (stockStatus.value == 1) {
    startSocketTimerHandle()
  } else {
    if (socketTimer.value) {
      clearInterval(socketTimer.value)
      socketTimer.value = null
    }
  }
})

watch(stockStatus, val => {
  if (val == 1) {
    // 开盘
    startSocketTimerHandle()
  } else {
    // 收盘
    if (socketTimer.value) {
      clearInterval(socketTimer.value)
      socketTimer.value = null
    }
  }
})

onMounted(() => {
  getData()
  // priceVal.value = selectCurrentStock.value.price
})

onUnmounted(() => {
  if (socketTimer.value) {
    clearInterval(socketTimer.value)
  }
})

const actTradeType = ref(0)
const tradeType = [
  t('trade.t45'),
  t('trade.t46')
]

const showBottom = ref(false)
const userStore = useUserStore()
const userBalance = ref(0)
const confirmHandle = () => {
  showBottom.value = false

  const buyData = {
    pid: selectCurrentStock.value.id,
    num: safeNumVal.value,
    deal_type: actTradeType.value < 1 ? '2' : '1', //2 限价。1 市价
    type: Number(buyType.value) + 1 //1.买涨 2.买跌
  }
  if (buyData.deal_type == 2) {
    buyData.limit_price = safePriceVal.value
  }
  pub.showLoading = true
  subBuyStockHandle(buyData).then(res => {
    showToast(t('trade.t47'))
    numVal.value = 1
    priceVal.value = normalizeTradeNumber(topStockData.value.price, 0)

  })
}
const subPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
  if (currentPrice > 1) {
    priceVal.value = normalizeTradeNumber(UseExchangeNumber(currentPrice - 1), 0)
  } else if (currentPrice > 0) {
    priceVal.value = normalizeTradeNumber(UseExchangeNumber(currentPrice - 0.1), 0)
    if (priceVal.value < 0) {
      priceVal.value = 0
    }
  }
}

const addPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
  priceVal.value = normalizeTradeNumber(UseExchangeNumber(currentPrice + 1), currentPrice + 1)
}

const subNumVal = () => {
  const currentNum = normalizeTradeNumber(numVal.value, 1)
  if (currentNum > 1) {
    numVal.value = currentNum - 1
  }
}

const addNumVal = () => {
  const currentNum = normalizeTradeNumber(numVal.value, 1)
  numVal.value = currentNum + 1
}

const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  priceVal.value = input.value.replace(/[^\d.]/g, '')
}

const handleNumInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  numVal.value = input.value.replace(/[^\d]/g, '')
}

const handlePriceBlur = () => {
  priceVal.value = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
}

const handleNumBlur = () => {
  numVal.value = safeNumVal.value
}

// priceVal * numVal * productInfo.fee_rate
const feeVal = computed(() => {
  let val = 0
  if (productInfo.value.fee_rate) {
    val = Number(safePriceVal.value * safeNumVal.value * productInfo.value.fee_rate).toFixed(2)
  }
  return val
})

const collectHandle = () => {
  isCollect.value= !isCollect.value
  stockCollect({
    pid: selectCurrentStock.value.id,
    status: isCollect.value? 1: 2
  }).then(res => {
    if (isCollect.value) {
    showToast(t('comm.c67'))

    } else {
      showToast(t('xx.a2'))

    }
  })
}

</script>

<template>
  <div>
    <ClientOnly>
      <second-page-nav-bar :title="selectCurrentStock.pro_name">
          <Icon name="tabler:star-filled" size="25" :class="isCollect ? ' text-amber-300' : 'text-gray-300'"
            @click="collectHandle" />

      </second-page-nav-bar>

      <div class="px-3 pt-3">
        <!--  line-->
        <div class="lineBox mt-3 py-3 rounded-xl">
          <div class="px-3">
            <div class="text-sm">
              {{ selectCurrentStock.pro_code }}
            </div>
            <div class="flex justify-between  mt-1 aligns-center">
              <div class="w-1/3 " :class="selectCurrentStock.is_rise > 1 ? 'colorUp' : 'colorDown'">
                <div class="font-black">
                  {{ UseExchangeNumber(safePriceVal) }}
                </div>
                <div class="flex  gap-2 items-center text-xs ">
                  <span>{{ getNumberType(true, selectCurrentStock.is_rise)+ UseExchangeNumber(topStockData.rise)
                    }}</span>
                  <span class="">{{ getNumberType(true, selectCurrentStock.is_rise) + topStockData.rise_rate }} %</span>
                </div>
              </div>
              <div class=" colorSecond text-xs grid grid-cols-2  gap-x-4 gap-y-1  justify-between  ">
                <div class="">
                  {{ $t('trade.t49') }}: {{ UseExchangeNumber(topData.open) }}
                </div>
                <div class="">
                  {{ $t('trade.t50') }}:{{ UseExchangeNumber(topData.close) }}
                </div>
                <div class="">
                  {{ $t('trade.t51') }}: {{ UseExchangeNumber(selfData.high) }}
                </div>
                <div class="">
                  {{ $t('trade.t52') }}:{{ UseExchangeNumber(selfData.low) }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 flex  overflow-x-auto gap-4 px-1 bg-[#2D57FF] py-1">
            <div v-for="(item, index) in selectTimeList" class="p-2 shrink-0  cursor-pointer  rounded-xl"
              :class="index == actTimeEl ? 'bg-white mainTextColor' : 'colorfff'" :key="index"
              @click="changeActTimeType(index)"> {{ item.name
              }}</div>

          </div>
          <div class="mt-3 px-3">
            <TradeKline ref="TradeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
          </div>
        </div>

        <div class="mt-5 ">
          <div class="tradeContentBoxEl rounded-lg overflow-hidden">
            <div class="bg-[#2D57FF] px-1.5 py-2 flex items-center justify-between ">
              <div class="colorfff">{{ $t('trade.t53') }}</div>
              <div class="bg-[#FFDA1C] rounded-sm p-0.5   grid grid-cols-2">
                <div v-for="(item, index) in tradeType" :key="index" class="px-3 py-1 cursor-pointer rounded-lg"
                  :class="index == actTradeType ? 'bg-[#2D57FF] colorfff' : 'color000'"
                  @click="changeActTradeType(index)">{{ item }}</div>
              </div>
            </div>
            <div class="px-1.5 py-2">
              <div v-if="actTradeType == 0">
                <div class="font-bold">{{ $t('trade.t54') }}</div>
                <div class="mt-2 flex justify-between items-center   borderB pb-2  ">
                  <Icon class="w-7 h-7  cursor-pointer" :class="priceVal > 0 ? 'mainTextColor' : 'color999'"
                    @click="subPriceVal" name="line-md:minus-square-filled" />
                  <div class="flex-1 mx-1">
                    <input
                      type="text"
                      inputmode="decimal"
                      class="w-full text-center"
                      :value="priceVal"
                      @input="handlePriceInput"
                      @blur="handlePriceBlur"
                    >
                  </div>
                  <Icon class="w-7 h-7 mainTextColor cursor-pointer" name="line-md:plus-square-filled"
                    @click="addPriceVal" />

                </div>
              </div>
              <div class="mt-3">
                <div class="font-bold">{{ $t('trade.t55') }}</div>
                <div class="mt-2 flex justify-between items-center   borderB pb-2  ">
                  <Icon class="w-7 h-7 cursor-pointer " :class="safeNumVal > 1 ? 'mainTextColor' : 'color999'"
                    @click="subNumVal" name="line-md:minus-square-filled" />
                  <div class="flex-1 mx-1">
                    <input
                      type="text"
                      inputmode="numeric"
                      class="w-full text-center"
                      :value="numVal"
                      @input="handleNumInput"
                      @blur="handleNumBlur"
                    >
                  </div>
                  <Icon class="w-7 h-7 mainTextColor cursor-pointer" @click="addNumVal"
                    name="line-md:plus-square-filled" />

                </div>
              </div>
              <!-- <div class="mt-3 grid grid-cols-2 gap-6 ">
                <div :class="buyType == 0 ? 'contentBtn' : 'borderContentBtn'" @click="buyType = 0">
                  {{ $t('trade.t56') }}
                </div>
                <div :class="buyType == 1 ? 'contentBtn' : 'borderContentBtn'" @click="buyType = 1">
                  {{ $t('trade.t57') }}
                </div>
              </div> -->
            </div>
          </div>

        </div>

        <div class="mt-4">
          <div class="contentBtn" @click="showBottom = true">
            {{ $t('trade.t58') }}
          </div>
          <div class="mt-3 text-xs ">
            <div class="text-[#8E8E8E]">{{ $t('trade.t59') }}</div>
            <div class="mt-2 text-[#8E8E8E]">
              {{ $t('trade.t60') }}
            </div>
          </div>
        </div>
      </div>
      <van-popup class="" v-model:show="showBottom" round position="bottom">
        <div class="p-4  ">
          <div class="text-center font-bold text-lg">{{ $t('trade.t61') }}</div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t62') }}</div>
            <div :class="getNumberClass(true, buyType==0?2:1)"> {{ actTradeType == 0 ? $t('trade.t45') :
              $t('trade.t46') }}{{ buyType < 1 ? '--' + $t('trade.t56') : '--' + $t('trade.t57') }}
            </div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t63') }}</div>
            <div>{{ safeNumVal }} {{ $t('trade.t64') }}</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t65') }}</div>
            <div>X1</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t67') }}/{{ t('x.a9') }}</div>
            <div>{{ UseExchangeNumber(safePriceVal) }}</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t68') }}</div>
            <div>{{ UseExchangeNumber(safePriceVal * safeNumVal) }}</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t69') }}</div>
            <div>{{ feeVal }}</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t70') }}</div>
            <div>{{ UseExchangeNumber(safePriceVal * safeNumVal + Number(feeVal - 0)) }}</div>
          </div>
          <div class="items-center flex justify-between mt-2">
            <div>{{ $t('trade.t71') }}</div>
            <div>{{ userBalance }}</div>
          </div>
          <div class="contentBtn mt-3" @click="confirmHandle">{{ $t('trade.t72') }}</div>
        </div>
      </van-popup>
    </ClientOnly>
  </div>
</template>


<style lang="less" scoped>
.lineBox {
  background: linear-gradient(180deg, #DFE5FF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
}

.tradeContentBoxEl {
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
}

.borderB {
  border-bottom: 1px solid #B2D2FA;
}

// :deep(.van-tabs__nav){
//     background: transparent;

// }
::-webkit-scrollbar {
  display: none;
}
</style>
