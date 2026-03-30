import { defineNuxtPlugin } from "#app";

// 导入 Vant 所有的组件样式源文件 (LESS)
// 这会确保所有组件，包括函数式调用的 Toast、Dialog 等，都有正确的样式
import "vant/lib/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  // 这个插件的目的就是为了在构建时引入样式文件
  // 所以函数体内部可以为空
});
