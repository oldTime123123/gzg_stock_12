<script setup lang="ts">
import { showToast } from 'vant';
import { getIpoRecordList, submitIpoBuyApi, ipoApplyDataApi, ipoApplyPayApi } from '~/api/ipo';
import rightUrl from '~/assets/images/icon/recordIcon.png';

import { UseExchangeNumber } from '~/utils';
const { t, locale } = useI18n()
const router = useRouter()
const rightClickHandle = () => {
  router.push('/record/spoSuccessRecord')
}
const pub = usePublicStore()
const actRecordType = computed(() => {
  return pub.spoActRecordType
})
const recordTypeList = ref([
  t('trade.t73'),
  t('trade.t74'),
  t('trade.t75')
])
const pages = ref({
  page: 1,
  size: 10,
  type: 2
})

const showVanSkeletonLoading = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {

  if (actRecordType.value < 1) {
    getIpoRecordList(pages.value).then(res => {
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
  } else {
    let data = pages.value
    if (actRecordType.value > 1) {
      data.status = 1
    }
    ipoApplyDataApi(data).then(res => {
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

}

const buyNum = ref(1)
const showPop = ref(false)
const selectData = ref({})
const openSelectHandle = (item) => {
  selectData.value = item
  if (item.number_type > 1) {
    buyNum.value = item.stock
  } else {
    buyNum.value = item.min_number
  }
  showPop.value = true
}

const getSpoCurrentPrice = (item) => {
  return Number(item.product?.price ?? item.ipo?.show_price ?? 0)
}

const formatSpoProfitRate = (value, profit) => {
  const text = String(value ?? '').trim()
  if (!text) return '0%'
  if (text.startsWith('+') || text.startsWith('-')) return text
  const profitValue = Number(profit)
  if (profitValue < 0) return `-${text}`
  if (profitValue > 0) return `+${text}`
  const numberValue = Number(text.replace('%', '').replace(/,/g, ''))
  if (numberValue > 0) return `+${text}`
  return text
}

const getSpoProfitRate = (item) => {
  const profit = item.product?.profit_per ?? item.profit_per
  const profitRate = item.product?.profit_per_rate ?? item.profit_per_rate
  if (profitRate !== undefined && profitRate !== null && profitRate !== '') {
    return formatSpoProfitRate(profitRate, profit)
  }
  const buyPrice = Number(item.price)
  const currentPrice = getSpoCurrentPrice(item)
  if (!buyPrice || !currentPrice) return '0%'
  return formatSpoProfitRate(`${(((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2)}%`)
}

const getSpoProfitClass = (item) => {
  const profit = Number(item.product?.profit_per ?? item.profit_per ?? getSpoCurrentPrice(item) - Number(item.price))
  return profit >= 0 ? 'colorUp' : 'colorDown'
}

const spoProfitRateLabel = computed(() => locale.value.startsWith('zh') ? '盈利比例' : t('trade.t116'))

const changeRecordTypeHandle = (index) => {
  // if (actRecordType.value == index) return
  if (pages.value.status) delete pages.value.status

  pub.showLoading = true
  recordList.value = []
  loading.value = true
  finished.value = false
  totalSize.value = 0
  pub.spoActRecordType= index
  pages.value.page = 1

  getRecordList()
}
// ipoApplyData
const confirmBuyHandle = () => {
  if (Number(buyNum.value) < Number(selectData.value.min_number)) {
    showToast(t('x.a13'))
    return
  }
  const data = {
    ipoId: selectData.value.id,
    number: buyNum.value
  }
  showPop.value = false
  pub.showLoading = true
  submitIpoBuyApi(data).then(res => {
    changeRecordTypeHandle(0)
    buyNum.value = 1
    showToast(t('trade.t76'))
  })
}

const payHandle = (item) => {
  ipoApplyPayApi({
    applyId: item.id
  }).then(res => {
    showToast(t('trade.t77'))
    changeRecordTypeHandle(2)
  })
}
onMounted(() => {
  getRecordList()
})
</script>

<template>
  <div>
   <ClientOnly>
     <second-page-nav-bar :title="t('index.i11')" :right-icon="rightUrl"
      :right-click-handle="rightClickHandle"></second-page-nav-bar>

    <div class="mt-3 px-3">
      <div class="recordBoxEl mt-3 pb-2">
        <div class="grid grid-cols-3 text-center recordTypeBoxEl">

          <div v-for="(item, index) in recordTypeList" :class="index == actRecordType ? 'actRecordEl' : ''" :key="index"
            @click="changeRecordTypeHandle(index)">
            {{ item }}
          </div>

        </div>

        <div class="mt-3 px-3">
          <div class="" v-if="recordList.length == 0">
            <div class="nullData mt-10"></div>
            <div class="text-lg mt-2 color text-blue-300 text-center">
              {{ $t('trade.t79') }}
            </div>
          </div>
          <div v-else>
            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="bg-[#2D57FF] mb-3 px-3 py-2 rounded-xl" v-for="(item, index) in recordList" :key="index">
                <div class=" flex items-center  colorfff"
                  :class="actRecordType == 1 ? 'justify-between' : 'justify-center'">
                  <div class="flex items-center">
                    {{ item.product?.pro_name }}
                    <div class="bg-[#FFDA1C] px-1  ml-1 rounded-xs color000 text-xs">
                      {{ item.pro_code }}
                    </div>
                  </div>
                  <div v-if="actRecordType == 1">
                    <div class="bg-[#E5F0FE]  text-[#2D57FF] px-2 py-1  rounded-lg  text-sm">
                      {{ $t('trade.t80') }}
                    </div>
                  </div>
                </div>
                <!-- TYPE 0  -->
                <div v-if="actRecordType == 0" class="mt-2 bg-[#ECF4FE] p-1.5 rounded-xl space-y-1">
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('record.r4') }}：
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.price) }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('record.r5') }}：
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(getSpoCurrentPrice(item)) }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ spoProfitRateLabel }}：
                    </div>
                    <div class="" :class="getSpoProfitClass(item)">
                      {{ getSpoProfitRate(item) }}
                    </div>
                  </div>
                  <div class="contentBtn mt-3" @click="openSelectHandle(item)">
                    {{ $t('trade.t87') }}
                  </div>
                </div>
                <!-- TYPE 1 -->
                <div v-if="actRecordType == 1" class="mt-2 bg-[#ECF4FE] p-1.5 rounded-xl space-y-1">
              <!--     <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t88') }}
                    </div>
                    <div class="">
                      {{ item.ipo?.show_time_format }}
                    </div>
                  </div> -->

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t89') }}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.price) }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t90') }}
                    </div>
                    <div class="">
                      {{ item.buy_number }}
                      <!-- {{ () }} -->
                    </div>
                  </div>
                  <!-- <div class="flex justify-between items-center color000">
                                        <div class="text-[#404040]">
                                            {{ $t('trade.t91') }}
                                        </div>
                                        <div class="">
                                            {{ item.ipo?.open_time }}
                                        </div>
                                    </div> -->
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t92') }}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.price * item.buy_number) }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t93') }}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.wait_price) }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t94') }}
                    </div>
                    <div class="">
                      {{ item.create_time }}
                    </div>
                  </div>

                </div>
                <!-- TYPE 2 -->
                <div v-if="actRecordType == 2" class="mt-2 bg-[#ECF4FE] p-1.5 rounded-xl space-y-1">
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t95') }}
                    </div>
                    <div class="">
                      {{ item.create_time }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040] text-left">
                      {{ $t('trade.t96') }}
                    </div>
                    <div class="text-right">
                      {{ item.status == 1 ? $t('trade.t111')
                        : item.status == 2 ? t('trade.t112') : item.status == 3 ? $t('trade.t146') :
                          item.status == 4 ? $t('trade.t147') : $t('trade.t148') }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t98') }}
                    </div>
                    <div class="">
                      {{ item.number }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t99') }}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.price) }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t101') }}
                    </div>
                    <div class="">
                      {{ UseExchangeNumber(item.price * item.number) }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t145') }}

                    </div>
                    <div class="">
                      {{ item.use_price }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t102') }}
                    </div>
                    <div class="">
                      {{ item.paid_time }}
                    </div>
                  </div>
                  <div class="mt-3 contentBtn" v-if="item.pay_type == 1 && item.status == 1" @click="payHandle(item)">
                    {{ $t('trade.t103') }}
                  </div>

                  <!--  -->
                </div>
              </div>
            </van-list>
          </div>

        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="flex justify-center items-center h-full ">
        <div class="tradePopContent w-[350px]" @click.stop>
          <div class="tradePopHeader">
            <div class="tradePopHeaderTitle">
              <div class="colorfff font-bold truncate">
                {{ selectData.product?.pro_name }}
                ({{ selectData.product?.pro_code }})
              </div>
              <button class="tradePopClose" type="button" @click="showPop = false">
                <Icon class="w-7 h-7 colorfff" name="fontisto:close" />
              </button>
            </div>
          </div>
          <div class="tradePopBody">
            <div class="tradePopInner text-sm" :class="selectData.number_type > 1 ? 'top-buy-content' : ''">
              <div class="flex mb-2 justify-between items-center">
                <div>{{ $t('trade.t105') }}</div>
                <div>{{ selectData.price }}</div>
              </div>
              <div class="flex mb-2 justify-between items-center" v-if="selectData.number_type <= 1">
                <div>{{ $t('trade.t106') }}</div>
                <div>{{ selectData.price * buyNum }}</div>
              </div>

              <div v-if="selectData.number_type <= 1">
                <div class="flex  justify-between items-center">
                  <div>{{ $t('trade.t107') }}</div>
                </div>
                <div class="borderB pb-1">
                  <van-field type="digit" v-model="buyNum" class="w-full rounded-input" :placeholder="$t('trade.t107')"
                    :border="false" input-align="left" />
                </div>
              </div>
              <div class="contentBtn" :class="selectData.number_type > 1 ? 'mt-6' : 'mt-3'" @click="confirmBuyHandle">
                {{ $t('trade.t109') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
   </ClientOnly>
  </div>
</template>


<style lang="less" scoped>
:deep(.w-full) {
  border: none;
  outline: none;
  box-shadow: none;
}

.rounded-input {
  background: #fff;
  border-radius: 16px;
}

.rounded-input :deep(.van-field__value) {
  padding: 0;
}

.rounded-input :deep(.van-field__control) {
  font-size: 14px;
}

.tradePopContent {
  background: transparent;

  .tradePopHeader {
    aspect-ratio: 716 / 280;
    background: url('~/assets/images/img/spoTradeTopBg.png') no-repeat top center / 100% auto;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0 16px 10px 220px;
  }

  .tradePopHeaderTitle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 0;
    width: 100%;
  }

  .tradePopClose {
    flex: 0 0 auto;
    border: 0;
    padding: 0;
    background: transparent;
    line-height: 0;
  }

  .tradePopBody {
    overflow: hidden;
    border-radius: 0 0 16px 16px;
    background: var(--mainColor);
    padding: 0 14px 14px;
  }

  .tradePopInner {
    background: #fff;
    border-radius: 10px;
    padding: 18px 14px;
  }

  .top-buy-content {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .borderB {
    border-bottom: 1px solid #000;

    input {
      font-size: 12px;
    }
  }
}
.recordBoxEl {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  border-radius: 10px;

  .recordTypeBoxEl {
    background: var(--mainColor);
    height: 44px;
    line-height: 44px;
    border-radius: 10px 10px 0 0;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--mainColor);

    >div {
      position: relative;
      z-index: 1;
      cursor: pointer;
      color: #fff;
      transition: color 0.3s;

      &.actRecordEl {
        color: var(--mainColor);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          background: #fff;
          z-index: -1;
          transform: skewX(-20deg);
        }
      }

      &:first-child.actRecordEl::before {
        left: -20px;
        right: -15px;
        border-radius: 10px 0 0 0;
      }

      &:last-child.actRecordEl::before {
        left: -15px;
        right: -20px;
        border-radius: 0 10px 0 0;
      }

      &:not(:first-child):not(:last-child).actRecordEl::before {
        left: -15px;
        right: -15px;
        // border-radius: 10px;
        background: #FFF;
      }
    }
  }
}
</style>
