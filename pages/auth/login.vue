<script lang="ts" setup>
import * as v from 'valibot';
import { computed } from 'vue';
const { t } = useI18n()
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import { decryptData, encryptData } from '../../utils/loginEncrypt';

const publicStore = usePublicStore()
const userStore = useUserStore();
const loginStore = useLoginStore();


const schema = v.object({
  account: v.pipe(v.string(), v.minLength(1, t('login.l7'))),
  password: v.pipe(v.string(), v.minLength(6, t('login.l9')))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  account: '',
  password: ''
})


const showPwd = ref(false);
const rememberPwd = ref(false)

const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val
};

const router = useRouter()
const changePage = (link: any) => {
  if (link !== 'back') {
    router.push(link)
  } else {
    history.back()
  }
}

const handleSubmit = async (values: any) => {


  if (!showBtnStatus.value) return
  publicStore.showLoading = true
  const { account, password } = Object.assign({}, state, values);
  userStore.phoneLogin(account, password).then(() => {
    loginStore.loadingText = t('login.l15')
    if (rememberPwd.value) {
      loginStore.rememberPwd = rememberPwd.value
      const userLoginInfo = {
        account, password
      }
      let data = encryptData(JSON.stringify(userLoginInfo))
      loginStore.accInfo = data
    }
    router.push('/');
  }).catch((e) => {
    console.log('e',e);
  })
}
const showBtnStatus = computed(() => {
  const result = v.safeParse(schema, state)
  return result.success
})



onMounted(() => {
  loginStore.initLoginData()

  if (loginStore.rememberPwd) {
    rememberPwd.value = loginStore.rememberPwd
    if (loginStore.accInfo) {
      let data = JSON.parse(decryptData(loginStore.accInfo))
      state.account = data.account
      state.password = data.password
    }

  }
})

</script>
<template>

  <div class="loginPage">
    <van-sticky offset-top="0" @change="topFixedChange">
      <div class="px-3 pt-3 pb-8 bg-[#FFDB1D]">
        <div class="flex justify-between items-center mainTextColor ">
          <Icon @click="changePage('./beforeLogin')" name="line-md:chevron-left" class="w-7 h-7 cursor-pointer"  />
          <img src="~/assets/images/icon/langIcon.png" class="w-8 h-8 cursor-pointer"
            @click="changePage('/mine/language')" />
        </div>
        <div class="mt-3 px-5">
          <div class="text-4xl font-bold mainTextColor">
            {{ $t('login.l4') }}
          </div>
          <div class="mt-1">
            {{ $t('login.l5') }}
          </div>
        </div>
      </div>
    </van-sticky>
    <ClientOnly>
      <van-form class="px-8 mt-7" @submit="handleSubmit">
        <div class="form-block">
          <div class="form-label">{{ $t('login.l6') }}</div>
          <van-field v-model="state.account" name="account" :placeholder="$t('login.l7')" :border="false"
            input-align="left" class="rounded-input mt-2" :rules="[{ required: true, message: $t('login.l7') }]" />
        </div>

        <div class="form-block mt-6">
          <div class="form-label">{{ $t('login.l8') }}</div>
          <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
            :placeholder="$t('login.l9')" :border="false" input-align="left" class="rounded-input mt-2" :rules="[
              { required: true, message: $t('login.l9') },
              { pattern: /.{6,}/, message: $t('login.l9') }
            ]">
            <template #right-icon>
              <img :src="showPwd ? eyeOpen : eyeClose" class="pwd-eye" @click="showPwd = !showPwd" />
            </template>
          </van-field>
        </div>

        <div class="mt-3 flex items-center">
          <van-checkbox v-model="rememberPwd" icon-size="20" class="ml-1 colorfff" />
          <div class="ml-2 colorfff text-xs">
            {{ $t('login.l11') }}
          </div>
        </div>

        <div class="mt-6">
          <button native-type="submit" class="contentBtn" :class="!showBtnStatus ? 'disAbleBtn' : ''">
            {{ $t('login.l12') }}
          </button>

        </div>
        <div class="mt-6 colorfff text-sm text-center">
          {{ $t('login.l13') }}
          <span class="text-[#FFDA1C] cursor-pointer" @click="changePage('/auth/register')">{{ $t('login.l14') }}</span>
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
}

.pwd-eye {
  width: 24px;
  height: 24px;
}
</style>
