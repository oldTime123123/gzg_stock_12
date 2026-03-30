<template>
  <div
    class="k-line-loading-container flex flex-col items-center justify-center w-full h-full min-h-[240px] bg-white transition-opacity duration-300">
    <!-- 模拟 K 线跳动区域 -->
    <!-- 增加 w-full 和 justify-center 确保在大容器里也好看 -->
    <div class="flex items-end justify-center space-x-[3px] h-24 mb-8 w-full px-4">
      <div v-for="i in count" :key="i" class="flex flex-col items-center animate-k-pulse" :style="{
        animationDelay: `${i * 0.08}s`,
        opacity: 0.9
      }">
        <!-- 上影线 -->
        <div class="w-[1px] h-3" :class="getThemeColor(i, 'line')"></div>

        <!-- 蜡烛实体 -->
        <div class="w-[6px] sm:w-2 rounded-[1px] shadow-sm transition-all duration-500"
          :class="getThemeColor(i, 'body')" :style="{ height: getBodyHeight(i) }"></div>

        <!-- 下影线 -->
        <div class="w-[1px] h-3" :class="getThemeColor(i, 'line')"></div>
      </div>
    </div>

    <!-- 底部进度反馈 -->
    <div class="flex flex-col items-center space-y-3">
      <div class="w-32 h-[2px] bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-red-500 animate-k-progress"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @props count - 增加默认数量到 24 根，使画面更丰富
 */
const props = defineProps({
  count: {
    type: Number,
    default: 24
  }
})

/**
 * 颜色逻辑：红涨绿跌 (亚洲标准)
 * 这里的逻辑是交替模拟，也可以改为随机
 */
const getThemeColor = (index, type) => {
  // 模拟一段红多绿少的上涨趋势或波段
  const isRise = (index % 5 !== 0);

  if (type === 'body') {
    // 红涨: bg-red-500, 绿跌: bg-green-500
    return isRise ? 'bg-[#f23645]' : 'bg-[#089981]';
  }
  // 影线颜色稍微浅一点点
  return isRise ? 'bg-[#f23645]/80' : 'bg-[#089981]/80';
}

/**
 * 模拟 K 线实体高度
 * 使用一组预设高度配合 index 产生错落感
 */
const getBodyHeight = (index) => {
  const heights = [
    '1.2rem', '2.5rem', '1.8rem', '3.2rem', '1.5rem',
    '2.2rem', '2.8rem', '1.4rem', '2.0rem', '3.5rem',
    '1.0rem', '2.4rem'
  ];
  return heights[index % heights.length];
}
</script>

<style scoped>
/* 核心动画：缩放且上下浮动，模拟K线波动感 */
@keyframes k-pulse {

  0%,
  100% {
    transform: translateY(0) scaleY(1);
  }

  50% {
    /* 向上位移并纵向拉伸 */
    transform: translateY(-10px) scaleY(1.2);
  }
}

/* 底部进度条：无限循环滑动 */
@keyframes k-progress {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}

.animate-k-pulse {
  /* 增加一点弹性效果 */
  animation: k-pulse 1.6s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.animate-k-progress {
  animation: k-progress 2s infinite linear;
}

.k-line-loading-container {
  /* 优化移动端性能 */
  will-change: transform;
  contain: content;
}
</style>
