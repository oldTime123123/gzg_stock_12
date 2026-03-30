<template>
  <div class="relative">
    <div id="klineChartBox" class="" style="width:100%;height:400px">
    </div>

    <div v-if="showSkeletonLoading" class="absolute h-[300px] z-10 w-full rounded-lg left-0 top-0 rounded-xs">

      <KlineLoading size="lg" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import {
  dispose,
  init
, registerIndicator
} from 'klinecharts';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { getKlineStyles } from '~/utils/lineChartStyle';
import KlineLoading from './KlineLoading.vue';
const klineStyles = getKlineStyles()

import treePath from '~/assets/images/tree.png';

import giftPath from '~/assets/images/gift.svg';
import santaPath from '~/assets/images/santa.svg';

const imageSourceKeys = [
  'image1',
  'image2',
]
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img;
};
const images = {
  image1: preloadImage(giftPath),
  image2: preloadImage(santaPath)
}
registerIndicator({
  name: 'merry christmas',
  series: 'price', // v10 建议指定 series，或者在 createIndicator 时指定 pane
  calc: (dataList) => {
    return dataList.map(kLineData => {
      // 1. 决定显示位置 (这里依然可以随机，或者根据阴阳线决定)
      // true = 显示在最高价上方, false = 显示在最低价下方
      const isUp = Math.random() > 0.5;

      // 2. 决定是否显示图片 (控制密度，比如 40% 的概率显示)
      const shouldShow = Math.random() > 0.6;

      let imgKey = null;

      if (shouldShow) {
        // 3. 【关键修改】不再随机选择图片，而是根据位置绑定图片
        if (isUp) {
          // 如果在上方，固定显示老人 (image2)
          imgKey = 'image2';
        } else {
          // 如果在下方，固定显示礼物 (image1)
          imgKey = 'image1';
        }
      }

      return {
        high: kLineData.high,
        low: kLineData.low,
        image: imgKey,
        up: isUp
      };
    });
  },
  draw: ({
    ctx,
    chart,
    indicator,
    xAxis,
    yAxis
  }) => {
    const visibleRange = chart.getVisibleRange();
    const { from, to } = visibleRange;
    const result = indicator.result;
    const size = 20;

    // 2. 定义最小间隔 (比如 3，表示两个图标中间至少隔 3 根 K 线)
    const minGap = 1;

    for (let i = from; i < to; i++) {
      const data = result[i];

      // 检查是否有数据和图片
      if (data && data.image) {

        // --- 新增逻辑: 间隔检查 ---
        // 这里的逻辑是：检查当前索引 i 前面的 minGap 根 K线
        // 如果前面几根里已经在数据层面标记了有图片，那么当前这根我们就不画了
        // 这样可以确保间隔逻辑是固定的，不会因为拖拽而闪烁
        let isTooClose = false;
        for (let j = 1; j <= minGap; j++) {
          const prevData = result[i - j];
          if (prevData && prevData.image) {
            isTooClose = true;
            break;
          }
        }

        // 如果太近了，就跳过这次循环，不绘制
        if (isTooClose) {
          continue;
        }
        // -------------------------

        // 下面是正常的绘制逻辑 (保持你修复后的 v10 写法)
        const xRes = xAxis.convertToPixel(i);
        const x = (typeof xRes === 'object' && xRes !== null) ? xRes.x : xRes;

        if (images[data.image]) {
          let y;
          if (data.up) {
            const yRes = yAxis.convertToPixel(data.high);
            const yVal = (typeof yRes === 'object' && yRes !== null) ? yRes.y : yRes;
            y = yVal - 6 - size;
          } else {
            const yRes = yAxis.convertToPixel(data.low);
            const yVal = (typeof yRes === 'object' && yRes !== null) ? yRes.y : yRes;
            y = yVal + 6;
          }

          if (typeof x === 'number' && typeof y === 'number') {
            ctx.drawImage(images[data.image], x - size / 2, y, size, size);
          }
        }
      }
    }

    // 绘制文字 (保持不变，Canvas API 通用)
    // ctx.font = 'bold 50px Helvetica Neue';
    // const merry = 'Merry';
    // const merryTextWidth = ctx.measureText(merry).width;
    // const merryGradient = ctx.createLinearGradient(50, 150, 50 + merryTextWidth, 150);
    // merryGradient.addColorStop(0, '#F92855');
    // merryGradient.addColorStop(1, '#1677FF');
    // ctx.fillStyle = merryGradient;
    // ctx.fillText(merry, 50, 10);

    // const christmas = 'Christmas !';
    // const christmasTextWidth = ctx.measureText(christmas).width;
    // const christmasGradient = ctx.createLinearGradient(50, 210, 50 + christmasTextWidth, 210);
    // christmasGradient.addColorStop(0, '#1677FF');
    // christmasGradient.addColorStop(1, '#A14DFD');
    // ctx.fillStyle = christmasGradient;
    // ctx.fillText(christmas, 50, 60);

    return false; // 必须返回 false 以阻止绘制默认图形（如果有的话）
  }
});

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
      chart.value.setBarSpace(10)
      chart.value.setSymbol({
        ticker: 'StockSymbol',
        pricePrecision: 3,
        volumePrecision: 3
      })
      // 圣诞主题
      // chart.value.createIndicator('merry christmas', false, { id: 'candle_pane' });
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

        if (dataList.length < 2) {
          chart.value.resetData(klineDataList);
          showSkeletonLoading.value = false
          return
        }
        const a = Number(dataList[0].timestamp);
        const b = Number(dataList[1].timestamp);
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
        if (curTypeVal.value !== timeType || timeDiff >= interval) {
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

            updateCallback(newData);

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
