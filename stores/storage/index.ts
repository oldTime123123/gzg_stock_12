const localStorage = window ? window.localStorage : persistedState.localStorage;

function key(name: string): string {
  // @ts-ignore
  return name;
  //return name.toLocaleUpperCase('en-US');
}

// 1、window.localStorage 浏览器永久缓存
export const storage = {
  // 设置永久缓存
  set<T>(name: string, value: T) {
    let raw = JSON.stringify(value);
    localStorage.setItem(key(name), raw);
  },
  // 获取永久缓存
  get<T>(name: string, defaultValue?: T): T {
    let raw = localStorage.getItem(key(name));
    if (raw == null) {
      return defaultValue as T;
    }
    return JSON.parse(raw);
  },
  // 移除永久缓存
  remove(...names: string[]) {
    names.forEach((name) => localStorage.removeItem(key(name)));
  },
  // 移除全部永久缓存
  clear() {
    localStorage.clear();
  },
  getItem(name: string) {
    return localStorage.getItem(key(name));
  },
  setItem(name: string, value: string) {
    return localStorage.setItem(key(name), value);
  },
};
