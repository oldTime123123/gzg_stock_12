<script lang="ts" setup>
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import { computed, ref } from 'vue';
import { getCircleOption } from '~/utils/indexLineStyle';
import { getUserAccountBalance } from '~/api/home/home';
const colors = ['#FFDA1C', '#E24400', '#01fff5', '#02CD8E',]
const series = ref([0, 0, 0, 0]) // 数据: 可用资金, 冻结金额, 持仓市值
const { t } = useI18n();
const balanceList = ref({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  product_balance: 0,
  inStockProfit: 0,


})
const getData = () => {
  getUserAccountBalance().then((res: any) => {
    balanceList.value = res
    series.value = [
      Number(res.balance),
      Number(res.product_balance),
      Number(res.frozenAmount),
    ]
  })
}
const circleChartStyle = getCircleOption(colors)

const balanceBox = computed(() => {
  return [
    {
      amount: balanceList.value.totalAsset || 0,
      color: '#2D9AFF',
      name: t('index.i1'),
    },
    {
      amount: series.value[0] || 0,
      color: colors[0],
      name: t('index.i2'),
    },
    {
      amount: series.value[1] || 0,
      color: colors[1],
      name: t('index.i3')
    },
    {
      amount: series.value[2] || 0,
      color: colors[2],
      name: t('mine.m16')
    },
    {
      amount: balanceList.value.inStockProfit || 0,
      color: colors[3],
      name: t('index.i4')
    },

  ]
})
const pub = usePublicStore()

const actRecordType = computed(() => {
  return pub.actRecordType
})
const recordTypeTabs = ref([
  {
    text: t('index.i5'),
    type: 3,
  },
  {
    text: t('index.i6'),
    type: 1,
  },
  {
    text: t('index.i7'),
    type: 2,
  },
])

const changeRecordType = (type) => {
  if (actRecordType.value == type) return
  pub.actRecordType = type
  pub.showLoading = true
}

const router = useRouter()
const changePage = (url: any) => {
  if (url) {
    router.push(url)
  }
}

const showBalance = ref(true)
onBeforeMount(() => {
  getData()
})
</script>
<template>
  <section>
    <div class="min-h-full">
      <TabbarTopNavBar />

      <ClientOnly>
        <div class="pageContainer mt-3 space-y-4 px-4">
          <div class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,#edf2ff_0%,#ffffff_34%,#ffffff_100%)] px-4 py-5 shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
            <div class="grid gap-4 min-[390px]:grid-cols-[120px_minmax(0,1fr)] min-[390px]:items-center">
              <div class="relative mx-auto h-[120px] w-[120px] shrink-0">
                <apexchart v-if="series" type="donut" width="120px" height="120px" :options="circleChartStyle"
                  :series="series" />

                <div class="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--mainColor)]">
                  <div class="colorfff text-center text-xs leading-[1.35]">
                    <div>{{ t('index.i1') }}</div>
                    <div class="mt-1 font-semibold">{{  (showBalance ? '*****' : UseExchangeNumber(balanceList.totalAsset)) }}</div>
                  </div>
                </div>
              </div>

              <div class="min-w-0 rounded-2xl bg-[linear-gradient(135deg,var(--mainColor)_0%,#244ee6_100%)] p-3 shadow-[0_10px_24px_rgba(45,87,255,0.18)]">
                <div class="grid gap-2">
                  <div class="flex min-w-0 items-center justify-between gap-2 text-[12px] text-white"
                    v-for="(item, index) in balanceBox" :key="index">
                    <div class="flex min-w-0 flex-1 items-center gap-2">
                      <div class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: item.color }"></div>
                      <div class="flex min-w-0 flex-1 items-center">
                        <span class="min-w-0 truncate">{{ item.name }}</span>
                        <img v-if="index == 0" :src="showBalance ? eyeClose : eyeOpen" class="ml-1 h-4 w-4 shrink-0" @click="showBalance = !showBalance">

                      </div>
                    </div>
                    <div class="max-w-[48%] shrink-0 truncate text-right font-semibold">{{ getCurrency() +(showBalance ? '*****' : UseExchangeNumber(item.amount)) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
            <div class="border-b border-[rgba(45,87,255,0.08)] bg-[linear-gradient(135deg,var(--mainColor)_0%,#244ee6_100%)] p-3">
              <div class="grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-1 text-center">
              <button
                v-for="(tab, index) in recordTypeTabs"
                :key="index"
                type="button"
                class="rounded-xl px-2 py-2 text-sm font-semibold transition-all duration-200"
                :class="actRecordType == tab.type ? 'bg-white text-[var(--mainColor)] shadow-[0_8px_20px_rgba(9,26,99,0.12)]' : 'bg-transparent text-white/80'"
                @click="changeRecordType(tab.type)">
                {{ tab.text }}
              </button>
              </div>
            </div>

            <div class="px-4 py-4">
              <div class="contentBtn mb-4 mt-1" v-if="actRecordType == 3" @click="changePage('/trade/spoRecord')">
                {{ $t('comm.c5') }}
              </div>

              <InvestReocrdList :type="actRecordType" @updateUserBalance="getData" />
            </div>

          </div>

        </div>
      </ClientOnly>
    </div>

    <Tabbar />
  </section>
</template>
