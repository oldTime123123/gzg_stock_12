<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant';
import { getUserBankcardList, delUserBankcard } from '~/api/home/home'
const { t, locale } = useI18n()

const router = useRouter()
const changePage = (url: any) => {
  router.push(url)
}
const showSkeleton = ref(true)

const pub = usePublicStore();
const items = ref(new Array());
const fetchItemData = () => {
  pub.showLoading = true;
  getUserBankcardList().then((list: any) => {
    items.value = list;
  }).finally(() => {
    pub.showLoading = false;
    showSkeleton.value = false;
  });
}

const showPop = ref(false)

const delId = ref(0)
const openPop = (id) => {
  delId.value = id
  showPop.value = true
}
const handleDelItem = () => {

  pub.showLoading = true;
  delUserBankcard(delId.value).then(() => {
    fetchItemData();
  }).finally(() => {
    pub.showLoading = false;
  });
}
onMounted(() => {
  fetchItemData();
});
</script>
<template>
  <div class="">
    <second-page-nav-bar :title="$t('setting.s5')"></second-page-nav-bar>

    <div class="px-3 mt-4">
      <div v-if="showSkeleton">
        <div class="h-[200px] bg-[#dce8f9] rounded-lg mb-2" v-for="(item, index) in 2" :key="index">
        </div>
      </div>
      <div v-else-if="items.length == 0 && !showSkeleton">
        <div class="nullData"></div>
        <div class="text-lg mt-2 color text-blue-300 text-center">
          {{ $t('comm.c65') }}
        </div>
      </div>
      <div v-else class="bankItem rounded-2xl p-3 mb-3 relative colorfff flex justify-between cursor-pointer"
        v-for="(item, index) in items" :key="index">
        <div class="flex-1" @click="changePage(`./editBank?bankId=${item.id}`)">
          <div class="flex items-center shrink-0">
            <div class="walletIco w-[50px] h-[50px] justify-center flex items-center leading-[50px] rounded-full ">
              <Icon class="w-7 h-7 " name="f7:wallet-fill" />
            </div>
            <div class="ml-2">
              <div class="text-sm font-bold">{{ item.bank_name }}</div>
              <div class="text-xs">{{ item.other_param_2 }} </div>
            </div>

          </div>
          <div class="mt-[50px] text-lg  font-bold">
            **** **** **** {{ item.bank_num }} </div>
        </div>
        <div @click="changePage(`./editBank?bankId=${item.id}`)">
          <img src="~/assets/images/icon/bankIco.png" class="w-[130px] h-[130px]">
        </div>
        <div class="absolute right-2 bottom-2">
          <Icon class="w-6 h-6" name="bi:trash3-fill" @click="openPop(item.id)" />
        </div>
      </div>

      <div class="mt-5 contentBtn" @click="changePage('./editBank')">
        {{ $t('setting.s6') }}
      </div>
    </div>
    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="flex justify-center items-center h-full">
        <div class="bg-white  w-[350px] rounded-2xl   overflow-hidden">
          <div class="px-3 pt-3 bg-[var(--mainColor)] ">
            <div class="text-center font-bold borderB pb-1 colorfff ">
              {{ $t('mine.m9') }}
            </div>
          </div>
          <div class="px-3 pb-3">

            <div class="mt-6 borderB pb-1">
              <div class="flex items-center justify-center">
                <span class="font-bold">{{ t('setting.s4') }}</span>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</div>
              <div class="contentBtn" @click="handleDelItem">
                {{ t('setting.s2') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>


<style lang="less" scoped>
.bankItemStyle(@gradientStart, @gradientEnd, @iconBg) {
  background: linear-gradient(132deg, @gradientStart 0%, @gradientEnd 100%);

  .walletIco {
    background: @iconBg;
  }
}

.bankItem {
  &:nth-child(3n+1) {
    .bankItemStyle(#6298FB, #4378E3, #4378E3);
  }

  &:nth-child(3n+2) {
    .bankItemStyle(#F8A355, #FF7844, #FF7844);
  }

  &:nth-child(3n) {
    .bankItemStyle(#16BA7C, #3EC49B, #3EC49B);
  }
}
</style>
