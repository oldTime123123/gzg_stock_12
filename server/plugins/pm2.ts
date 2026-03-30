export default defineNitroPlugin((nitroApp) => {
  // 当 Nitro 服务启动并开始监听时
  nitroApp.hooks.hook("render:response", () => {
    // 可以在这里逻辑判断，或者直接在插件加载时发送
  });

  // 最佳实践：在插件初始化后立即通知 PM2
  if (process.send) {
    process.send("ready");
  }
});
