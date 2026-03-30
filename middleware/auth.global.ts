import { cancelAllPendingRequests } from "../api/request";

export default defineNuxtRouteMiddleware((to, from) => {
  // if (window && !to.path.startsWith("/auth/")) {
  //   const user = useUserStore(); // 你用 pinia
  //   //   console.log('全局路由守卫：auth.nuxt.ts');
  //   // // 需要登录才能访问的页面
  //   if (!user.isLogined()) {
  //     return navigateTo("/auth/login?redirect=" + to.path);
  //   }
  // }
  const route = useRoute();
  const router = useRouter();
  const pub = usePublicStore();

  if (import.meta.client) {
    cancelAllPendingRequests();
  }

  pub.showLoading = true;
  if (import.meta.client) {
    if (route.path !== "/") {
      pub.isLoginFlag = false;
    } else {
      if (!localStorage.getItem("token")) {
        pub.isLoginFlag = true;
      }
    }
  }

  router.afterEach((to, from, failure) => {
    if (failure) {
      console.error("导航失败:", failure);
      return;
    }
    if (window && window.localStorage) {
      const isRefresh = localStorage.getItem("NEED_REFRESH") === "1";

      if (isRefresh) {
        localStorage.setItem("NEED_REFRESH", "0");
        // 刷新完成后的处理
        window.location.reload();
      }
    }
  });
});
