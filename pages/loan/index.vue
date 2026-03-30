<script setup lang="ts">
import { showToast } from 'vant';
import { getLoanInfo, subLoanhandle } from '~/api/pay/realse';
import lIcon1 from '~/assets/images/icon/loan_com1.png';
import lIcon2 from '~/assets/images/icon/loan_com2.png';
import lIcon3 from '~/assets/images/icon/loan_com3.png';
const { t, locale } = useI18n()
const pub = usePublicStore()

const loanCom = computed(() => {
    return [
        {
            name: t('loan.l1'),
            icon: lIcon1
        },
        {
            name: t('loan.l2'),
            icon: lIcon2
        },
        {
            name: t('loan.l3'),
            icon: lIcon3
        },
    ]
})

const loanInfo = ref({
    credit_limit: 0,
    loan_status: 0,
    loanInfo: {
        total_loan: 0
    }
})
const getData = () => {
    getLoanInfo().then(res => {
        loanInfo.value = res
    })
}
const router = useRouter()
const changePage = (url: any) => {
    router.push(url)
}
const showPop = ref(false)
const goBackLoan = () => {
    if (loanInfo.value.user_loan < 2) {
        if (Number(loanInfo.value.loanInfo.loan_amount) == 0) {
            return showToast(t('x.a18'))
        }
        showPop.value = true

        inpVal.value = loanInfo.value.loanInfo.loan_amount
    } else {
        showToast(t('x.a14'))
    }
}
const inpVal = ref(0)
const confirmHandle = () => {
    if (inpVal.value < 1 || Number(inpVal.value) > Number(loanInfo.value.loanInfo.loan_amount)) {
        showToast(t('loan.l10'))
        return
    }
    const data = {
        amount: inpVal.value,
        type: 2,
    }
    showPop.value = false
    pub.showLoading = true
    subLoanhandle(data).then(res => {
        showToast(t('x.a19'))
        getData()
        inpVal.value = ""
    })
}
onBeforeMount(() => {
    getData()
})
</script>

<template>
    <div>
        <second-page-nav-bar :title="$t('loan.l4')"></second-page-nav-bar>
        <div class="px-3 mt-3">
            <div class="flex items-center justify-center">
                <div class="topBoxEl pb-10">
                    <div class="px-6  pt-7">
                        <div class="flex flex-row-reverse items-center colorfff"
                            @click="changePage('/record/loanRecord')">
                            <Icon class="w-5 h-5 cursor-pointer" name="line-md:chevron-right" />

                            {{ $t('loan.l5') }}

                        </div>
                        <div class="mt-[36px] text-center">
                            <div class=" text-lg text-[#FFDA1C] font-bold">
                                {{ UseExchangeNumber(loanInfo.credit_limit) }}
                            </div>
                            <div class=" text-sm colorfff">
                                {{ $t('loan.l6') }}
                            </div>
                        </div>

                        <div class="mt-8 grid grid-cols-3 place-items-center">
                            <div class="flex flex-col justify-center items-center" v-for="(item, index) in loanCom"
                                :key="index">
                                <div>
                                    <img :src="item.icon" class="w-12 h-12">
                                </div>
                                <div class="text-xs mt-2">
                                    {{ item.name }}
                                </div>
                            </div>
                        </div>
                        <div class="mt-6">
                            <div class="contentBtn" @click="loanInfo.loan_status > 0 ? changePage('/loan/loan') : ''"
                                :class="loanInfo.loan_status < 1 ? 'disBtn' : ''">
                                {{ $t('loan.l7') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-3">
                <div class="flex items-center justify-between bg-[#ECF4FE] py-3 pl-3 pr-1 rounded-xl"
                    @click="goBackLoan">
                    <div class="flex items-center">
                        <img src="~/assets/images/icon/loan_b1.png" class="w-8 h-8">
                        <div class="ml-2">
                            <div class="text-sm mainTextColor font-bold">{{ $t('loan.l8') }}</div>
                            <div class="text-xs">{{ $t('loan.l9') }}</div>

                        </div>
                    </div>
                    <Icon class="w-8 h-8 cursor-pointer mainTextColor" name="line-md:chevron-right" />
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

                    <div class="mt-5 px-6  font-bold">
                        <div class="mt-3">{{ $t('x.a15') }}:{{ loanInfo.loanInfo.loan_amount }}</div>
                        <div class="mt-3">{{ $t('x.a16') }}</div>

                        <div class="borderB pb-1 mt-1">
                            <van-field type="digit" v-model="inpVal" :placeholder="$t('x.a17')"
                                class="w-full rounded-input" :border="false" input-align="left" />
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-3">
                            <div class=" borderContentBtn" @click="showPop = false">{{ $t('loan.l19') }}</div>

                            <div v-if="loanInfo.loan_status > 0" class=" contentBtn" @click="confirmHandle"
                                :class="loanInfo.loan_status < 1 ? 'disBtn' : ''">{{ $t('loan.l20') }}</div>

                            <div v-else class=" contentBtn" :class="loanInfo.loan_status < 1 ? 'disBtn' : ''">
                                {{ $t('loan.l20') }}</div>



                        </div>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<style lang="less" scoped>
.topBoxEl {
    background: url('~/assets/images/img/loan_bg.png') no-repeat;
    background-size: 100%;
    background-position: top center;
    width: 366px;
    height: 344px;

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

.disBtn {
    background: #ccc !important;
}

:deep(.rounded-input) {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 0 10px 1px #e8e8e8;
}

:deep(.rounded-input .van-field__value) {
    padding: 0 0;
}

:deep(.rounded-input .van-field__control) {
    font-size: 14px;
}
</style>
