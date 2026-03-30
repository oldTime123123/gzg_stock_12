import dayjs from "dayjs";
const changeTime = (dateString) => {
  const date = new Date(dateString);

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 处理 0 小时
  const formattedHours = hours.toString().padStart(2, "0");

  return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

export const getKlineStyles = (type) => {
  return {
    mainIndicators: {
      show: true,
    },
    // locale: "en-US",
    timeAxis: {
      tickText: (timestamp: number) => {
        return dayjs(timestamp).format("YY-MM-DD");
      },
    },

    // timezone:"America/Boise",
    candle: {
      type: "candle_solid",
      tooltip: {
        // 也可以调整一下文字的大小或位置，配合 padding 使用
        showType: "rect", // 或者 'rect'
        showRule: type ? type : "follow_cross",
        offsetLeft: 0,
        offsetTop: 0,
        offsetRight: 0,
        offsetBottom: 20,
        custom: (dataList: object) => {
          if (!dataList.current) {
            return;
          }
          try {
            let currentData = dataList.current;
            const timestamp = currentData.timestamp;
            const close = UseExchangeNumber(currentData.close);
            const high = UseExchangeNumber(currentData.high);
            const open = UseExchangeNumber(currentData.open);
            const low = UseExchangeNumber(currentData.low);

            return [
              {
                title: "time",
                value: changeTime(timestamp),
              },
              {
                title: "始",
                value: open,
              },
              {
                title: "終",
                value: close,
              },
              {
                title: "高",
                value: high,
              },
              {
                title: "安",
                value: low,
              },
            ];
          } catch (error) {}
        },
      },
      priceMark: {
        last: {
          upColor: "#F92855", // 标签红涨
          downColor: "#2DC08E", // 标签绿跌
          text: { color: "#FFFFFF" },
        },
      },
      bar: {
        upColor: "#F92855",
        downColor: "#2DC08E",
        noChangeColor: "#888",
        upBorderColor: "#F92855",
        downBorderColor: "#2DC08E",
        noChangeBorderColor: "#888",
        upWickColor: "#F92855",
        downWickColor: "#2DC08E",
        noChangeWickColor: "#888",
        // upColor: "#2DC08E",
        // downColor: "#F92855",
        // noChangeColor: "#888888",
        // upBorderColor: "#2DC08E",
        // downBorderColor: "#F92855",
        // noChangeBorderColor: "#888888",
        // upWickColor: "#2DC08E",
        // downWickColor: "#F92855",
        // noChangeWickColor: "#888888",
      },
    },
    area: {
      lineSize: 1,
      lineColor: "#2196F3",
      value: "close",
      smooth: false,
      backgroundColor: [
        {
          offset: 0,
          color: "rgba(33, 150, 243, 0.01)",
        },
        {
          offset: 1,
          color: "rgba(33, 150, 243, 0.2)",
        },
      ],
      point: {
        show: true,
        radius: 4,
        rippleRadius: 8,
        animation: true,
        animationDuration: 1000,
      },
    },
    indicator: {
      padding: {
        top: 70, // 【关键】加大顶部间距，让柱状图不碰到文字
        bottom: 10,
      },
    },

    priceMark: {
      show: true,
      high: {
        show: true,
        color: "#D9D9D9",
        textMargin: 5,
        textSize: 10,
        textFamily: "Helvetica Neue",
        textWeight: "normal",
      },
      low: {
        show: true,
        color: "#D9D9D9",
        textMargin: 5,
        textSize: 10,
        textFamily: "Helvetica Neue",
        textWeight: "normal",
      },

      last: {
        show: true,
        // 'current_open' | 'previous_close'
        compareRule: "current_open",
        upColor: "#F92855",
        downColor: "#2DC08E",
        noChangeColor: "#888888",
        line: {
          show: true,
          // 'solid' | 'dashed'
          style: "dashed",
          dashedValue: [4, 4],
          size: 1,
        },
        text: {
          show: true,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: "fill",
          size: 12,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          // 'solid' | 'dashed'
          borderStyle: "solid",
          borderSize: 0,
          borderColor: "transparent",
          borderDashedValue: [2, 2],
          color: "#FFFFFF",
          family: "Helvetica Neue",
          weight: "normal",
          borderRadius: 2,
        },
      },
    },
  };
};
