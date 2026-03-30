<script setup lang="ts">
import * as v from 'valibot';
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
type Schema = v.InferOutput<typeof schema>
import { vMaska } from 'maska/vue';
import { getBankWithdrawInfo, submitBankWithdraw } from '~/api/pay/realse';
import { getUserBankcardList } from '~/api/home/home';
import { showToast } from 'vant';
const { t, locale } = useI18n()
const user = useUserStore()

const schema = v.object({
  // amount: v.pipe(
  //     v.nonEmpty('Invalid amount'),
  // ),
  amount: v.pipe(v.string(), v.minLength(1, t('pay.p5'))),
  password: v.pipe(v.string(), v.minLength(6, t('pay.p6'))),
  bank: v.pipe(v.union([v.string(), v.number()]),
    v.nonEmpty(t('pay.p7')),
  )
})
const state = reactive({
  amount: '',
  password: '',
  bank: ""
})
const bankList = ref([
])
const showBankPicker = ref(false)
const bankColumns = computed(() => bankList.value.map((i: any) => ({ text: i.bank_name, value: i.id })))
const selectedBankName = computed(() => {
  const cur = bankList.value.find((i: any) => i.id == state.bank)
  return cur ? cur.bank_name : ''
})
const onBankConfirm = (...args: any[]) => {
  if (args.length >= 2 && typeof args[1] === 'number') {
    const index = args[1]
    const item = bankList.value[index]
    if (item) state.bank = item.id
  } else {
    const opt = args[0]?.selectedOptions?.[0]
    if (opt && Object.prototype.hasOwnProperty.call(opt, 'value')) {
      state.bank = opt.value
    }
  }
  showBankPicker.value = false
}

const withdrawInfo = ref({
  balance_max: 0,
  min: 0,
  max: 0,

})
const getData = () => {
  getBankWithdrawInfo().then(res => {
    withdrawInfo.value = res
  })
  getUserBankcardList().then(res => {
    bankList.value = res
  })
}

const pub = usePublicStore()
const formRef = ref("")
const showPwd = ref(false)
const handleSubmit = () => {


  const data = {
    amount: state.amount,
    password: state.password,
    bankId: state.bank
  }

  pub.showLoading = true
  submitBankWithdraw(data).then(res => {

    state.amount = ''
    state.password = ''
    state.bank = ''
    showToast($t('pay.p8'))
    getData()
  })
}

const router = useRouter()
const changePage = (url: any) => {
  if (url) {
    router.push(url)

  }
}
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let value = target.value
  value = value.replace(/[^\d.]/g, "")
  if (value.indexOf('.') === 0) {
    value = '0' + value
  }
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
  state.amount = value
  target.value = value
}
onBeforeMount(() => {
  console.log('withdraw page');
  getData()
})
</script>
<template>
  <div class="depositPage">
    <second-page-nav-bar :title="$t('pay.p9')" :hasNoBg="true"></second-page-nav-bar>

    <div class="balanceBox mt-3 flex items-center">
      <div class="pl-4 mt-3 text-center">
        <div class="text-sm">{{ $t('pay.p10') }}</div>
        <div class="mainTextColor font-bold mt-2">{{ UseExchangeNumber(withdrawInfo.balance_max) }}</div>
      </div>
    </div>
    <div class="mt-5 px-3">
      <van-form class="mt-7" @submit="handleSubmit">
        <div class="flex items-center justify-between colorfff">
          <div class="font-bold ">{{ $t('pay.p11') }}</div>
          <div class="text-sm " @click="state.amount = withdrawInfo.balance_max">{{ $t('pay.p12') }}</div>
        </div>

        <div class="form-block mt-2">
          <van-field type="text" v-model="state.amount" :placeholder="$t('pay.p13')" :border="false" input-align="left"
            class="rounded-input mt-1" @input="handleInput" />
        </div>
        <div class="mt-1 text-[#FFDA1C]">
          {{ $t('pay.p14') }}:{{ withdrawInfo.min + ' ~ ' + withdrawInfo.max }}
        </div>

        <div class="form-block mt-4">
          <div class="form-label text-[#fff] ">{{ $t('pay.p15') }}</div>
          <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" :placeholder="$t('pay.p16')"
            :border="false" input-align="left" class="rounded-input mt-2">
            <template #right-icon>
              <img :src="showPwd ? eyeOpen : eyeClose" class="w-5 h-5 cursor-pointer" @click="showPwd = !showPwd" />
            </template>
          </van-field>
        </div>

        <div class="form-block mt-4">
          <div class="form-label text-[#fff] ">{{ $t('pay.p17') }}</div>
          <div v-if="bankColumns.length > 0">
            <van-field v-if="bankList.length > 0" :model-value="selectedBankName" readonly is-link
              :placeholder="$t('pay.p18')" :border="false" input-align="left" class="rounded-input mt-2 items-center"
              @click="showBankPicker = true" />
            <van-popup v-model:show="showBankPicker" position="bottom" :confirm-text="'123'" round>
              <van-picker :confirm-button-text="$t('mine.m10')" :cancel-button-text="$t('mine.m11')" :columns="bankColumns" @confirm="onBankConfirm" @cancel="showBankPicker = false" />
            </van-popup>
          </div>
          <div @click="changePage('/setting/bankList')" v-else
            class="bg-white py-3.5 pl-4 pr-2 rounded-xl mt-2 text-[#CED3DD] flex items-center justify-between">
            {{ $t('pay.p19') }}
            <Icon class="w-6 h-6 mainTextColor" name="iconoir:page-right-solid"></Icon>
          </div>
        </div>

        <div class="p-0 m-0 bg-[transparent]  mt-10">
          <div class="contentBtn" @click="handleSubmit"> {{ $t('pay.p20') }}</div>
        </div>

      </van-form>

    </div>
  </div>
</template>


<style lang="less" scoped>
.depositPage {
  background-image: url('~/assets/images/img/czBg.png');
  background-color: var(--mainColor);
  background-repeat: no-repeat;
  min-height: 100vh;
  background-size: 100%;

  .balanceBox {
    background: url('~/assets/images/img/withdrawTopBg.png') no-repeat;
    background-size: contain;
    height: 110px;
  }

  .contentBtn {
    border: 1px solid #fff;
  }
}

.form-block {
  width: 100%;
}

.form-label {
  font-size: 16px;
}

:deep(.rounded-input) {
  background: #fff;
  border-radius: 16px;
}

:deep(.rounded-input .van-field__value) {
  padding: 8px 0;
}

:deep(.rounded-input .van-field__control) {
  font-size: 14px;
}
</style>
