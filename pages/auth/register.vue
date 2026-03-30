<script setup lang="ts">
import * as v from 'valibot'
import { showToast } from 'vant';
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
const { t, locale } = useI18n()
const loginStore = useLoginStore();
const userStore = useUserStore();
const showPwd = ref(false);
const showFundPwd = ref(false);
const rememberPwd = ref(false);
const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val
};
const publicStore = usePublicStore()

const router = useRouter()
const changePage = (link: any) => {
  router.push(link)

}


const schema = v.object({
  //account: v.pipe(v.string(), v.email('Invalid email')),
  account: v.pipe(v.string(), v.minLength(1, t('login.l31'))),

  password: v.pipe(v.string(), v.minLength(6, t('login.l32'))),
  fundPwd: v.pipe(v.string(), v.minLength(6, t('login.l33'))),
  inviteCode: v.pipe(v.string(), v.minLength(6, t('login.l34'))),

})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  account: '',
  password: '',
  fundPwd: '',
  inviteCode: ''
})


onMounted(() => {

  loginStore.initLoginData()
})

watch(() => state.password, () => {
  // 如果第二个密码已经有值，就重新触发第二个密码的校验
  if (state.fundPwd) {
    formRef.value?.validate('fundPwd');
  }
});

const handleSubmit = async (values: any) => {

  if (!rememberPwd.value) {
    showToast(t('x.a24'))
    return
  }
  publicStore.showLoading = true
  const { account, password, fundPwd, inviteCode } = state;
  userStore.accountRegister(account, password, fundPwd, inviteCode).then(() => {
    loginStore.loadingText = t('login.l30')
    router.push('/')
  }).catch((err: any) => {
    loginStore.loading = false
  })
}

</script>
<template>
  <div class="loginPage">

    <van-sticky offset-top="0" @change="topFixedChange">
      <div class="px-3 pt-3 pb-8 bg-[#FFDB1D]">
        <div class="flex justify-between items-center mainTextColor ">
          <Icon @click="changePage('./login')" name="line-md:chevron-left" size="28" class="cursor-pointer" />
          <img src="~/assets/images/icon/langIcon.png" class="w-8 h-8 cursor-pointer"
            @click="changePage('/mine/language')" />
        </div>
        <div class="mt-3 px-5">
          <div class="text-4xl font-bold mainTextColor">
            {{ $t('login.l16') }}
          </div>
          <div class="mt-1">
            {{ $t('login.l17') }}
          </div>
        </div>
      </div>
    </van-sticky>
    <ClientOnly>
      <van-form class="px-8 mt-7" @submit="handleSubmit" ref="formRef">
        <div class="form-block">
          <div class="form-label">{{ $t('login.l18') }}</div>
          <van-field v-model="state.account" name="account" :placeholder="$t('login.l19')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ required: true, message: $t('login.l31') }]" />
        </div>

        <div class="form-block mt-6">
          <div class="form-label">{{ $t('login.l20') }}</div>
          <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
            :placeholder="$t('login.l21')" :border="false" input-align="left" class="rounded-input mt-2" :rules="[
              { required: true, message: $t('login.l32') },
              { pattern: /.{6,}/, message: $t('login.l32') }
            ]">
            <template #right-icon>
              <img :src="showPwd ? eyeOpen : eyeClose" class="pwd-eye" @click="showPwd = !showPwd" />
            </template>
          </van-field>
        </div>

        <div class="form-block mt-6">
          <div class="form-label">{{ $t('login.l22') }}</div>
          <van-field :type="showFundPwd ? 'text' : 'password'" v-model="state.fundPwd" name="fundPwd"
            :placeholder="$t('login.l22')" :border="false" input-align="left" class="rounded-input mt-2" :rules="[
              { required: true, message: $t('login.l33') },
              { pattern: /.{6,}/, message: $t('login.l33') },
              {
                validator: (val) => val === state.password,
                message: $t('setting.s50')
              }
            ]">
            <template #right-icon>
              <img :src="showFundPwd ? eyeOpen : eyeClose" class="pwd-eye" @click="showFundPwd = !showFundPwd" />
            </template>
          </van-field>
        </div>

        <div class="form-block mt-6" v-if="loginStore.registerInviteCode">
          <div class="form-label">{{ $t('login.l23') }}</div>
          <van-field v-model="state.inviteCode" name="inviteCode" :placeholder="$t('login.l24')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[
              { required: true, message: $t('login.l34') },
              { pattern: /.{6,}/, message: $t('login.l34') },

            ]" />
        </div>

        <div class="mt-3 flex items-center">
          <van-checkbox v-model="rememberPwd" icon-size="20" class="ml-1 colorfff shrink-0" />
          <div class="ml-2 colorfff text-sm">
            {{ $t('login.l25') }}<span class="text-[#FFDA1C] pl-0.5 cursor-pointer"
              @click="changePage('/mine/xieyi')">{{
                $t('login.l26') }}</span> {{ $t('login.l27') }}
          </div>
        </div>

        <div class="mt-6">
          <button native-type="submit" class="contentBtn">
            {{ $t('login.l28') }}
          </button>
        </div>

        <div class="mt-4 colorfff text-sm text-center pb-1">
          {{ $t('login.l29') }}
          <span class="text-[#000] cursor-pointer" @click="changePage('/auth/login')">{{ $t('x.a7') }}</span>
        </div>
      </van-form>
    </ClientOnly>

  </div>
</template>


<style lang="less" scoped>
.loginPage {
  background-image: url('~/assets/images/img/loginBg.png');
  background-repeat: no-repeat;
  background-position: top;
  min-height: 100vh;
  background-size: 100%;
  background-color: #FFDB1D;

}

.contentBtn {
  border: 3px solid #fff;
  height: 60px;
  line-height: 55px;
  transition: .3s linear all;
}

.disAbleBtn {
  background: #e5e3e3;
  color: #000;
}

.form-block {
  width: 100%;
}

.form-label {
  color: #fff;
  font-size: 16px;
}

.loginPage {
  .rounded-input {
    background: #fff;
    border-radius: 16px;
  }

  .rounded-input :deep(.van-field__value) {
    padding: 8px 0;
  }

  .rounded-input :deep(.van-field__control) {
    font-size: 14px;
  }

  .rounded-input :deep(.van-field__right-icon) {
    margin-right: 0;
  }

  .pwd-eye {
    width: 24px;
    height: 24px;
  }
}
</style>
