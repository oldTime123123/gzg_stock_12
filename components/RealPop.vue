<!-- GlobalModal.vue -->
<template>
    <div class="modal flex items-center justify-center" v-if="showModalPop" @click="showModalPop = false">
        <!-- 圆角弹窗（居中） -->
        <div class="popContent">
            <div class="text-lg text-center"> {{ t('trade.t59') }}</div>
            <div class="text-sm mt-2">
                {{t('x.a1')}}
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2">
                <div class="borderContentBtn" @click="closePop(1)">
                    {{ t('mine.m11') }}
                </div>
                <div class="contentBtn" @click="closePop(2)">
                    {{ t('mine.m10') }}
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const pub = usePublicStore()
const { t } = useI18n();
const router = useRouter()
const showModalPop = computed({
    get: () => pub.show209PopFlag,
});
const closePop = type => {
    pub.show209Modal(false)
    if (type > 1) {
        router.push('/setting/identify')
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
    z-index:999;
    /* 其他样式 */
    .popContent {
        padding: 20px 10px;
        background: #fff;
        width: 80%;
        max-width: 300px;
        border-radius: 10px;
    }

}
</style>
