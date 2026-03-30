<script setup lang="ts">
import { showToast } from 'vant'
import { getLoanInfo, subLoanhandle } from '~/api/pay/realse'
const { t, locale } = useI18n()
const pub = usePublicStore()
const showPop = ref(false)

const inpVal = ref("")
const confirmHandle = () => {
    if (inpVal.value < 1 || Number(inpVal.value) > Number(loanInfo.value.credit_limit)) {

        showToast(t('loan.l10'))
        return
    }
    const data = {
        amount: inpVal.value,
        type: 1,
    }
    showPop.value = false
    pub.showLoading = true
    subLoanhandle(data).then(res => {
        showToast(t('loan.l11'))
        getData()
        inpVal.value = ""
    })
}

const loanInfo = ref({
    credit_limit: 0
})
const getData = () => {
    getLoanInfo().then(res => {
        loanInfo.value = res
    })
}
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let value = target.value
  value = value.replace(/[^\d.]/g, "")
  if (value.indexOf('.') === 0) {
    value = '0' + value
  }
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
  inpVal.value = value
  target.value = value
}
onMounted(() => {
    getData()
})
</script>

<template>
    <div class="loanPage">
        <second-page-nav-bar :title="$t('loan.l12')"></second-page-nav-bar>
        <div style="width: 375px;margin-left: auto; margin-right: auto">
            <div class="loanBoxEl px-8 pt-[100px]">
                <div class="colorfff">
                    <div class="">
                        {{ $t('loan.l13') }}
                    </div>
                    <div class="mt-1 text-[#FFDA1C] font-bold pb-2 borderB">
                        {{ UseExchangeNumber(loanInfo.credit_limit) }}
                    </div>
                    <div class="mt-3 p-3 bg-[#ECF4FE] rounded-lg text-sm color000" style="min-height: 4.2em;">
                        {{ $t("loan.l14") }}
                    </div>
                    <div class="contentBtn mt-8" @click="showPop = true">
                        {{ $t('loan.l15') }}
                    </div>
                </div>
            </div>
        </div>

        <van-overlay :show="showPop" @click="showPop = false">
            <div class="flex justify-center items-center h-full">
                <div class="bg-white tradePopContent h-[400px] w-[350px] relative" @click.stop>
                    <div class="absolute right-[0px] top-[30px]">
                        <Icon class="w-7 h-7 colorfff" @click="showPop = false" name="fontisto:close" />
                    </div>
                    <div class="pt-16 text-right pr-5 colorfff font-bold">
                        {{ $t('loan.l16') }}
                    </div>
                    <div class="mt-8 px-6  font-bold">
                        <div>{{ $t('loan.l17') }}</div>

                        <div class="borderB pb-1 mt-3">
                            <van-field type="text" v-model="inpVal" :placeholder="$t('loan.l18')"
                                class="w-full rounded-input" :border="false" input-align="left" @input="handleInput" />
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class=" borderContentBtn" @click="showPop = false">{{ $t('loan.l19') }}</div>

                            <div class=" contentBtn" @click="confirmHandle">{{ $t('loan.l20') }}</div>

                        </div>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>



<style lang="less" scoped>
.loanPage {
    background-image: url('~/assets/images/img/loanBot.png');
    background-color: var(--mainColor);
    background-repeat: no-repeat;
    min-height: 100vh;
    background-size: 100%;
    background-position: bottom;

    .loanBoxEl {
        background-image: url('~/assets/images/img/loanTopBg.png');
        height: 370px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top;

        .borderB {
            border-bottom: 3px solid #fff;
        }
    }
}

.tradePopContent {
    background: url('~/assets/images/img/dailyTradeBg.png') no-repeat;
    background-size: contain;

    .borderB {
        border-bottom: 1px solid #000;

        input {
            font-size: 12px;
        }
    }

    :deep(.w-full) {
        border: none;
        outline: none;
        box-shadow: none;
    }
}

:deep(.rounded-input) {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 10px 1px #e8e8e8;
}
:deep(.rounded-input .van-field__value) { padding: 0 0; }
:deep(.rounded-input .van-field__control) { font-size: 14px; }
</style>
