<script setup lang="ts">
import { showToast } from 'vant';
import { getTradeList, getTradeLog, subTradeHandle } from '~/api/trade';
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import { vMaska } from 'maska/vue';
const { t, locale } = useI18n()
const actRecordType = ref(0);
const recordTypeTabs = ref([
  {
    text: t('trade.t20'),
    type: 0,
  },
  {
    text: t('trade.t21'),
    type: 1,
  }
])
const pages = ref({
  page: 1,
  type: 4,
  size: 10,
})
const showPwd = ref(false)
const showVanSkeletonLoading = ref(true)
const recordList = ref([])
const loading = ref(true)
const finished = ref(false)
const totalSize = ref(0)
const getRecordList = () => {
  if (actRecordType.value < 1) {
    getTradeList(pages.value).then(res => {
      totalSize.value = res.total
      if (pages.value.page == 1) {
        recordList.value = res.data
      } else {
        recordList.value = recordList.value.concat(res.data)
      }

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
    getTradeLog(pages.value).then(res => {
      totalSize.value = res.total

       if (pages.value.page == 1) {
        recordList.value = res.data
      } else {
        recordList.value = recordList.value.concat(res.data)
      }
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


const actApplyInd = ref(0)

onMounted(() => {
  getRecordList()
})
// 申请时是否需要输入密钥：1.需要 0.不需要
const showPop = ref(false)
const changeActType = (type: number) => {

  if (actRecordType.value == type) return
  publicStore.showLoading = true
  actRecordType.value = type
  pages.value.page = 1
  totalSize.value = 0
  recordList.value = []
  finished.value = false
  loading.value = true
  getRecordList()
}

const selectPopObj = ref({})
const buyNum = ref(0)
const openTradePop = () => {
  buyNum.value = recordList.value[actApplyInd.value].buy_min_num
  selectPopObj.value = recordList.value[actApplyInd.value]
  showPop.value = true
}
const fundPwd = ref("")
const publicStore = usePublicStore()
const confirmHandle = () => {
  if (Number(buyNum.value) < Number(recordList.value[actApplyInd.value].buy_min_num)) {
    return showToast(t('x.a20') + ': ' + recordList.value[actApplyInd.value].buy_min_num)
  }
  publicStore.showLoading = true
  showPop.value = false

  subTradeHandle({
    id: selectPopObj.value.id,
    num: buyNum.value,
    sn: fundPwd.value

  }).then(res => {
    showToast(t('trade.t22'))
  }).finally(() => {
    publicStore.showLoading = false
  })
}

const statusEnum = {
  1: t('trade.t23'),
  2: t('trade.t24'),
  3: t('trade.t25'),
}
</script>

<template>
  <div>
    <second-page-nav-bar :title="$t('index.i13')"></second-page-nav-bar>

    <div class="mt-3 px-3">
      <div class="recordBoxEl mt-3 pb-2">
        <div class="grid grid-cols-2 text-center  recordTypeBoxEl">

          <div class="cursor-pointer" v-for="(tab, index) in recordTypeTabs"
            :class="tab.type == actRecordType ? 'actRecordEl' : ''" :key="index" @click="changeActType(tab.type)">
            {{ tab.text }}
          </div>

        </div>

        <div class="mt-3 px-3">
          <div class="" v-if="recordList.length == 0">
            <div class="nullData mt-10"></div>
            <div class="text-lg mt-2 color text-blue-300 text-center">
              {{ $t('trade.t8') }}
            </div>
          </div>
          <div v-else>
            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div v-if="actRecordType == 1" class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-xl"
                v-for="(item, index) in recordList" :key="index">

                <div class=" rounded-xl space-y-1">
                  <div class="flex justify-between items-center ">
                    <div class="flex items-center ">
                      <span class="mainTextColor font-bold"> {{ item.stock?.pro_name }}</span>
                      <div class="bg-[#FFDA1C] px-1  ml-1 rounded-xs color000 text-xs">
                        {{ item.stock?.pro_code }}
                      </div>
                    </div>
                    <div class=" px-2 py-1  rounded-lg  text-sm"
                      :class="item.status == 1 ? 'bg-[#2D57FF]  text-[#fff]' : item.status == 2 ? ' bg-[#02CD8E]   text-[#fff]' : 'bg-[#ce4040] text-[#fff]'">
                      {{ statusEnum[item.status] }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t9') }}
                    </div>
                    <div class="">
                      {{ item.buy_price }}
                    </div>
                  </div>

                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t10') }}
                    </div>
                    <div class="">
                      {{ item.apply_num }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center color000">
                    <div class="text-[#404040]">
                      {{ $t('trade.t11') }}
                    </div>
                    <div class="">
                      {{ item.buy_num }}
                    </div>
                  </div>


                </div>
              </div>
              <div v-else>
                <div class="grid grid-cols-2 gap-2">
                  <div class="py-3 text-center  rounded-sm cursor-pointer"
                    :class="actApplyInd == index ? 'bg-[var(--mainColor)] colorfff' : 'bg-[#ECF4FE]'"
                    v-for="(item, index) in recordList" :key="index" @click="actApplyInd = index">
                    <div class="flex items-center  justify-center text-sm flex-col">
                      {{ item.stock?.pro_name }} <div class="bg-[#FFDA1C] px-1  ml-1 rounded-xs color000 text-xs">
                        {{ item.stock?.pro_code }}
                      </div>
                    </div>
                    <div class="font-bold" :class="actApplyInd != index ? 'text-blue-600' : ''">
                      {{ UseExchangeNumber(item.buy_price) }}
                    </div>
                  </div>
                </div>

                <div class="contentBtn mt-3" @click="openTradePop">
                  {{ $t('trade.t12') }}
                </div>
              </div>
            </van-list>

          </div>

        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="flex justify-center items-center h-full">
        <div class="bg-white tradePopContent h-[400px] w-[350px] relative" @click.stop>
          <div class="absolute right-[0px] top-[30px]">
            <Icon class="w-7 h-7 colorfff" @click="showPop = false" name="fontisto:close" />
          </div>
          <div class="flex flex-row-reverse">
            <div class="pt-16 flex item-center text-right pr-11 colorfff font-bold  w-1/2">
              <div class="truncate flex-1">
                {{ selectPopObj.stock?.pro_name }}
              </div>
              <div class="w-1/5 ml-[3px]">
                {{ "(" + selectPopObj.stock?.pro_code + ")" }}

              </div>
            </div>
          </div>
          <div class="mt-4 px-6 text-sm">
            <div class="flex mb-2 justify-between items-center">
              <div>{{ $t('trade.t32') }}</div>
              <div>{{ UseExchangeNumber(selectPopObj.buy_price) }}</div>
            </div>
            <div class="flex mb-2 justify-between items-center">
              <div>{{ $t('trade.t33') }}</div>
              <div>{{ UseExchangeNumber(selectPopObj.buy_price * buyNum) }}</div>
            </div>
            <div class="flex mb-2 justify-between items-center">
              <div>{{ $t('trade.t34') }}</div>
            </div>
            <div class="borderB ">
              <van-field type="digit" v-model="buyNum" class="w-full rounded-input" :placeholder="$t('trade.t38')"
                :maxlength="10" :border="false" input-align="left" />
            </div>
            <div class="mt-2" :class="selectPopObj.need_sn > 0 ? '' : 'invisible'">
              <div class="flex mb-2 justify-between items-center">
                <div>{{ $t('trade.t35') }}</div>
              </div>
              <div class=" borderB">
                <van-field :type="showPwd ? 'text' : 'password'" v-model="fundPwd" class="w-full rounded-input"
                  :placeholder="$t('trade.t36')" :border="false" input-align="left">
                  <template #right-icon>
                    <img :src="showPwd ? eyeOpen : eyeClose" class="w-5 h-5 cursor-pointer"
                      @click="showPwd = !showPwd" />
                  </template>
                </van-field>
              </div>
            </div>
            <div class="mt-14 contentBtn" @click="confirmHandle">{{ $t('trade.t37') }}</div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>


<style lang="less" scoped>
.tradePopContent {
  background: url('~/assets/images/img/dailyTradeBg.png') no-repeat;
  background-size: contain;

  .borderB {
    border-bottom: 1px solid #000;
  }
}

:deep(.rounded-input) {
  background: #fff;
  border-radius: 16px;
  // box-shadow: 0 0 10px 1px #e8e8e8;
}

:deep(.rounded-input .van-field__value) {
  padding: 0;
}

:deep(.rounded-input .van-field__control) {
  font-size: 14px;
}

:deep(.van-cell) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.roundInput) {
  input {
    font-size: 12px;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  }

}

.recordBoxEl {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  border-radius: 10px;

  .recordTypeBoxEl {
    background: var(--mainColor);
    height: 34px;
    line-height: 34px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--mainColor);
    color: #fff;

    .actRecordEl {
      color: var(--mainColor);
      background: #fff;
      border-radius: 10px;

    }
  }
}
</style>
