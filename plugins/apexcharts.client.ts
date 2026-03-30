// plugins/apexcharts.client.ts
import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin((nuxtApp) => {
  // 全局注册组件，这样你在任何页面都可以直接用 <apexchart>
  nuxtApp.vueApp.use(VueApexCharts);
});
