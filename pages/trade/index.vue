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

  if (Number(stockStatus.value) == 1) {
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
  <div class="trade-page">
    <ClientOnly>
      <second-page-nav-bar :title="selectedStockName">
        <button
          type="button"
          class="favorite-button"
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

      <div class="trade-page__body px-3 mt-3">
        <section class="lineBox quote-card rounded-2xl">
          <div class="quote-card__head">
            <div class="quote-card__code">{{ selectCurrentStock.pro_code || '--' }}</div>
            <div class="quote-card__badge">{{ selectedStockName }}</div>
          </div>

          <div class="quote-card__summary">
            <div class="quote-card__main" :class="displayPriceClass">
              <div class="quote-card__price">{{ formatTradeValue(topStockData.price) }}</div>
              <div class="quote-card__delta">
                <span>{{ getNumberType(true, topStockData.is_rise) + formatTradeValue(topStockData.rise) }}</span>
                <span>{{ getNumberType(true, topStockData.is_rise) + formatTradeValue(topStockData.rise_rate) }}%</span>
              </div>
            </div>

            <dl class="quote-card__stats colorSecond">
              <div class="quote-card__stat">
                <dt>{{ $t('trade.t49') }}</dt>
                <dd>{{ formatTradeValue(topData.open) }}</dd>
              </div>
              <div class="quote-card__stat">
                <dt>{{ $t('trade.t50') }}</dt>
                <dd>{{ formatTradeValue(topData.close) }}</dd>
              </div>
              <div class="quote-card__stat">
                <dt>{{ $t('trade.t51') }}</dt>
                <dd>{{ formatTradeValue(selfData.high) }}</dd>
              </div>
              <div class="quote-card__stat">
                <dt>{{ $t('trade.t52') }}</dt>
                <dd>{{ formatTradeValue(selfData.low) }}</dd>
              </div>
            </dl>
          </div>

          <div class="px-3">
            <div class="kline-periods">
              <button v-for="(item, index) in selectTimeList" :key="item.value" type="button" class="period-chip"
                :class="{ 'period-chip--active': index === actTimeEl }" @click="changeActTimeType(index)">
                {{ item.name }}
              </button>
            </div>
          </div>

          <div class="quote-card__chart px-3">
            <TradeKline ref="TradeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
          </div>
        </section>

        <section class="tradeContentBoxEl trade-panel rounded-2xl overflow-hidden">
          <div class="trade-panel__header">
            <div class="trade-panel__title">{{ $t('trade.t53') }}</div>
            <div class="trade-mode-switch">
              <button
                v-for="(item, index) in tradeTypeList"
                :key="item"
                type="button"
                class="trade-mode-switch__item"
                :class="{ 'trade-mode-switch__item--active': index === actTradeType }"
                @click="changeActTradeType(index)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div class="trade-panel__body">
            <div v-if="actTradeType === 0" class="trade-input-block">
              <div class="trade-input-block__label">{{ $t('trade.t54') }}</div>
              <div class="trade-stepper borderB">
                <button
                  type="button"
                  class="trade-stepper__action"
                  :disabled="safePriceVal <= 0"
                  @click="subPriceVal"
                >
                  <Icon
                    class="w-7 h-7"
                    :class="safePriceVal > 0 ? 'mainTextColor' : 'color999'"
                    name="line-md:minus-square-filled"
                  />
                </button>
                <div class="trade-stepper__input">
                  <input
                    type="text"
                    inputmode="decimal"
                    class="trade-field"
                    :value="priceVal"
                    @input="handlePriceInput"
                    @blur="handlePriceBlur"
                  >
                </div>
                <button type="button" class="trade-stepper__action" @click="addPriceVal">
                  <Icon class="w-7 h-7 mainTextColor" name="line-md:plus-square-filled" />
                </button>
              </div>
            </div>

            <div class="trade-input-block">
              <div class="trade-input-block__label">{{ $t('trade.t55') }}</div>
              <div class="trade-stepper borderB">
                <button
                  type="button"
                  class="trade-stepper__action"
                  :disabled="safeNumVal <= 1"
                  @click="subNumVal"
                >
                  <Icon
                    class="w-7 h-7"
                    :class="safeNumVal > 1 ? 'mainTextColor' : 'color999'"
                    name="line-md:minus-square-filled"
                  />
                </button>
                <div class="trade-stepper__input">
                  <input
                    type="text"
                    inputmode="numeric"
                    class="trade-field"
                    :value="numVal"
                    @input="handleNumInput"
                    @blur="handleNumBlur"
                  >
                </div>
                <button type="button" class="trade-stepper__action" @click="addNumVal">
                  <Icon class="w-7 h-7 mainTextColor" name="line-md:plus-square-filled" />
                </button>
              </div>
            </div>


          </div>
        </section>

        <section class="trade-footer">
          <button
            type="button"
            class="contentBtn trade-submit-btn"
            :class="{ disAbledBtn: !canSubmit }"
            :disabled="!canSubmit"
            @click="showBottom = true"
          >
            {{ $t('trade.t58') }}
          </button>
          <div class="trade-footer__tips">
            <p>{{ $t('trade.t59') }}</p>
            <p>{{ $t('trade.t60') }}</p>
          </div>
        </section>
      </div>

      <van-popup v-model:show="showBottom" round position="bottom" class="trade-popup">
        <div class="trade-popup__content">
          <div class="trade-popup__title">{{ $t('trade.t61') }}</div>

          <div class="trade-popup__summary">
            <div class="trade-popup__row">
              <div>{{ $t('trade.t62') }}</div>
              <div :class="getNumberClass(true, directionRiseType)">
                {{ tradeTypeList[actTradeType] }}--{{ directionList[buyType]?.label }}
              </div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t63') }}</div>
              <div>{{ safeNumVal }} {{ $t('trade.t64') }}</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t65') }}</div>
              <div>X1</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t67') }}/{{ t('x.a9') }}</div>
              <div>{{ formatTradeValue(safePriceVal) }}</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t68') }}</div>
              <div>{{ formatTradeValue(safePriceVal * safeNumVal) }}</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t69') }}</div>
              <div>{{ formatTradeValue(feeAmount) }}</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t70') }}</div>
              <div>{{ formatTradeValue(totalAmount) }}</div>
            </div>
            <div class="trade-popup__row">
              <div>{{ $t('trade.t71') }}</div>
              <div>{{ formatTradeValue(userBalance) }}</div>
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

<style lang="less" scoped>
.trade-page {
  --trade-page-gutter: clamp(22px, 5.8vw, 30px);
  --trade-card-gutter: clamp(22px, 5.4vw, 28px);
  padding-bottom: 24px;
}

.trade-page__body {
  display: grid;
  gap: 18px;
  min-width: 0;
  overflow-x: hidden;
}

.favorite-button {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  padding: 0;
}

.lineBox {
  background:
    linear-gradient(180deg, rgba(45, 87, 255, 0.15) 0%, rgba(255, 255, 255, 0.96) 20%, #ffffff 100%);
  box-shadow: 0 14px 40px rgba(2, 26, 123, 0.12);
  border: 1px solid rgba(45, 87, 255, 0.08);
}

.tradeContentBoxEl {
  box-shadow: 0 14px 40px rgba(2, 26, 123, 0.12);
  border: 1px solid rgba(45, 87, 255, 0.08);
}

.quote-card {
  padding: 22px 0 18px;
  min-width: 0;
  overflow: hidden;
}

.quote-card__head {
  padding: 0 var(--trade-card-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.quote-card__code {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #4b5d8f;
}

.quote-card__badge {
  max-width: 60%;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(45, 87, 255, 0.08);
  color: #2d57ff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quote-card__summary {
  margin-top: 18px;
  padding: 0 var(--trade-card-gutter);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 16px;
  align-items: start;
}

.quote-card__price {
  font-size: clamp(28px, 7vw, 38px);
  line-height: 1;
  font-weight: 900;
}

.quote-card__main {
  min-width: 0;
  padding-inline-start: 2px;
}

.quote-card__delta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.quote-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  min-width: 0;
  padding-inline-end: 2px;
}

.quote-card__stat {
  padding: 10px 12px;
  background: rgba(245, 248, 255, 0.9);
  border-radius: 14px;
}

.quote-card__stat dt {
  font-size: 11px;
  line-height: 1.2;
}

.quote-card__stat dd {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.2;
  color: #1d2744;
  font-weight: 700;
}

.kline-periods {
  margin: 10px  0;
  padding: 4px;
  display: flex;
  gap: 4px;
  justify-content: space-between;
  overflow-x: auto;
  background: linear-gradient(135deg, #2d57ff 0%, #2146d8 100%);
  border-radius: 18px;
  scrollbar-width: none;
}

.period-chip {
  flex-shrink: 0;
  min-width: 56px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  padding: 0 14px;
  color: rgba(255, 255, 255, 0.78);
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.period-chip--active {
  color: #2d57ff;
  background: #fff;
  box-shadow: 0 8px 20px rgba(9, 26, 99, 0.16);
}

.quote-card__chart {
  margin-top: 18px;
  min-width: 0;
  overflow: hidden;
}

.trade-panel__header {
  padding: 18px var(--trade-card-gutter) 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(135deg, #2d57ff 0%, #2146d8 100%);
}

.trade-panel__title {
  color: #fff;
  font-size: 15px;
  font-weight: 800;
}

.trade-mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
  background: #ffda1c;
  border-radius: 14px;
}

.trade-mode-switch__item {
  min-width: 74px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #2d2d2d;
  font-size: 13px;
  font-weight: 700;
}

.trade-mode-switch__item--active {
  color: #fff;
  background: #2d57ff;
}

.trade-panel__body {
  padding: 20px var(--trade-card-gutter) 20px;
  display: grid;
  gap: 16px;
  min-width: 0;
}

.trade-input-block {
  display: grid;
  gap: 10px;
}

.trade-input-block__label {
  font-size: 14px;
  font-weight: 800;
  color: #1d2744;
}

.trade-stepper {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  gap: 8px;
  align-items: center;
  padding-bottom: 10px;
}

.trade-stepper__action {
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.trade-stepper__input {
  min-width: 0;
}

.trade-field {
  width: 100%;
  height: 40px;
  border: 0;
  outline: none;
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  background: transparent;
}


.trade-direction-btn {
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(45, 87, 255, 0.18);
  background: #f7f9ff;
  color: #4b5d8f;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.trade-direction-btn--active {
  color: #fff;
  box-shadow: 0 0px 14px rgba(2, 26, 123, 0.16);
}

.trade-direction-btn--rise {
  background: linear-gradient(135deg, #ff7c7c 0%, #ef4444 100%);
  border-color: transparent;
}

.trade-direction-btn--fall {
  background: linear-gradient(135deg, #20d4a2 0%, #02cd8e 100%);
  border-color: transparent;
}

.trade-estimate {
  display: grid;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(180deg, #f8faff 0%, #f3f7ff 100%);
  border-radius: 16px;
}

.trade-estimate__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: #5b6686;
}

.trade-estimate__row strong {
  color: #16213d;
  font-size: 14px;
}

.trade-estimate__row--total {
  padding-top: 10px;
  border-top: 1px dashed rgba(45, 87, 255, 0.18);
}

.trade-estimate__row--total strong {
  color: #2d57ff;
  font-size: 16px;
}

.trade-footer {
  display: grid;
  gap: 12px;
}

.trade-submit-btn {
  border: 0;
}

.trade-footer__tips {
  padding: 0 4px;
  display: grid;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #8e8e8e;
}

.trade-footer__tips p {
  margin: 0;
}

.trade-popup__content {
  padding: 20px 16px 24px;
}

.trade-popup__title {
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  color: #101828;
}

.trade-popup__summary {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.trade-popup__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  background: #f6f8ff;
  border-radius: 14px;
  font-size: 13px;
  color: #53607e;
}

.trade-popup__row > div:last-child {
  color: #16213d;
  font-weight: 700;
  text-align: right;
}

.borderB {
  border-bottom: 1px solid #b2d2fa;
}

::-webkit-scrollbar {
  display: none;
}

@media (max-width: 420px) {
  .trade-page__body {
    padding: 14px var(--trade-page-gutter) 0;
  }

  .quote-card__summary {
    grid-template-columns: 1fr;
  }

  .trade-panel__header {
    align-items: stretch;
    flex-direction: column;
  }

  .trade-mode-switch {
    width: 100%;
  }

  .trade-mode-switch__item {
    min-width: 0;
  }

  .trade-panel__body {
    padding: 18px var(--trade-card-gutter) 18px;
  }
}
</style>
