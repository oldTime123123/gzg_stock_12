import axios from "axios";
import { defineStore } from "pinia";
import { storage } from "./storage";
import socket from "~/utils/socket";
export const socketStore = defineStore("socketStoreId", {
  persist: {
    key: "socketDataStore", //如果需要对存储的密钥key进行命名
    storage: storage,
  },
  state: () => ({
    // 请求参数
    reqParams: {
      type: -1,
      range: "1d",
    },
    hasDefaultCoin: false,
    // 响应数据
    coinList: [],

    // 当前选中的币种ID
    currentCoin: {},
    currentPrice: 0,

    // 连接状态
    isConnected: false,

    // 重连定时器
    reconnectTimer: null,

    // 错误信息
    error: null,
    marketTypeList: [],
    klineData: [],
    currentCoinTime: "1min",
    selectTradeType: "spot",
    coinDetailInfo: {},
    searchHistory: [],
  }),

  getters: {
    // 数据是否过期（超过5分钟）
    isDataStale: (state) => {
      return Date.now() - state.responseData.timestamp > 300000;
    },
  },

  actions: {
    getProDetailInfo() {
      let data = {
        market_type: this.reqParams.type,
        pid: this.currentCoin.id,
      };
      getProductInfoApi(data).then((res) => {
        this.coinDetailInfo = res;
      });
    },
    // 初始化Socket连接
    initSocketConnection() {
      // if (this.isConnected) return

      try {
        // 连接Socket
        socket.connect("project");
        this.isConnected = true;

        // 设置事件监听
        this.setupSocketListeners();

        // 发送初始请求
        this.fetchData();
      } catch (err) {
        console.error("Socket连接失败:", err);
        this.error = err;
        this.scheduleReconnect();
      }
    },
    close() {
      socket.close();
    },
    // 设置Socket监听器
    setupSocketListeners() {
      socket.on("connect", (data) => {
        this.isConnected = true;
        this.error = null;
      });

      socket.on("disconnect", () => {
        this.isConnected = false;
        this.scheduleReconnect();
      });

      socket.on("error", (err) => {
        this.error = err;
      });

      // 数据处理
      socket.on("project", (data) => {
        this.handleResponseData(data);
      });
    },

    // 获取数据
    fetchData(params = {}) {
      // 合并请求参数
      const requestParams = {
        ...this.reqParams,
        ...params,
      };

      // 发送请求
      socket.emit("project", requestParams);

      // 更新本地参数
      this.reqParams = requestParams;
    },

    // 处理响应数据
    handleResponseData(data) {
      this.coinList = data.list;
      if (!this.currentCoin || !this.currentCoin.id) {
        this.currentCoin = this.coinList[0];
      }
    },

    /**
     *  @description 选择币种
     * */
    selectCoin(coin) {
      this.currentCoin = coin;
    },

    // 更新请求参数
    updateReqParams(params) {
      this.reqParams = {
        ...this.reqParams,
        ...params,
      };

      // 参数变化时重新获取数据
      if (this.isConnected) {
        this.fetchData();
      }
    },

    // 断开连接
    disconnect() {
      try {
        socket.disconnect("project");
        socket.close("project");
        this.isConnected = false;
        // this.scheduleReconnect()
      } catch (err) {
        console.error("断开连接失败:", err);
        this.error = err;
      }
    },

    // 安排重连
    scheduleReconnect() {
      this.clearReconnectTimer();
      this.reconnectTimer = setTimeout(() => {
        if (!this.isConnected) {
          this.initSocketConnection();
        }
      }, 1000); // 5秒后重试
    },

    // 清除重连定时器
    clearReconnectTimer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    },
    getYahooKlineData() {
      // getYahooKlineData
      getYahooKlineDataApi({
        pro_code: this.currentCoin.pro_code,
        range: this.reqParams.range,
        interval: "1h",
      }).then((res) => {
        this.klineData = exchangeKLineDta(res.chart.result[0]);
      });
    },
    getOptLineDataList() {
      if (this.reqParams.type !== 2) {
        this.getYahooKlineData();
        return;
      }
      const params = {
        period: this.currentCoinTime,
        size: 200,
        symbol: this.currentCoin.pro_name.toLocaleLowerCase() + "usdt",
      };
      let url = "https://api.huobi.pro/market/history/kline";
      axios
        .get(url, {
          params,
        })
        .then((res) => {
          this.klineData = changeDataType(res.data.data);
        });
    },
  },
});
