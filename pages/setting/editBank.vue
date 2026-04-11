<script setup lang="ts">
import * as v from 'valibot';
import { showToast } from 'vant';
import { reactive, ref, computed, onMounted } from 'vue'; // 确保引入需要的 vue API
import { useRoute } from 'vue-router';
import { getUserBankcardInfo, postUserBankcard } from '~/api/home/home';

const { t, locale } = useI18n()
const route = useRoute();
const pub = usePublicStore();

const formRef = ref();
const balanceTypeList = ref<any[]>([]);
const showBalanceTypePicker = ref(false)

const state = reactive({
  id: Number.isNaN(Number(route.query.bankId)) ? 0 : Number(route.query.bankId),
  balance_type: 0,
  bank_num: '',
  bank_name: '',
  account_holder: '',
  other_param_1: '',
  other_param_2: '',
  other_param_3: '',

})

const schema = v.object({
  bank_num: v.pipe(
    v.string(),
    v.nonEmpty(t('setting.s7')),
  ),
  bank_name: v.pipe(
    v.string(),
    v.nonEmpty(t('setting.s8')),
  ),
  account_holder: v.pipe(
    v.string(),
    v.nonEmpty(t('setting.s9')),
  ),
  other_param_1: v.pipe(
    v.string(),
    v.nonEmpty(t('setting.s10')),
  ),
  other_param_2: v.pipe(
    v.string(),
    v.nonEmpty(t('setting.s21')),
  ),
  balance_type: v.pipe(
    v.number(),
    v.check(
      (input) => balanceTypeList.value.length === 0 || !!input,
      t('setting.s11')
    ),
  ),
})

type Schema = v.InferOutput<typeof schema>

const valibotValidator = (fieldKey: keyof typeof schema.entries) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

const balanceTypeColumns = computed(() => balanceTypeList.value.map((i: any) => ({ text: i.name, value: i.type })))

const selectedBalanceTypeName = computed(() => {
  const cur = balanceTypeList.value.find((i: any) => i.type === state.balance_type)
  return cur ? cur.name : ''
})

const onBalanceTypeConfirm = (...args: any[]) => {
  if (args.length >= 2 && typeof args[1] === 'number') {
    const index = args[1]
    const item = balanceTypeList.value[index]
    if (item) state.balance_type = item.type
  } else {
    const opt = args[0]?.selectedOptions?.[0]
    if (opt && Object.prototype.hasOwnProperty.call(opt, 'value')) {
      state.balance_type = opt.value
    }
  }
  showBalanceTypePicker.value = false
  formRef.value?.validate('balance_type');
}

const router = useRouter()
const handleSubmit = () => {
  const data: any = Object.assign({}, state);
  pub.showLoading = true;
  postUserBankcard(data).then(res => {
    showToast(data.id ? t('setting.s12') : t('setting.s13'));
    router.back();
  }).finally(() => {
    pub.showLoading = false;
  });
}

onMounted(() => {
  const bankId = Number(route.query.bankId);

  getUserBankcardInfo(bankId).then((res: any) => {
    const { bankcard, balanceList } = res;
    balanceTypeList.value = balanceList || [];

    if (bankcard) {
      Object.assign(state, bankcard);
    } else if (balanceList && balanceList.length > 0) {
      state.balance_type = balanceList[0].type;
    }
  }).finally(() => {
    pub.showLoading = false
  });
})

</script>

<template>
  <div class="">
    <second-page-nav-bar :title="$t('setting.s14')"></second-page-nav-bar>

    <div class="flex items-center justify-center flex-col py-4 bg-[#ECF4FE]">
      <img src="~/assets/images/icon/editBankIco.png" class="w-[46px] h-[46px]">
      <div class="mt-2">
        {{ $t('setting.s15') }}
      </div>
    </div>

    <div class="px-3 ">
      <van-form ref="formRef" class="mt-7" @submit="handleSubmit">

        <div v-if="balanceTypeList.length > 0" class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('setting.s20') }}</div>

          <van-field :model-value="selectedBalanceTypeName" name="balance_type" readonly is-link
            :placeholder="$t('setting.s20')" :border="false" input-align="left" class="rounded-input mt-2 items-center"
            @click="showBalanceTypePicker = true"
            :rules="[{ validator: valibotValidator('balance_type'), trigger: 'onChange' }]" />
        </div>
        <van-popup v-model:show="showBalanceTypePicker" position="bottom" round>
          <van-picker :confirm-button-text="$t('mine.m10')" :cancel-button-text="$t('mine.m11')"
            :columns="balanceTypeColumns" @confirm="onBalanceTypeConfirm" @cancel="showBalanceTypePicker = false" />
        </van-popup>

        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('xx.a4') }} </div>
          <van-field v-model="state.account_holder" name="account_holder" :placeholder="$t('xx.a4')" :border="false"
            input-align="left" class="rounded-input mt-2"
            :rules="[{ validator: valibotValidator('account_holder') }]" />
        </div>

        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('xx.a6') }}</div>
          <van-field v-model="state.bank_name" name="bank_name" :placeholder="$t('xx.a6')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('bank_name') }]" />
        </div>
        <div class="form-block mt-2">
          <div class="form-label color000 font-bold">{{ $t('xx.a3') }}</div>
          <van-field v-model="state.bank_num" name="bank_num" :placeholder="$t('setting.s17')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('bank_num') }]" />
        </div>




        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('setting.s21') }}</div>
          <van-field v-model="state.other_param_2" name="other_param_2" :placeholder="$t('setting.s21')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('other_param_2') }]" />
        </div>

        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('setting.s23') }}</div>
          <van-field v-model="state.other_param_3" name="other_param_3" :placeholder="$t('setting.s23')" :border="false"
            input-align="left" class="rounded-input mt-2" />
        </div>


        <div class="form-block mt-4 mb-4">
          <div class="form-label color000 font-bold">{{ $t('xx.a5') }}</div>
          <van-field v-model="state.other_param_1" name="other_param_1" :placeholder="$t('xx.a5')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('other_param_1') }]" />
        </div>

        <div style="height: 60px;"></div>

        <div class="p-0 m-0 bg-[transparent] submit">
          <button class="contentBtn" type="submit">{{ $t('setting.s25') }}</button>
        </div>
      </van-form>
    </div>

  </div>

</template>

<style lang="less" scoped>
.submit {
  left: 0px;
  width: 100%;
  position: fixed;
  bottom: 0px;
  box-sizing: border-box;
  padding: 10px 16px;
  background-color: #fff;
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
  box-shadow: 0 0 10px 1px #e8e8e8;
}

:deep(.rounded-input .van-field__value) {
  padding: 8px 0;
}

:deep(.rounded-input .van-field__control) {
  font-size: 14px;
}
</style>
