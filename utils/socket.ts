// utils/socket.js
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_WS, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  transports: ["websocket"],
  autoConnect: false, // 改为手动连接
});

// 添加错误处理
socket.on("connect_error", (err) => {
  console.error("Socket连接错误:", err.message);
});

export default socket;
