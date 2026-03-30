module.exports = {
  apps: [
    {
      name: "nuxt-app", // 应用名称
      exec_mode: "cluster", // 开启集群模式
      instances: "max", // 也可以指定固定的 CPU 核心数，如 2 或 4
      script: "./server/index.mjs", // Nuxt3 编译后的入口文件

      // 环境变量配置
      env: {
        PORT: 3912,
        NODE_ENV: "production",
      },

      // --- 关键配置：实现 0 秒闪断重启 ---
      wait_ready: true, // 等待应用发送 'ready' 信号后再认为启动成功
      listen_timeout: 10000, // 给应用最多 10 秒时间来启动并发送 ready 信号
      kill_timeout: 5000, // 在强制杀死旧进程前给它 5 秒时间处理完现有请求

      // 自动重启配置
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
