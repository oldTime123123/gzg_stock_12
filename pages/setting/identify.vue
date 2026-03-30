<script setup lang="ts">
import successIco from '~/assets/images/img/identify_success.png';
import pendingIco from '~/assets/images/img/identify_pending.png';
import faildIco from '~/assets/images/img/identify_fail.png';
import { uploadFile } from '~/utils'
import * as v from 'valibot';
import { getUserRealInfo, realNameService } from '~/api/setting';
import { showToast } from 'vant';
import { reactive, ref, onMounted } from 'vue';

const { t } = useI18n()
const publicStore = usePublicStore()

const schema = v.object({
  name: v.pipe(v.string(), v.nonEmpty(t('setting.s28'))),
  title: v.pipe(v.string(), v.nonEmpty(t('setting.s29')))
})

const state = reactive({
  name: "",
  title: "",
})

const fileFront = ref<any[]>([])
const fileBack = ref<any[]>([])



const uploadHost = ref("")
//  0 未提交 1审核中 2通过 3拒绝
const userRealStatus = ref(0)

const valibotValidator = (fieldKey: keyof typeof schema.entries) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

const handleSubmit = async () => {
  const hasFront = (fileFront.value.length >0 && (fileFront.value[0].url || fileFront.value[0].file))
  const hasBack = (fileBack.value.length >0 && (fileBack.value[0].url || fileBack.value[0].file));

  if (!hasFront ) {
    showToast(t('x.a2'))
    return
  }

  if (!hasBack ) {
    showToast(t('x.a3'))
    return
  }

  publicStore.showLoading = true

  const data: any = {
    name: state.name,
    title: state.title,
    type: 1,
    id_front: "",
    id_back:"",
  }

  try {
    // if ( userRealStatus.value == 0) {
    //  data.id_front = realUserInfo.value.id_front
    //   data.id_back = realUserInfo.value.id_back
    // } else {
      if ( fileFront.value[0].file  ) {
        const res1 = await uploadFile(uploadHost.value + '/api/uploads', {
          cert: fileFront.value[0].file
        });
        if (res1.code == 200) {
          data.id_front = res1.data
        } else {
          throw new Error(res1.message || t('xx.a3'))
        }
      } else {
     data.id_front = realUserInfo.value.id_front
      }
      if (fileBack.value[0].file) {
        const res2 = await uploadFile(uploadHost.value + '/api/uploads', {
          cert: fileBack.value[0].file
        });
        if (res2.code == 200) {
          data.id_back = res2.data
        } else {
          throw new Error(res2.message || t('xx.a4'))
        }
      } else {
     data.id_back = realUserInfo.value.id_back

      }
    // }


    await realNameService(data)

    showToast(t('setting.s30'))
    getData()
  } catch (error: any) {
    showToast(error.message || t('xx.a5'))
  } finally {
    publicStore.showLoading = false
  }
}
const realUserInfo = ref({
  id_front: "",
  id_back:""
})
const getData = () => {
  getUserRealInfo().then(res => {
    if (res[0]) {
      userRealStatus.value = res[0].status || 0
      state.name = res[0].name || ''
      state.title = res[0].title || ''
      // 保存回显地址，用于校验“是否已存在图片”
      // userFront.value = res[0].full_id_front || ''
      // userBack.value = res[0].full_id_back || ''
      if (userRealStatus.value > 0) {
        fileFront.value = [{
          url: res[0].full_id_front || '',
          file: null
        }]
        fileBack.value = [{
          url: res[0].full_id_back || '',
          file: null
        }]
      }

      uploadHost.value = res[0].upload_host || ''
      realUserInfo.value = res[0]
    }
  })
}

onMounted(() => {
  getData()
})
const userRealText = ref<any>({
  0: { text: t('setting.s31'), icon: pendingIco },
  1: { text: t('setting.s32'), icon: pendingIco },
  2: { text: t('setting.s33'), icon: successIco },
  3: { text: t('setting.s34'), icon: faildIco },
})
</script>

<template>
  <div class="identifyPage">
    <second-page-nav-bar :title="$t('setting.s35')" :hasNoBg="true"></second-page-nav-bar>

    <div class="px-3 mt-2">
      <div class="flex items-center justify-between">
        <div class="colorfff text-2xl font-bold w-1/2 text-center">
          {{ userRealText[userRealStatus]?.text }}
        </div>
        <img :src="userRealText[userRealStatus]?.icon" class="w-1/2">
      </div>

      <div class="mt-4">
        <div class="p-3 bg-white rounded-xl">
          <van-form :disabled="userRealStatus > 0 && userRealStatus < 3" class="mt-7" @submit="handleSubmit">

            <div class="form-block mt-2">
              <div class="form-label color000 font-bold">{{ $t('setting.s36') }}</div>
              <van-field v-model="state.name" name="name" :placeholder="$t('setting.s37')" :border="false"
                input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('name') }]" />
            </div>

            <div class="form-block mt-4">
              <div class="form-label color000 font-bold">{{ $t('setting.s38') }}</div>
              <van-field v-model="state.title" name="title" :placeholder="$t('setting.s39')" :border="false"
                input-align="left" class="rounded-input mt-2" :rules="[{ validator: valibotValidator('title') }]" />
            </div>

            <div class="form-block mt-4">
              <div class="form-label color000 font-bold">{{ $t('setting.s40') }}</div>
              <div class="mt-4 justify-between w-full flex">

                <van-uploader v-model="fileFront" :deletable="userRealStatus == 0 || userRealStatus == 3" :max-count="1" :disabled="[1, 2].includes(userRealStatus)">
                  <template #default>
                    <div class="relative w-[150px] h-[150px] overflow-hidden bg-gray-100 rounded-lg">
                      <div v-if="[0, 3].includes(userRealStatus) "
                        class="absolute flex flex-col items-center justify-center w-full h-full">
                        <Icon class="mainTextColor w-10 h-10" name="material-symbols:cloud-upload" />
                        <div class="text-blue-600 text-shadow-2xs text-shadow-blue-300">
                          {{ $t('setting.s41') }}
                        </div>
                      </div>
                    </div>
                  </template>
                </van-uploader>

                <van-uploader v-model="fileBack" :deletable="userRealStatus == 0 || userRealStatus == 3" :max-count="1" :disabled="[1, 2].includes(userRealStatus)">
                  <template #default>
                    <div class="relative w-[150px] h-[150px] overflow-hidden bg-gray-100 rounded-lg">
                      <div v-if="[0, 3].includes(userRealStatus)"
                        class="absolute flex flex-col items-center justify-center w-full h-full">
                        <Icon class="mainTextColor w-10 h-10" name="material-symbols:cloud-upload" />
                        <div class="text-blue-600 text-shadow-2xs text-shadow-blue-300">
                          {{ $t('setting.s42') }}
                        </div>
                      </div>
                    </div>
                  </template>
                </van-uploader>
              </div>
            </div>

            <div v-if="userRealStatus !== 1 && userRealStatus !== 2"
              class="p-0 m-0 bg-[transparent] noHoverBg rounded-full mt-10">
              <button type="submit" class="contentBtn">{{ $t('setting.s43') }}</button>
            </div>

          </van-form>
        </div>
      </div>

      <div class="mt-5 text-[#FFDA1C] text-xs ">
        <div class="mb-2">{{ $t('setting.s44') }} </div>
        <div class="mb-2">{{ $t('setting.s45') }}</div>
        <div class=""> {{ $t('setting.s46') }}</div>
      </div>
      <div class="h-[20px]"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.identifyPage {
  background-color: var(--mainColor);
  height: 100vh;
  overflow: scroll;
}

.noHoverBg:hover {
  background: transparent;
}

:deep(.van-uploader__wrapper),
:deep(.van-uploader__preview-image) {
  display: block !important;
  width: 150px !important;
  height: 150px !important;
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
