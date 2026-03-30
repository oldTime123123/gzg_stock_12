<!-- GlobalModal.vue -->
<template>
  <div class="modal flex  justify-center" v-if="showSignPop" @click="showModalPop = false">
    <!-- 圆角弹窗（居中） -->
    <div class="popContent mt-[200px] flex flex-col-reverse ">
      <div class="px-4  ">
        <div class="botContent px-3  rounded-sm bg-white py-4">
          <div class="flex items-center justify-between mb-1">
            <div>{{ t('x.a4') }}</div>
            <div class="mainTextColor">{{ ipoNoticeData.product?.pro_name }}({{ ipoNoticeData.product?.pro_code }})
            </div>
          </div>
          <div class="flex items-center justify-between mb-1">
            <div>{{ t('x.a5') }}</div>
            <div>{{ ipoNoticeData.buy_number }}</div>
          </div>
          <div class="flex items-center justify-between mb-1">
            <div>{{ t('x.a6') }}</div>
            <div>{{ ipoNoticeData.number }}</div>
          </div>
          <div class="contentBtn mt-3" @click="closePop">
            {{ t('mine.m10') }}
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const pub = usePublicStore()
const showSignPop = computed(() => {
  return pub.showIPONoticePop
})

const ipoNoticeData = computed(() => {
  return pub.ipoNoticeData
})
const route = useRoute()
const router = useRouter()
const closePop = () => {

  pub.showIPONoticePop = false
  if (route.fullPath == '/trade/spoRecord' || route.fullPath == '/trade/ipoRecord') {
    window.location.reload()
    return
  }
  if (ipoNoticeData.value.type < 2) {
    pub.ipoActRecordType = 2

    router.push('/trade/ipoRecord')
  } else {
    pub.spoActRecordType = 2

    router.push('/trade/spoRecord')
  }

}

</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  /* 其他样式 */
  .popContent {
    padding: 20px 10px;
    background: #fff;
    width: 80%;
    max-width: 300px;
    background: url('~/assets/images/img/ipoActSign.png') no-repeat;
    background-size: 100%;
    border-radius: 10px;
    width: 352px;
    height: 350px;
    padding-bottom: 50px;
  }

}
</style>
