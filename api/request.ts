import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCookie } from "nuxt/app";
import { showToast } from "vant";
import { usePublicStore } from "~/stores/publicData";

interface HttpResponse<T> {
  code: number;
  message: string;
  data: T;
}
// 存储所有进行中的请求
const pendingRequests = new Map<string, AbortController>();
/**
 * 生成请求的唯一标识
 */
function generateRequestKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}
function addPendingRequest(config: AxiosRequestConfig) {
  // 检查是否可取消
  const cancelable = config.headers?.["X-Cancelable"] !== "false";

  if (!cancelable) {
    return; // 不可取消的请求，不添加到 pending 列表
  }

  const requestKey = generateRequestKey(config);

  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey);
    controller?.abort();
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
}
/**
 * 从 pending 列表中移除请求
 */
function removePendingRequest(config: AxiosRequestConfig) {
  const requestKey = generateRequestKey(config);

  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey);
  }
}

/**
 * 取消所有 pending 请求
 */
export function cancelAllPendingRequests(
  message = "Route changed, request cancelled"
) {
  pendingRequests.forEach((controller) => {
    controller.abort(message);
  });
  pendingRequests.clear();
}

/**
 * 取消指定的请求
 */
export function cancelRequest(config: AxiosRequestConfig) {
  const requestKey = generateRequestKey(config);
  const controller = pendingRequests.get(requestKey);

  if (controller) {
    controller.abort();
    pendingRequests.delete(requestKey);
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
});

// 辅助函数：读取指定名称的 cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}
// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    let lang = "en";
    let token = "";
    // 确保在浏览器环境执行
    if (typeof window !== "undefined") {
      const cookieLang = getCookie("i18n_redirected");
      lang = cookieLang || "ja";
      token = localStorage.getItem("token") || "";
    }
const pub = usePublicStore();

    config.headers = {
      ...config.headers,
      lang: lang,
      authorization: token || "",
      "market-type": pub.plantCurrencyList[0]? pub.plantCurrencyList[0].market_type :'2',
    };

    // 添加到 pending 列表
    addPendingRequest(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<HttpResponse<any>>) => {
    // 请求完成，从 pending 列表中移除
    removePendingRequest(response.config);

    // 服务异常
    if (response.status === 502) {
      return Promise.reject({ message: "Abnormal service" });
    }

    // 未找到
    if (response.status === 404) {
      return Promise.reject({ message: `[404] ${response.config.url}` });
    }

    // 成功
    if (response.status === 200) {
      const pub = usePublicStore();
      pub.$patch({
        showLoading: false,
        actionLoading: false,
      });

      const data = response.data as Record<string, any>;
      const { code, message } = data;

      switch (code) {
        case 1000:
          return Promise.resolve(data.data);

        case 1002:
          pub.show209Modal(true);
          return Promise.reject({ message: "" });

        case 2000:
          showToast(message);
          return Promise.reject({ message, code, data });

        default:
          return Promise.reject({ message, code, data });
      }
    }

    return response;
  },
  (error) => {
    // 请求失败，从 pending 列表中移除
    if (error.config) {
      removePendingRequest(error.config);
    }

    // 如果是取消请求，不做处理
    if (axios.isCancel(error)) {
      return Promise.reject({ message: "Request cancelled", cancelled: true });
    }

    if (error.response?.status === 401) {
      const currentRoute = window.location.pathname;
      // 如果当前不在登录页面，则跳转到登录页

      if (!currentRoute.startsWith("/auth/")) {


        window.location.href = "/auth/beforeLogin";
      }
    }

    if (error.response?.status === 500) {
      showToast(error.message);
      return Promise.reject({ message: error.message });
    }

    return Promise.reject({ message: error.message });
  }
);

// export default function request<T>(options: AxiosRequestConfig): Promise<T> {
//   return axiosInstance.request<T>({
//     ...options,
//     method: options.method || "GET",
//     url: options.url,
//   });
// }

export default function request<T>(
  options: AxiosRequestConfig & { cancelable?: boolean }
): Promise<T> {
  const { cancelable = true, ...axiosConfig } = options;

  return axiosInstance.request<T>({
    ...axiosConfig,
    method: axiosConfig.method || "GET",
    url: axiosConfig.url,
    // 添加自定义标记
    headers: {
      ...axiosConfig.headers,
      "X-Cancelable": cancelable.toString(),
    },
  });
}
