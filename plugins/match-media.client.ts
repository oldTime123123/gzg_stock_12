export default defineNuxtPlugin(() => {
  // 仅在客户端执行
  if (
    import.meta.client &&
    typeof window !== "undefined" &&
    window.matchMedia
  ) {
    //以此检查当前环境是否支持 addEventListener
    const mediaQueryList = window.matchMedia("(min-width: 1px)");

    if (!mediaQueryList.addEventListener) {
      console.log(
        "Detected legacy iOS device, polyfilling MediaQueryList.addEventListener"
      );

      // 备份原始的 matchMedia
      const originalMatchMedia = window.matchMedia;

      // 重写 window.matchMedia
      window.matchMedia = function (query) {
        const mql = originalMatchMedia.call(window, query);

        // 如果返回的对象没有 addEventListener，手动挂载一个
        if (!mql.addEventListener) {
          mql.addEventListener = function (type, listener) {
            // 将现代的 addEventListener 映射到旧的 addListener
            // 注意：'change' 事件对应旧版的监听行为
            if (type === "change") {
              this.addListener(listener);
            }
          };

          mql.removeEventListener = function (type, listener) {
            if (type === "change") {
              this.removeListener(listener);
            }
          };
        }

        return mql;
      };
    }
  }
});
