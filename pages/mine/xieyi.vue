<script setup lang="ts">
import { getUserAgreement } from '~/api/home/home';

const { t } = useI18n();

const pdfUrl = ref('')
const getData =  () => {
   getUserAgreement().then(async (res) => {
     pdfUrl.value = res.agreement
  })
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <second-page-nav-bar :title="$t('x.a12')"></second-page-nav-bar>
    <ClientOnly>
        <VuePdfApp :pdf="pdfUrl"
          theme="light"  style="height: 100vh;" />
    </ClientOnly>
  </div>
</template>


<style lang="less" scoped>
#pdfBox {
  height: 800px;
}
</style>
