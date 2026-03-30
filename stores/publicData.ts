import { defineStore } from "pinia";
import { storage } from "./storage";
import { getPlantCurrency } from "~/api/home/home";
import { ipoNoticeApi } from "~/api/ipo";
import { getWebSite } from "../api/home/home";

// 数据版本号，更新时请修改此值
const version = 2512122353;

export const usePublicStore = defineStore("publicStoreSCR", {
  persist: {
    key: "publicStore",
    storage: persistedState.localStorage, // 只在客户端加载
  },
  state: () => ({
    userInfo: {},
    selectNews: {
      name: "",
      full_cover: "",
      show_time_format: "",
      des: "",
    }, //选中的新闻
    plantCurrencyList: [], //平台货币列表
    currency: "", //平台货币符号
    appData: {}, //app数据
    showLoading: false,
    loadingText: "Loading",
    actionLoading: false,
    loadingMsg: "",
    rechargeTypeList: [], //充值列表类型
    selectRechargeType: {},
    webSiteData: {}, // 网站信息
    show209PopFlag: false, //展示209弹窗
    searchHistory: [], //搜索记录
    version: storage.get("version", 0), // 数据版本号
    showIPONoticePop: false,
    ipoNoticeData: {},
    cancelLixibaoFlag: false, //是否可以中断利息包订单
    actRecordType: 3, // 交易页面对应的tab索引
    ipoActRecordType: 0,
    spoActRecordType: 0,
    siteConfig: {
      seo_title: "",
      company: "",
      logo: "",
    },
    setLang:false,
    isLoginFlag: true,
    stockStatus: 1, //股市状态 1 开启 ，其他都是没有开启
  }),
  actions: {
    versionSafety() {
      if (this.version < version) {
        storage.set("version", version);
        return false;
      }
      return true;
    },
    show209Modal(type: boolean) {
      this.show209PopFlag = type;
    },
    getIpoNoticeStatus() {
      ipoNoticeApi().then((res) => {
        console.log("res", res);
        if (res[0]) {
          this.showIPONoticePop = true;
          this.ipoNoticeData = res[0];
        }
      });
    },
    initPlantformData() {
      getPlantCurrency().then((res) => {
        this.plantCurrencyList = res;
        this.currency = this.plantCurrencyList[0].currency;
      });
      getWebSite().then((res) => {
        this.siteConfig = res;
      });
    },
  },
});
