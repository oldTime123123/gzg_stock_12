<template>
  <div class="relative h-[250px] w-full">
    <div id="klineChartBox" style="width: 100%; height: 250px"></div>
    <div v-if="showSkeletonLoading"
      class="absolute h-full w-full left-0 animate-pulse top-0 bg-[#E5F0FE] rounded-xs"></div>

 </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, nextTick } from "vue";
import { dispose, init } from "klinecharts";
import { useI18n } from "vue-i18n";
import { getKlineStyles } from "~/utils/lineChartStyle";
import { exchangeKLineDta } from "../../utils";
import { registerIndicator } from "klinecharts";

const { t } = useI18n();
const klineStyles = getKlineStyles("none");

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
const showSkeletonLoading = ref(true);
const emit = defineEmits(["updateHomeKlineTopData"]);
const chart = ref(null);

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
    const size = 15;

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

const initKlineData = (data) => {
  if (!data || data.indicators.quote[0].length <1 ) return;

  const klineData = exchangeKLineDta(data);
  // const klineData = cleanDataList(rawData);
  if (klineData.length === 0) return;
  const newLastBar = klineData[klineData.length - 1];
  emit("updateHomeKlineTopData", newLastBar);

  if (chart.value) return;

  chart.value = init("klineChartBox");

  chart.value.setOffsetRightDistance(10);
  chart.value.setBarSpace(10);
  chart.value.setStyles(klineStyles);
  chart.value.setSymbol({ ticker: 'TestSymbol' })
  //  type: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  chart.value.setPeriod({ span: 1, type: 'minute' })
  // chart.value.createIndicator('merry christmas', false, { id: 'candle_pane' });

  chart.value.setDataLoader({
    getBars: ({ callback }) => {
      callback(klineData)
    }
  })
  showSkeletonLoading.value = false;

};

onUnmounted(() => {
  if (chart.value) {
    dispose("klineChartBox");
    chart.value = null;
  }
});

defineExpose({
  initKlineData,
});
</script>
