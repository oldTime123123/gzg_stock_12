import { defineStore } from "pinia";

import {
  countryApi,
  registerSetting,
} from "~/api/home/home";
import { storage } from "./storage";

interface stateFace {
  areaCode: Record<string, any>;
  countryList: Record<string, any>[];
  registerChanel: Array<Number>;
  registerInviteCode: boolean;
  loginType: Array<string>;
  showCaptcha: Boolean;
  accInfo: string;
  rememberPwd: boolean;
  loading: boolean;
  loadingText:string;
}
export const useLoginStore = defineStore("loginStore", {
  persist: {
    key: "loginStore", //如果需要对存储的密钥key进行命名
    storage: storage,
  },
  state(): stateFace {
    return {
      areaCode: {}, //当前地区码
      countryList: [], //地区码列表
      registerChanel: [], //登录注册 类型
      registerInviteCode: false, //是否需要邀请码
      loginType: [], //展示在页面的类型
      showCaptcha: false,
      accInfo: "",
      rememberPwd: false, //记住密码
      loading: false,
      loadingText:""
    };
  },
  actions: {
    selectAreaCode(code: codeFace) {
      this.areaCode = code;
    },
    initLoginData() {
      countryApi().then((res: any) => {
        this.countryList = res;
        if (!this.areaCode.code) {
          this.areaCode = res[0];
        } else {
          let code = this.countryList.find((item) => {
            return item.id == this.areaCode.id;
          });
          if (code) {
            this.areaCode = code;
          } else {
            this.areaCode = res[0];
          }
        }
      });
      registerSetting().then((res: any) => {
        let channel = res.registerChannel.channel;
        this.registerInviteCode =
          res.registerInviteCode.status > 0 ? true : false;
        this.loginType = [];
        if (channel.includes(1)) {
          this.loginType.push("phone");
        }
        if (channel.includes(2)) {
          this.loginType.push("email");
        }
      });
    },
  },
});
