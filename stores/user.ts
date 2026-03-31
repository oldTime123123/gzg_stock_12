import { defineStore } from "pinia";
import { storage } from "./storage";

import { joinLogin, joinAccountRegister, getUserInfo } from "~/api/home/home";

type User = {
  rawAt: number;
  raw?: Record<string, any>;
};

export const useUserStore = defineStore("userStore", {
  persist: {
    key: "userStore",
    storage: storage,
  },
  state(): User {
    return {
      rawAt: 0,
      raw: undefined,
    };
  },
  getters: {
    data: ($state) => $state.raw || {},
  },
  actions: {
    isLogined() {
      return !!storage.getItem("token");
    },
    phoneLogin(account: string, password: string) {
      return new Promise<void>((resolve, reject) => {
        joinLogin({
          account,
          password,
        })
          .then((data: any) => {
            this.$patch({
              rawAt: Date.now(),
              raw: data.userInfo,
            });
            storage.setItem("token", data.accessToken);
            storage.setItem("tokenExpires", data.accessTokenExpires);
            resolve();
          })
          .catch(reject);
      });
    },
    accountRegister(
      account: string,
      password: string,
      password2: string,
      invite_code: string
    ) {
      return new Promise<void>((resolve, reject) => {
        joinAccountRegister({
          //country_code,
          account,
          password,
          password2,
          invite_code,
        })
          .then((data: any) => {
            this.$patch({
              rawAt: Date.now(),
              raw: data.userInfo,
            });
            storage.setItem("token", data.accessToken);
            storage.setItem("tokenExpires", data.accessTokenExpires);
            resolve();
          })
          .catch(reject);
      });
    },
    logout() {
      storage.setItem("token", "");
      storage.setItem("tokenExpires", "");
      this.$reset();
    },
    // 冲洗会员数据
    flush() {
      return new Promise<void>((resolve, reject) => {
        const now = Date.now();
        if (now - this.rawAt < 1e3) {
          return resolve();
        }
        this.rawAt = now;
        getUserInfo()
          .then((info: any) => {
            this.raw = info;
            resolve();
          })
          .catch(reject);
      });
    },
  },
});

// 兼容某些构建/缓存场景下错误的具名导入：import { state } from "~/stores/user"
// 这里不在模块顶层访问 pinia，只在被调用时返回 store 实例。
export const state = () => useUserStore();
