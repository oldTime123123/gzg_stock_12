

const LineOption = {
  chart: {
    sparkline: { enabled: true }, // ★ 开启迷你图模式，隐藏所有轴
    toolbar: { show: false },
  },
  stroke: { curve: "straight", width: 2 },
  fill: { opacity: 0.3 },
  colors: ["#ff4d4f"],
  tooltip: {
    enabled: false,
  },
  states: {
    hover: {
      filter: {
        type: "none", // 没有任何滤镜效果
      },
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: "none",
      },
    },
  },
};


const getCircleOption = (colors) => {
  return {
    chart: {
      type: "donut",
      animations: { enabled: true }, // 静态图表建议关动画
      selection: { enabled: false },
    },
    colors: colors, // 使用自定义颜色
    stroke: {
      show: true,
      width: 2, // 分割线宽度
      colors: ["#ffffff"], // 分割线白色
    },
    dataLabels: {
      enabled: false, // ★ 隐藏环上的数字
    },
    legend: {
      show: false, // ★ 隐藏自带图例 (我们要手写右边那个蓝框)
    },
    tooltip: {
      enabled: false, // 这种概览图通常不需要 tooltip，按需开启
    },
    states: {
      hover: {
        filter: {
          type: "none", // 没有任何滤镜效果
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
        },
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false, // ★★★ 4. 禁止点击时扇区弹出 (偏移)
        donut: {
          size: "75%",
        },
      },
    },
  };
};


export {
  LineOption,
  getCircleOption,
};
