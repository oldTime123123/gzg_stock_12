<script lang="ts" setup>
import { getUserAccountBalance } from '~/api/home/home';
import { getSettingFinanceWay } from '~/api/pay/realse'
import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import mIco1 from '~/assets/images/icon/m_ico1.png';
import mIco2 from '~/assets/images/icon/m_ico2.png';
import mIco3 from '~/assets/images/icon/m_ico3.png';
import mIco4 from '~/assets/images/icon/m_ico4.png';
import mIco5 from '~/assets/images/icon/m_ico5.png';
import mIco6 from '~/assets/images/icon/m_ico6.png';
import { showToast } from 'vant';

const { t, locale } = useI18n();
const copyHandle = async (val) => {

  // 2. 检查浏览器支持情况
  if (!navigator.clipboard) {
    console.error('Clipboard API not supported')
    return
  }
  try {
    // 3. 执行复制
    await navigator.clipboard.writeText(val)
    showToast(t('fund.a1'))
  } catch (err) {
    console.error('复制失败:', err)
  }


}
const userStore = useUserStore();
const showID = ref(false);
const showPop = ref(false)
const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val
};

const myItemList = computed(() => {
  return [
    {
      name: t('mine.m3'),
      icon: mIco1,
      url: '/setting/bankList'
    },
    {
      name: t('mine.m4'),
      icon: mIco2,
      url: '/setting/identify'

    },
    {
      name: t('mine.m5'),
      icon: mIco3,
      url: '/setting/password?type=1'

    },
    {
      name: t('mine.m6'),
      icon: mIco4,
      url: '/service'

    },
    {
      name: t('mine.m7'),
      icon: mIco5,
      url: '/record/userBalanceRecord'

    },
    {
      name: t('mine.m8'),
      icon: mIco6,
      url: '/setting/password?type=0'

    },
  ]
})

const router = useRouter()
const changePage = (url: any) => {
  router.push(url)
}

const handleLogout = () => {
  showPop.value = true
}
const confirmClosePositionHandle = () => {
  userStore.logout();
  changePage('/auth/beforeLogin')
}
const rechargeTypeStatus = ref({
  recharge_type: [],
  recharge_unavailable_txt: ""
})
const account = ref<Record<string, any>>({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  profit: 0,

});
const fetchPageData = () => {
  getUserAccountBalance().then((data: any) => {
    account.value = data;
  });
  getSettingFinanceWay().then(res => {
    rechargeTypeStatus.value = res
  })
}
const goDeposit = (url: any) => {

  if (rechargeTypeStatus.value.recharge_type.length == 0) {
    showToast(rechargeTypeStatus.value.recharge_unavailable_txt)
    return
  }

  if (rechargeTypeStatus.value.recharge_type.length < 2 && rechargeTypeStatus.value.recharge_type[0] == '18') {
    router.push('/pay/rechargeService')
  } else {
    router.push(url)
  }

}

onMounted(() => {
  fetchPageData();
  userStore.flush()
})
</script>
<template>
  <section>
    <ClientOnly>
      <div class="hasNormalBg minePage">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="px-3 py-3 tabbarPageTopNav  flex justify-between items-center "
            :class="isSticky ? 'topStickyEl' : '  '">
            <div class="w-1/6"></div>
            <div class="flex-1 text-center colorfff ">
              {{ $t('mine.m13') }}
            </div>
            <div class="w-1/6 flex  flex-row-reverse">
              <img src="~/assets/images/icon/langIcon.png" class="w-8 h-8 ml-2 cursor-pointer"
                @click="changePage('/mine/language')" />
              <img src="~/assets/images/icon/service.png" class="w-8 h-8 cursor-pointer"
                @click="changePage('/service')" />
            </div>
          </div>
        </van-sticky>
        <div class="pageContainer ml-3">
          <div class="mineInfoBox p-4">
            <div class="flex items-center">
              <div class="mainTextColor text-sm flex items-center">ID：{{ userStore.data.id
              }} </div>
              <!-- <Icon class="w-4 h-4 mainTextColor ml-2" @click="copyHandle(userStore.data.id)"
                name="icon-park-twotone:copy"></Icon> -->
              <div class="mainTextColor text-sm flex items-center ml-2">{{ $t('login.l6') }}：{{ userStore.data.phone
              }} </div>
            </div>

            <div class="flex items-center ">
              <img :src="userStore.data.vip?.pic" class="w-4 h-4">
              <div class="text-xs flex items-center ml-1">{{ userStore.data.vip?.name }} </div>
            </div>
            <div class="flex  mt-4">
              <div class=" w-1/2 text-xs color000">
                <div class="flex items-center justify-between">
                  <div>{{ $t('mine.m14') }}</div>
                  <div> {{ getCurrency() + (showID ? Number(account.totalAsset).toLocaleString('en-US') : '****') }}
                  </div>
                </div>
                <div class="flex items-center mt-1.5 justify-between">
                  <div>{{ $t('mine.m15') }}</div>
                  <div> {{ getCurrency() + (showID ? Number(account.balance).toLocaleString('en-US') : '****') }}</div>
                </div>
                <div class="flex items-center mt-1.5 justify-between">
                  <div>{{ $t('mine.m16') }}</div>
                  <div> {{ getCurrency() + (showID ? Number(account.frozenAmount).toLocaleString('en-US') : '****') }}
                  </div>
                </div>
                <div class="flex items-center  mt-1.5 justify-between">
                  <div>{{ $t('mine.m17') }}</div>
                  <div> {{ getCurrency() + (showID ? Number(account.profit).toLocaleString('en-US') : '****') }}</div>
                </div>
              </div>
              <div class="pr-[30px]">
                <img :src="showID ? eyeClose : eyeOpen" class="w-4 h-4 ml-1" @click="showID = !showID">

              </div>
            </div>
          </div>

        </div>
        <div class="minePageContentBoxEl  rounded-[30px] bg-white px-3">
          <div class="py-4  ">
            <div class="grid grid-cols-2 cursor-pointer gap-2 text-[#FFDA1C]">
              <div class="relaseBtn shrink-0  h-[55px] leading-[50px] czBox" @click="goDeposit('/pay/deposit')">
                <div class="w-3/5 text-center">
                  {{ $t('mine.m18') }}
                </div>
              </div>



              <div class="relaseBtn shrink-0  cursor-pointer h-[55px] leading-[50px] czBox"
                @click="changePage('/pay/withdraw')">
                <div class="w-3/5 text-center">
                  {{ $t('mine.m19') }}
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="lineaerContentLine w-[103px] h-[5px] rounded-full"></div>
            </div>

            <div class="mt-4">
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="flex flex-col justify-center items-center cursor-pointer myItemEl py-2  bg-[#ECF4FE] rounded-xl"
                  v-for="(item, index) in myItemList" :key="index" @click="changePage(item.url)">
                  <img :src="item.icon" class="w-[32px] h-[32px]">
                  <div class="text-xs mt-2 text-center px-1">{{ item.name }}</div>
                </div>
              </div>
            </div>

            <div class="mt-[50px]">
              <div class=" contentBtn" @click="handleLogout">
                {{ $t('mine.m20') }}
              </div>
            </div>

          </div>
        </div>
      </div>
      <van-overlay :show="showPop" @click="showPop = false" z-index="999">
        <div class="flex justify-center items-center h-full">
          <div class="bg-white p-3 w-[350px] rounded-2xl bgf">
            <div class="bg"></div>
            <div class="text-center font-bold borderB pb-1 text-gray-700 title">
              {{ $t('mine.m9') }}
            </div>
            <div class="mt-6 borderB pb-1">
              <div class="flex items-center justify-center">
                <span class="font-bold">{{ $t('mine.m12') }}</span>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</div>
              <div class="contentBtn" @click="confirmClosePositionHandle">
                {{ $t('comm.c57') }}
              </div>
            </div>
          </div>
        </div>
      </van-overlay>
      <Tabbar />
    </ClientOnly>
  </section>
</template>





<style lang="less" scoped>
.hasNormalBg {
  min-height: 100%;
}

.minePageContentBoxEl {
  margin-top: -10px;
  min-height: calc(100vh - 300px);

  .czBox {
    background: url('~/assets/images/icon/m_cz.png') no-repeat;
    background-size: 100%;
  }

  .lineaerContentLine {
    background: linear-gradient(90deg, #2D57FF 0%, rgba(27, 52, 153, 0) 100%);
  }

}

.mineInfoBox {
  background: url('~/assets/images/img/mineInfoBg.png') no-repeat;
  background-size: cover;
  background-position: top;
  height: 170px;
  padding-top: 5px;

}

.title {
  z-index: 2;
  position: relative;
  color: #fff;
}

.bgf {
  position: relative;
  overflow: hidden;
}

.bg {
  background: #2D57FF;
  height: 50px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
