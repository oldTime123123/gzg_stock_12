<template>
  <div class="relative">
    <div id="klineChartBox" class="" style="width:100%;height:400px">
    </div>

    <div v-if="showSkeletonLoading" class="absolute h-[300px] z-10 w-full rounded-lg left-0 top-0 rounded-xs">

      <KlineLoading size="lg" />
    </div>

  </div>
</template>

<script setup>
import {
  dispose,
  init
} from 'klinecharts';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { getKlineStyles } from '~/utils/lineChartStyle';
import KlineLoading from './KlineLoading.vue';
const klineStyles = getKlineStyles()

const showSkeletonLoading = ref(true)
const emit = defineEmits()
const chart = shallowRef("")
// 1. 在外部或组件作用域保存更新回调
let updateCallback = null;
const curTypeVal = ref("")
const updateKlineData = (rawData, timeType) => {
  const klineDataList = exchangeKLineDta(rawData)
  if (!klineDataList || klineDataList.length === 0) return
  const latestBar = klineDataList[klineDataList.length - 1]
  try {
    emit('updateHomeKlineTopData', latestBar)
    if (!chart.value) {
      chart.value = init('klineChartBox')

      chart.value.createIndicator('MACD', false, { height: 150, dragEnabled: false })
      chart.value.setStyles(klineStyles)
      chart.value.setBarSpace(7)
      chart.value.setSymbol({
        ticker: 'StockSymbol',
        pricePrecision: 3,
        volumePrecision: 3
      })
      chart.value.setSymbol({ ticker: 'TestSymbol' })
      //  type: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      chart.value.setPeriod({ span: 2, type: 'minute' })
      curTypeVal.value = timeType
      chart.value.setDataLoader({
        getBars: ({ callback }) => {
          callback(klineDataList, { hasMore: false });
        },
        subscribeBar: ({ callback }) => {
          updateCallback = callback;
        },
        unsubscribe: () => {
          updateCallback = null;
        }
      });
      showSkeletonLoading.value = false
    } else {
      if (updateCallback) {
        const dataList = chart.value.getDataList();
        const a = Number(dataList[10].timestamp);
        const b = Number(dataList[11].timestamp);
        const interval = Math.abs(a - b);
        const lastBar = dataList[dataList.length - 1];
        const latestBar = klineDataList[klineDataList.length - 1];
        const newData = {
          timestamp: lastBar.timestamp,
          open: Number(latestBar.open),
          high: Number(latestBar.high),
          low: Number(latestBar.low),
          close: Number(latestBar.close),
          volume: Number(latestBar.volume)
        };

        let c = Number(latestBar.timestamp)
        let d = Number(lastBar.timestamp);
        const timeDiff = Math.abs(c - d);

        if (curTypeVal.value !== timeType) {

          // updateCallback(klineDataList)
          curTypeVal.value = timeType
          if (timeType == 'month' || timeType == 'year') {
            chart.value.setPeriod({ span: 1, type: 'day' });
          } else {
            chart.value.setPeriod({ span: 2, type: 'minute' });
          }
          chart.value.setDataLoader({
            getBars: ({ callback }) => {
              callback(klineDataList, { hasMore: false });
            },
            subscribeBar: ({ callback }) => {
              updateCallback = callback;
            },
            unsubscribe: () => {
              updateCallback = null;
            }
          });

        } else {
          if (timeDiff >= interval) {
            updateCallback(latestBar);
          } else {
            updateCallback(newData);
          }
        }
      }
      showSkeletonLoading.value = false
    }
  } catch (e) {
    console.log('kline error:', e);
  }


}
defineExpose({
  updateKlineData,
  chart,
  showSkeletonLoading
})

</script>
