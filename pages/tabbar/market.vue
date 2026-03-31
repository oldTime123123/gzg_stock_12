<script lang="ts" setup>
import { getStockIndexList } from "~/api/home/home"
import { LineOption } from "~/utils/indexLineStyle"
import upIcon from "~/assets/images/icon/upIcon.png"
import downIcon from "~/assets/images/icon/downIcon.png"

const { t } = useI18n()

const actRecordType = ref(0)
const tabs = ref([
  {
    text: t('market.m1'),
    type: 0,
  },
  {
    text: t('market.m2'),
    type: 1,
  },
])

const lineDataList = ref([])
const getData = () => {
  getStockIndexList().then((res: any) => {
    lineDataList.value = Array.isArray(res.index) && res.index.length > 1
      ? res.index.slice(0, 2)
      : res.index
  })
}

const route = useRoute()
onMounted(() => {
  if (route.query.type) {
    actRecordType.value = Number(route.query.type)
  }
  getData()
})

const changeLineTypeData = (data: any) => {
  const result = Array(100)
    .fill(null)
    .map((_, i) => data[i] ?? null)
  for (let i = 1; i < 100; i++) {
    if (result[i] == null) {
      result[i] = result[i - 1]
    }
  }

  return result
}

const pub = usePublicStore()
const changeDataType = (type: number) => {
  if (actRecordType.value == type) return
  actRecordType.value = type
  pub.showLoading = true
}
</script>

<template>
  <section>
    <div class="min-h-full">
      <TabbarTopNavBar />

      <div class="pageContainer mt-3 space-y-4 px-4 pb-2">
        <div class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-[linear-gradient(180deg,#dfe7ff_0%,#ffffff_24%,#ffffff_100%)] shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
          <div class="px-4 pt-4">
            <div class="text-[1.0625rem] font-extrabold leading-tight tracking-[-0.01em] text-[#243253]">{{ $t('market.m3') }}</div>
            <div class="mt-4 grid gap-3">
              <div
                v-if="lineDataList.length == 0"
                v-for="(item, index) in 2"
                :key="index"
                class="h-24 animate-pulse rounded-2xl bg-[#eaf0ff]"
              ></div>

              <div
                v-for="(item, index) in lineDataList"
                :key="item.pro_code || index"
                class="flex items-center gap-3 rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white px-3 py-3 shadow-[0_12px_24px_rgba(2,26,123,0.08)]"
              >
                <div class="w-[90px] shrink-0 rounded-2xl bg-[#ffda1c] p-2 text-center">
                  <div class="rounded-xl bg-[var(--mainColor)] px-2 py-1 text-[0.75rem] font-medium tracking-[0.04em] colorfff">
                    {{ item.exchange_name }}
                  </div>
                  <div class="mt-2 text-[1rem] font-bold tracking-[-0.02em] tabular-nums text-[#243253]">
                    {{ item.price }}
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <ClientOnly>
                    <apexchart
                      width="100%"
                      height="56"
                      type="area"
                      :options="LineOption"
                      :series="[
                        {
                          data: changeLineTypeData(item.chart.indicators.quote[0].close),
                        },
                      ]"
                    />
                  </ClientOnly>
                </div>

                <div class="w-[88px] shrink-0 text-right text-[0.875rem]" :class="getNumberClass(true,item.is_rise)">
                  <div class="flex items-center justify-end font-bold tracking-[-0.02em] tabular-nums">
                    <img :src="item.is_rise == 2 ? upIcon : downIcon" class="ml-1 h-3 w-3" alt="" />
                    {{ getNumberType(true, item.is_rise) + UseExchangeNumber(item.chart?.rise) }}
                  </div>
                  <div class="mt-2 rounded-xl bg-[#e5f0fe] px-2 py-1 text-[0.75rem] font-semibold tracking-[-0.01em] tabular-nums" :class="item.is_rise == 2 ? 'colorUp' : 'colorDown'">
                    {{ getNumberType(true, item.is_rise) }}{{ item.rise_rate }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 border-t border-[rgba(45,87,255,0.10)] p-3">
            <div class="grid grid-cols-2 gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--mainColor)_0%,#244ee6_100%)] p-1 text-center">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                type="button"
                class="rounded-xl px-3 py-2 text-[0.9375rem] font-semibold leading-none tracking-[-0.01em] transition-all duration-200"
                :class="actRecordType == tab.type ? 'bg-white text-[var(--mainColor)] shadow-[0_8px_20px_rgba(9,26,99,0.12)]' : 'bg-transparent text-white/80'"
                @click="changeDataType(tab.type)"
              >
                {{ tab.text }}
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white px-4 py-4 shadow-[0_14px_32px_rgba(2,26,123,0.10)]">
          <MarketRecordList v-if="actRecordType < 1" />
          <CollectStockList v-else @changeDataType="changeDataType" />
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>
