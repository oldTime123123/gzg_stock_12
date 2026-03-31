<script setup lang="ts">
import { computed } from 'vue'
import { showToast } from 'vant'
import { getProductInfo, stockCollect } from '~/api/home/home'
import { subBuyStockHandle } from '~/api/trade'
import socket from '~/utils/socket.ts'

type TimeRangeType = 'second' | 'day' | 'hour' | 'week' | 'month' | 'year'

interface TimeOption {
  name: string
  value: string
  type: TimeRangeType
}

interface ProductResponse {
  balance?: number | string
  fee_rate?: number | string
  pro_info?: {
    high?: number | string
    low?: number | string
    isCollect?: number | boolean
  }
}

interface SocketChartPayload {
  info?: {
    chart?: {
      result?: Array<any>
    }
  }
}

interface TradeKlineExpose {
  updateKlineData: (rawData: any, timeType: TimeRangeType) => void
  showSkeletonLoading?: { value: boolean } | boolean
}

const { t } = useI18n()
const pub = usePublicStore()
const useSocketStore = socketStore()

const selectCurrentStock = computed(() => useSocketStore.currentCoin || {})
const selectedStockName = computed(() => selectCurrentStock.value?.pro_name || '--')

const priceVal = ref<number | string>(1)
const numVal = ref<number | string>(1)
const actTimeEl = ref(0)
const actTradeType = ref(0)
const buyType = ref(0)
const showBottom = ref(false)
const isCollect = ref(0)
const collectLoading = ref(false)
const submitLoading = ref(false)
const isManualPriceEdited = ref(false)

const productInfo = ref<ProductResponse>({})
const userBalance = ref(0)
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
const topData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
})
const socketParams = ref({
  pro_code: '',
  range: '1d_1m'
})
const socketTimer = ref<ReturnType<typeof setInterval> | null>(null)
const TradeKlineRef = ref<TradeKlineExpose | null>(null)

const normalizeTradeNumber = (value: unknown, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const roundPrice = (value: number) => Number(value.toFixed(2))

const formatTradeValue = (value: unknown) => {
  return UseExchangeNumber(normalizeTradeNumber(value, 0))
}

const sanitizeDecimalInput = (value: string) => {
  const sanitized = value.replace(/[^\d.]/g, '')
  const [integer = '', ...decimals] = sanitized.split('.')
  const decimalPart = decimals.join('').slice(0, 2)
  return decimals.length ? `${integer}.${decimalPart}` : integer
}

const sanitizeIntegerInput = (value: string) => {
  return value.replace(/[^\d]/g, '').replace(/^0+(\d)/, '$1')
}

const selectTimeList = computed<TimeOption[]>(() => [
  {
    name: t('trade.t39'),
    value: '1d_1m',
    type: 'second'
  },
  {
    name: t('trade.t40'),
    value: '5d_2m',
    type: 'day'
  },
  {
    name: t('trade.t41'),
    value: '1y_1d',
    type: 'hour',
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
])

const currentTimeOption = computed(() => {
  return selectTimeList.value[actTimeEl.value] || selectTimeList.value[0]
})

const tradeTypeList = computed(() => [
  t('trade.t45'),
  t('trade.t46')
])

const directionList = computed(() => [
  {
    label: t('trade.t56'),
    value: 0,
    riseType: 2
  },
  {
    label: t('trade.t57'),
    value: 1,
    riseType: 1
  }
])

const stockStatus = computed(() => pub.stockStatus)
const safePriceVal = computed(() => normalizeTradeNumber(priceVal.value, topStockData.value.price || 0))
const safeNumVal = computed(() => {
  const num = Math.floor(normalizeTradeNumber(numVal.value, 1))
  return num < 1 ? 1 : num
})
const feeAmount = computed(() => {
  const rate = normalizeTradeNumber(productInfo.value.fee_rate, 0)
  return roundPrice(safePriceVal.value * safeNumVal.value * rate)
})
const totalAmount = computed(() => {
  return roundPrice(safePriceVal.value * safeNumVal.value + feeAmount.value)
})
const displayPriceClass = computed(() => {
  return topStockData.value.is_rise > 1 ? 'colorUp' : 'colorDown'
})
const directionRiseType = computed(() => directionList.value[buyType.value]?.riseType ?? 2)
const canSubmit = computed(() => {
  if (!selectCurrentStock.value?.id) return false
  if (safeNumVal.value < 1) return false
  if (actTradeType.value === 0 && safePriceVal.value <= 0) return false
  return totalAmount.value > 0 && !submitLoading.value
})

const setKlineLoading = (status: boolean) => {
  if (!TradeKlineRef.value?.showSkeletonLoading) return

  if (typeof TradeKlineRef.value.showSkeletonLoading === 'object') {
    TradeKlineRef.value.showSkeletonLoading.value = status
  }
}

const stopSocketTimerHandle = () => {
  if (socketTimer.value) {
    clearInterval(socketTimer.value)
    socketTimer.value = null
  }
}

const requestQuoteUpdate = () => {
  if (!socketParams.value.pro_code) return

  socketParams.value.range = currentTimeOption.value.value
  socket.emit('yahoo', {
    ...socketParams.value
  })
}

const startSocketTimerHandle = () => {
  stopSocketTimerHandle()
  socketTimer.value = setInterval(() => {
    requestQuoteUpdate()
  }, 1500)
}

const getData = () => {
  if (!selectCurrentStock.value?.id) return

  getProductInfo({ pid: selectCurrentStock.value.id }).then((res: ProductResponse) => {
    productInfo.value = res
    userBalance.value = normalizeTradeNumber(res.balance, 0)
    selfData.value.high = normalizeTradeNumber(res.pro_info?.high, 0)
    selfData.value.low = normalizeTradeNumber(res.pro_info?.low, 0)
    isCollect.value = Number(res.pro_info?.isCollect || 0)
  })
}

const updateHomeKlineTopData = (data: any) => {
  topData.value = data
  const closePrice = normalizeTradeNumber(data.close, topStockData.value.price || 0)
  topStockData.value.price = closePrice

  if (!isManualPriceEdited.value) {
    priceVal.value = closePrice
  }
}

const changeActTimeType = (index: number) => {
  if (index === actTimeEl.value) return

  pub.showLoading = true
  actTimeEl.value = index
  setKlineLoading(true)
  requestQuoteUpdate()
}

const changeActTradeType = (index: number) => {
  if (index === actTradeType.value) return

  actTradeType.value = index

  if (index === 1) {
    priceVal.value = normalizeTradeNumber(topStockData.value.price, safePriceVal.value)
    isManualPriceEdited.value = false
  }
}

const handleYahooMessage = (data: SocketChartPayload) => {
  pub.showLoading = false
  const result = data?.info?.chart?.result?.[0]

  if (!TradeKlineRef.value || !result) return

  topStockData.value.is_rise = normalizeTradeNumber(result.is_rise, 0)
  topStockData.value.rise = normalizeTradeNumber(result.rise, 0)
  topStockData.value.rise_rate = normalizeTradeNumber(result.rise_rate, 0)
  TradeKlineRef.value.updateKlineData(result, currentTimeOption.value.type)
}

const initializeTradePage = () => {
  socketParams.value.pro_code = selectCurrentStock.value?.pro_code || ''
  if (!socketParams.value.pro_code) return

  setKlineLoading(true)
  requestQuoteUpdate()

  if (stockStatus.value === 1) {
    startSocketTimerHandle()
  } else {
    stopSocketTimerHandle()
  }
}

const getPriceStep = (currentPrice: number) => {
  if (currentPrice >= 100) return 1
  if (currentPrice >= 10) return 0.1
  return 0.01
}

const subPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
  const step = getPriceStep(currentPrice)
  priceVal.value = Math.max(roundPrice(currentPrice - step), 0)
  isManualPriceEdited.value = true
}

const addPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
  const step = getPriceStep(currentPrice)
  priceVal.value = roundPrice(currentPrice + step)
  isManualPriceEdited.value = true
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
  priceVal.value = sanitizeDecimalInput(input.value)
  isManualPriceEdited.value = true
}

const handleNumInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  numVal.value = sanitizeIntegerInput(input.value)
}

const handlePriceBlur = () => {
  priceVal.value = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0)
}

const handleNumBlur = () => {
  numVal.value = safeNumVal.value
}

const collectHandle = () => {
  if (collectLoading.value || !selectCurrentStock.value?.id) return

  const previous = isCollect.value
  const nextValue = previous ? 0 : 1
  collectLoading.value = true
  isCollect.value = nextValue

  stockCollect({
    pid: selectCurrentStock.value.id,
    status: nextValue ? 1 : 2
  }).then(() => {
    showToast(nextValue ? t('comm.c67') : t('xx.a2'))
  }).catch(() => {
    isCollect.value = previous
  }).finally(() => {
    collectLoading.value = false
  })
}

const confirmHandle = () => {
  if (!canSubmit.value) return

  const buyData: Record<string, number | string> = {
    pid: selectCurrentStock.value.id,
    num: safeNumVal.value,
    deal_type: actTradeType.value < 1 ? '2' : '1',
    type: Number(buyType.value) + 1
  }

  if (buyData.deal_type === '2') {
    buyData.limit_price = safePriceVal.value
  }

  submitLoading.value = true
  pub.showLoading = true

  subBuyStockHandle(buyData).then(() => {
    showToast(t('trade.t47'))
    showBottom.value = false
    numVal.value = 1
    priceVal.value = normalizeTradeNumber(topStockData.value.price, 0)
    isManualPriceEdited.value = false
    getData()
  }).finally(() => {
    submitLoading.value = false
    pub.showLoading = false
  })
}

watch(stockStatus, (val) => {
  if (val === 1) {
    requestQuoteUpdate()
    startSocketTimerHandle()
  } else {
    stopSocketTimerHandle()
  }
})

watch(() => selectCurrentStock.value?.pro_code, (proCode, oldProCode) => {
  if (!proCode || proCode === oldProCode) return

  actTimeEl.value = 0
  initializeTradePage()
})

watch(() => selectCurrentStock.value?.id, (id, oldId) => {
  if (!id || id === oldId) return

  getData()
  isManualPriceEdited.value = false
})

onMounted(() => {
  socket.on('yahoo', handleYahooMessage)
  initializeTradePage()
  getData()
})

onUnmounted(() => {
  stopSocketTimerHandle()
  socket.off('yahoo', handleYahooMessage)
})
</script>

<template>
  <div class="pb-6">
    <ClientOnly>
      <second-page-nav-bar :title="selectedStockName">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent p-0"
          :disabled="collectLoading"
          @click="collectHandle"
        >
          <Icon
            name="tabler:star-filled"
            size="25"
            :class="isCollect ? 'text-amber-300' : 'text-white/70'"
          />
        </button>
      </second-page-nav-bar>

      <div class="mt-3 grid min-w-0 gap-5 overflow-x-hidden px-4 pb-2">
        <section
          class="min-w-0 overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,rgba(45,87,255,0.15)_0%,rgba(255,255,255,0.96)_22%,#ffffff_100%)] py-5 shadow-[0_14px_32px_rgba(2,26,123,0.10)]"
        >
          <div class="flex items-start justify-between gap-3 px-4">
            <div class="min-w-0 space-y-2">
              <div class="text-[13px] font-bold tracking-[0.08em] text-[#4b5d8f]">{{ selectCurrentStock.pro_code || '--' }}</div>
              <div class="max-w-[180px] truncate rounded-full bg-[rgba(45,87,255,0.08)] px-[10px] py-[6px] text-[12px] font-semibold leading-[1.2] text-[#2d57ff]">
                {{ selectedStockName }}
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-5 px-4 min-[421px]:flex-row min-[421px]:items-start min-[421px]:justify-between">
            <div class="min-w-0 flex-1 pl-[2px]" :class="displayPriceClass">
              <div class="text-[clamp(28px,7vw,38px)] font-black leading-none">{{ formatTradeValue(topStockData.price) }}</div>
              <div class="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs font-bold">
                <span>{{ getNumberType(true, topStockData.is_rise) + formatTradeValue(topStockData.rise) }}</span>
                <span>{{ getNumberType(true, topStockData.is_rise) + formatTradeValue(topStockData.rise_rate) }}%</span>
              </div>
            </div>

            <dl class="colorSecond m-0 grid min-w-0 grid-cols-2 gap-x-5 gap-y-4 min-[421px]:w-[47%]">
              <div class="space-y-[6px] border-b border-[rgba(45,87,255,0.10)] pb-3">
                <dt class="text-[11px] leading-[1.2]">{{ $t('trade.t49') }}</dt>
                <dd class="text-[14px] font-bold leading-[1.2] text-[#1d2744]">{{ formatTradeValue(topData.open) }}</dd>
              </div>
              <div class="space-y-[6px] border-b border-[rgba(45,87,255,0.10)] pb-3">
                <dt class="text-[11px] leading-[1.2]">{{ $t('trade.t50') }}</dt>
                <dd class="text-[14px] font-bold leading-[1.2] text-[#1d2744]">{{ formatTradeValue(topData.close) }}</dd>
              </div>
              <div class="space-y-[6px]">
                <dt class="text-[11px] leading-[1.2]">{{ $t('trade.t51') }}</dt>
                <dd class="text-[14px] font-bold leading-[1.2] text-[#1d2744]">{{ formatTradeValue(selfData.high) }}</dd>
              </div>
              <div class="space-y-[6px]">
                <dt class="text-[11px] leading-[1.2]">{{ $t('trade.t52') }}</dt>
                <dd class="text-[14px] font-bold leading-[1.2] text-[#1d2744]">{{ formatTradeValue(selfData.low) }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-5 border-t border-[rgba(45,87,255,0.10)] pt-4">
            <div class="px-3">
              <div class="flex justify-between gap-1 overflow-x-auto rounded-[18px] bg-[linear-gradient(135deg,#2d57ff_0%,#2146d8_100%)] p-1">
                <button
                  v-for="(item, index) in selectTimeList"
                  :key="item.value"
                  type="button"
                  class="h-9 min-w-14 shrink-0 rounded-xl px-[14px] text-xs font-bold transition-all duration-200"
                  :class="index === actTimeEl ? 'bg-white text-[#2d57ff] shadow-[0_8px_20px_rgba(9,26,99,0.16)]' : 'bg-transparent text-white/80'"
                  @click="changeActTimeType(index)"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div class="mt-4 min-w-0 overflow-hidden px-3">
              <TradeKline ref="TradeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
            </div>
          </div>
        </section>

        <section class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
          <div class="flex items-center justify-between gap-3 bg-[linear-gradient(135deg,#2d57ff_0%,#2146d8_100%)] px-4 py-4 max-[420px]:flex-col max-[420px]:items-stretch">
            <div class="space-y-1">
              <div class="text-[15px] font-extrabold text-white">{{ $t('trade.t53') }}</div>
              <div class="text-[11px] text-white/70">{{ $t('trade.t58') }}</div>
            </div>
            <div class="grid grid-cols-2 gap-1 rounded-[14px] bg-[#ffda1c] p-1 max-[420px]:w-full">
              <button
                v-for="(item, index) in tradeTypeList"
                :key="item"
                type="button"
                class="h-[34px] min-w-[74px] rounded-[10px] border-0 text-[13px] font-bold max-[420px]:min-w-0"
                :class="index === actTradeType ? 'bg-[#2d57ff] text-white' : 'bg-transparent text-[#2d2d2d]'"
                @click="changeActTradeType(index)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div class="grid min-w-0 gap-4 px-4 py-5">
            <div v-if="actTradeType === 0" class="grid gap-[10px]">
              <div class="text-sm font-extrabold text-[#1d2744]">{{ $t('trade.t54') }}</div>
              <div class="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-2 border-b border-[#b2d2fa] pb-[10px]">
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0"
                  :disabled="safePriceVal <= 0"
                  @click="subPriceVal"
                >
                  <Icon
                    class="w-7 h-7"
                    :class="safePriceVal > 0 ? 'mainTextColor' : 'color999'"
                    name="line-md:minus-square-filled"
                  />
                </button>
                <div class="min-w-0">
                  <input
                    type="text"
                    inputmode="decimal"
                    class="h-10 w-full border-0 bg-transparent text-center text-2xl font-extrabold text-gray-900 outline-none"
                    :value="priceVal"
                    @input="handlePriceInput"
                    @blur="handlePriceBlur"
                  >
                </div>
                <button type="button" class="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0" @click="addPriceVal">
                  <Icon class="w-7 h-7 mainTextColor" name="line-md:plus-square-filled" />
                </button>
              </div>
            </div>

            <div class="grid gap-[10px]">
              <div class="text-sm font-extrabold text-[#1d2744]">{{ $t('trade.t55') }}</div>
              <div class="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-2 border-b border-[#b2d2fa] pb-[10px]">
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0"
                  :disabled="safeNumVal <= 1"
                  @click="subNumVal"
                >
                  <Icon
                    class="w-7 h-7"
                    :class="safeNumVal > 1 ? 'mainTextColor' : 'color999'"
                    name="line-md:minus-square-filled"
                  />
                </button>
                <div class="min-w-0">
                  <input
                    type="text"
                    inputmode="numeric"
                    class="h-10 w-full border-0 bg-transparent text-center text-2xl font-extrabold text-gray-900 outline-none"
                    :value="numVal"
                    @input="handleNumInput"
                    @blur="handleNumBlur"
                  >
                </div>
                <button type="button" class="inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0" @click="addNumVal">
                  <Icon class="w-7 h-7 mainTextColor" name="line-md:plus-square-filled" />
                </button>
              </div>
            </div>

          </div>
        </section>

        <section class="grid gap-3">
          <button
            type="button"
            class="contentBtn border-0"
            :class="{ disAbledBtn: !canSubmit }"
            :disabled="!canSubmit"
            @click="showBottom = true"
          >
            {{ $t('trade.t58') }}
          </button>
          <div class="grid gap-1 rounded-xl bg-[#f7f9ff] px-4 py-3 text-[11px] leading-[1.6] text-[#7d87a3]">
            <p>{{ $t('trade.t59') }}</p>
            <p>{{ $t('trade.t60') }}</p>
          </div>
        </section>
      </div>

      <van-popup v-model:show="showBottom" round position="bottom">
        <div class="px-5 pb-6 pt-5">
          <div class="text-center text-lg font-black text-[#101828]">{{ $t('trade.t61') }}</div>

          <div class="mt-5 overflow-hidden rounded-2xl bg-[#f7f9ff] divide-y divide-[rgba(45,87,255,0.08)]">
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t62') }}</div>
              <div class="text-right font-bold" :class="getNumberClass(true, directionRiseType)">
                {{ tradeTypeList[actTradeType] }}--{{ directionList[buyType]?.label }}
              </div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t63') }}</div>
              <div class="text-right font-bold text-[#16213d]">{{ safeNumVal }} {{ $t('trade.t64') }}</div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t65') }}</div>
              <div class="text-right font-bold text-[#16213d]">X1</div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t67') }}/{{ t('x.a9') }}</div>
              <div class="text-right font-bold text-[#16213d]">{{ formatTradeValue(safePriceVal) }}</div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t68') }}</div>
              <div class="text-right font-bold text-[#16213d]">{{ formatTradeValue(safePriceVal * safeNumVal) }}</div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t69') }}</div>
              <div class="text-right font-bold text-[#16213d]">{{ formatTradeValue(feeAmount) }}</div>
            </div>
            <div class="flex items-center justify-between gap-3 bg-[#eef4ff] px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t70') }}</div>
              <div class="text-right text-base font-bold text-[#2d57ff]">{{ formatTradeValue(totalAmount) }}</div>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#53607e]">
              <div>{{ $t('trade.t71') }}</div>
              <div class="text-right font-bold text-[#16213d]">{{ formatTradeValue(userBalance) }}</div>
            </div>
          </div>

          <button
            type="button"
            class="contentBtn mt-4"
            :class="{ disAbledBtn: !canSubmit || submitLoading }"
            :disabled="!canSubmit || submitLoading"
            @click="confirmHandle"
          >
            {{ $t('trade.t72') }}
          </button>
        </div>
      </van-popup>
    </ClientOnly>
  </div>
</template>
