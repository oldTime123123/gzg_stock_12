// plugins/version-check.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  router.afterEach(async (to, from) => {
    if (import.meta.env.MODE === "development") return;
    try {
      const data = await $fetch<{ version: number | string }>(
        `/version.json?_t=${Date.now()}`,
        {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        }
      );

      const currentVersion = String(data.version);
      const lastVersion = localStorage.getItem("APP_VERSION");

      if (!lastVersion) {
        localStorage.setItem("APP_VERSION", currentVersion);
        return;
      }

      if (lastVersion !== currentVersion) {
        const pub = usePublicStore();
        if (pub.showLoading) pub.showLoading = false;

        localStorage.setItem("APP_VERSION", currentVersion);
        localStorage.setItem("NEED_REFRESH", "1");

      }
    } catch (error) {
      console.warn("版本检测失败:", error);
    }
  });
});
