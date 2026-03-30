<script setup lang="ts">
import * as v from 'valibot';
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import { showToast } from 'vant';
import { updatePwdApi } from "~/api/setting/index";

type Schema = v.InferOutput<typeof schema>
const publicStore = usePublicStore()
const { t } = useI18n()
const route = useRoute();

const formRef = ref();

const schema = v.pipe(
  v.object({
    val1: v.pipe(
      v.string(),
      v.nonEmpty(t('setting.s47')),
    ),
    val2: v.pipe(
      v.string(),
      v.nonEmpty(t('setting.s48')),
    ),
    val3: v.pipe(
      v.string(),
      v.nonEmpty(t('setting.s49')),
    ),
  }),
  v.forward(
    v.check(
      (input) => input.val2 === input.val3,
      t('setting.s50')
    ),
    ['val3']
  )
);

const state = reactive({
  val1: '',
  val2: '',
  val3: '',
})

const passwordState = reactive({
  showPwd1: false,
  showPwd2: false,
  showPwd3: false,
})

const curType = route.query.type

const valibotValidator = (fieldKey: keyof typeof state) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

watch(() => state.val2, () => {
  if (state.val3) {
    formRef.value?.validate('val3');
  }
});

const handleSubmit = () => {
  publicStore.showLoading = true
  const { val1, val2, val3 } = state;

  updatePwdApi({
    old_password: val1,
    password: val2,
    password2: val3,
    type: route.query.type
  }).then(res => {
    showToast(t('setting.s51'))
    Object.assign(state, {
      val1: '',
      val2: '',
      val3: '',
    })
  }).finally(() => {
    publicStore.showLoading = false;
  });
}

onMounted(() => {
  publicStore.showLoading = false
})
</script>

<template>
  <div class="">
    <second-page-nav-bar :title="curType > 0 ? $t('setting.s52') : $t('setting.s53')"></second-page-nav-bar>

    <div class="px-3 ">
      <van-form ref="formRef" class="mt-7" @submit="handleSubmit">

        <div class="form-block mt-2">
          <div class="form-label color000 font-bold">{{ $t('setting.s54') }}</div>
          <van-field name="val1" :type="passwordState.showPwd1 ? 'text' : 'password'" v-model="state.val1"
            :placeholder="$t('setting.s55')" :border="false" input-align="left" class="rounded-input mt-2"
            :rules="[{ validator: valibotValidator('val1') }]">
            <template #right-icon>
              <img :src="passwordState.showPwd1 ? eyeOpen : eyeClose" class="w-5 h-5 cursor-pointer"
                @click="passwordState.showPwd1 = !passwordState.showPwd1" />
            </template>
          </van-field>
        </div>

        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('setting.s56') }}</div>
          <van-field name="val2" :type="passwordState.showPwd2 ? 'text' : 'password'" v-model="state.val2"
            :placeholder="$t('setting.s57')" :border="false" input-align="left" class="rounded-input mt-2"
            :rules="[{ validator: valibotValidator('val2') }]">
            <template #right-icon>
              <img :src="passwordState.showPwd2 ? eyeOpen : eyeClose" class="w-5 h-5 cursor-pointer"
                @click="passwordState.showPwd2 = !passwordState.showPwd2" />
            </template>
          </van-field>
        </div>

        <div class="form-block mt-4">
          <div class="form-label color000 font-bold">{{ $t('setting.s58') }}</div>
          <van-field name="val3" :type="passwordState.showPwd3 ? 'text' : 'password'" v-model="state.val3"
            :placeholder="$t('setting.s59')" :border="false" input-align="left" class="rounded-input mt-2"
            :rules="[{ validator: valibotValidator('val3') }]">
            <template #right-icon>
              <img :src="passwordState.showPwd3 ? eyeOpen : eyeClose" class="w-5 h-5 cursor-pointer"
                @click="passwordState.showPwd3 = !passwordState.showPwd3" />
            </template>
          </van-field>
        </div>

        <div class="p-0 m-0 bg-[transparent] rounded-full mt-10">
          <button type="submit" class="contentBtn">
            {{ $t('setting.s60') }}
          </button>
        </div>

      </van-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
