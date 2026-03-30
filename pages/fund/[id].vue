<script setup lang="ts">
import { onMounted } from 'vue'
import { getLixibaoDetail, investLixibaoHandle } from '../../api/trade'
import { getCurrency, UseExchangeNumber } from '../../utils'
import { showToast } from 'vant';

const {t} = useI18n()


const isFixed = ref(false)
const changeFixedHandle = (e) => {
  isFixed.value = e
}
const route = useRoute()
const id = route.params.id

const pageData = ref({
  rate: 0,
  day: 0,
  process:0,
  balance:0,
  min_num: 0,
  max_num: 0,
  vip: {
  name:"123"
}
})
const getData = () => {
  getLixibaoDetail({
    id
  }).then(res => {
    pageData.value = res
  })
}
const changePage = () => {
  history.back()
}

const inpVal = ref("")
const pub = usePublicStore()
const investHandle = () => {
  if (Number(pageData.value.min_num) > Number(inpVal.value) || Number(pageData.value.max_num) < Number(inpVal.value)) {
    showToast(t('pay.p13')+': ' + pageData.value.min_num +' ~ ' + pageData.value.max_num)
    return
  }
  pub.showLoading = true

  investLixibaoHandle({
    id,
    amount:inpVal.value
  }).then(res => {
    showToast(t('fund.f10'))
    getData()
  })
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="investPage">
    <van-sticky offset-top="0" @change="changeFixedHandle">
      <div class="px-3 py-3 flex justify-between items-center colorfff " :class="isFixed ? 'bg-[#2D57FF]' : ''">
        <div class="w-[40px] flex items-center colorfff">
          <Icon name="line-md:chevron-left" size="28" class="cursor-pointer" @click="changePage('back')" />
        </div>
      </div>
    </van-sticky>
    <div class="pl-6 mt-3 text-white text-xl topRight">
      {{ $t('index.i12') }}
    </div>
    <div class="px-3 mt-3">
      <div class="firstBox1 ">
        <div class="absolute  bgEl" />
        <div class="bg-white  top-6 rounded-3xl infoBox absolute w-full p-3 pb-6 ">
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold flex1 ">
              {{ pageData.title}}

            </div>
            <div class="text-center  w-1/3">
              <div>
                <div class="mainTextColor font-bold  truncate ">
                  {{ pageData.vip?.name }}
                </div>
              </div>
              <div class="flex flex-row-reverse">
                <div class=" px-2 py-1 text-xs  rounded-lg  text-sm bg-[#FFDA1C]  ">
                  {{ t('fund.f11') }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-3 text-sm text-center  rounded-lg colorfff bg-[var(--mainColor)] p-3 grid grid-cols-2 place-items-center">
            <div class="relative w-full">
              <div>
                <span class="text-lg font-bold">{{ pageData.rate * 100 }}</span>
                %
              </div>
              <div>{{t('fund.f6')}}</div>
            </div>
            <div class="w-full">
              <div>
                <span class="text-lg font-bold">{{ pageData.day }}</span>
                {{t('fund.f18')}}
              </div>
              <div>{{t('fund.f7')}}</div>
            </div>
          </div>
        </div>

      </div>
      <div class="px-6 flex items-center justify-between  brageBoxEl  relative  ">
        <div class="leftEl ">
        </div>
        <div class="rightEl ">
        </div>
      </div>
      <div class="bg-white   secondBox rounded-3xl pt-6 overflow-hidden">
        <div class="px-3">
          <div class="grid grid-cols-3  items-center">
            <div class="text-left">
              <div class="text-sm">
                {{t('fund.f12')}}
              </div>
              <div class="mainTextColor">
                {{ pageData.min_num + getCurrency()}}
              </div>
            </div>
            <div class="flex items-center justify-center">
              <img src="~/assets/images/icon/fund_transfer.png" width="40" height="40">
            </div>
            <div class="text-right">
              <div class="text-sm">
                {{ t('fund.f13')}}
              </div>
              <div class="mainTextColor">
                {{ pageData.max_num + getCurrency() }}

              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 bg-[#ECF4FE]  flex items-center ">
          <div class="bg-[var(--mainColor)] colorfff text-sm  hasBlueBg px-4 py-1">{{t('fund.f32')}}</div>
          <div class="ml-2 flex-1 pr-6">
            <van-progress color="var(--mainColor)" :percentage="pageData.progress" />
          </div>
        </div>
      </div>

      <div class="tradebox bg-white rounded-lg  overflow-hidden mt-3">
        <div class="bg-[var(--mainColor)] h-[80px]   overflow-hidden  flex items-center justify-between">
          <div
            class="w-2/5 py-1 h-full flex-col  flex items-center justify-center font-bold rounded-r-full text-center bg-[#FFDA1C] ">
            <div>
              {{ t('fund.f1')}}
            </div>
            <div class="mainTextColor font-bold">
              {{UseExchangeNumber(pageData.balance) + getCurrency()}}
            </div>
          </div>
          <div class="pt-10">
            <div class="rightImg">

            </div>
          </div>
        </div>
        <div class="px-3  py-3">
          <div class="text-sm font-bold">
            {{ t('fund.f14')}}
          </div>
          <div class="mt-3 rounded-lg bg-[#ECF4FE] py-2 px-3 flex items-center justify-between">
            <div class="flex-1">
              <input type="text" v-model="inpVal" :placeholder="t('fund.f15')" class="bg-transparent w-full ">
            </div>
            <div class="font-bold text-sm">
              {{getCurrency()}}
            </div>
          </div>
          <div class="text-sm">
            <div class="flex items-center justify-between mt-2">
              <div>
                {{ t('fund.f16') }}
              </div>
              <div class="text-[#333]">
                {{UseExchangeNumber(inpVal * pageData.rate) + getCurrency()}}
              </div>
            </div>
            <div class="flex items-center justify-between mt-2">
              <div>
                {{ t('fund.f17')}}
              </div>
              <div class="text-[#333]">
                {{ UseExchangeNumber(inpVal * pageData.rate * pageData.day) + getCurrency() }}

              </div>
            </div>
            <div class="mt-3 contentBtn" @click="investHandle">
              {{ t('fund.f8')}}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 text-white">
        {{ t('fund.f9')}}
      </div>
      <div class="mt-3 p-3 bg-white rounded-xl">
        <div v-html="pageData.content"></div>
      </div>
      <div class="h-[50px]"></div>
    </div>
    <!-- <div class="h-[2000px]"></div> -->
  </div>
</template>


<style lang="less" scoped>
.rightImg {
  background: url('~/assets/images/icon/fund_investDetailTop.png') no-repeat;
  background-position: top;
  width: 140px;
  height: 140px;
  background-size: 100%;
}

.secondBox {
  margin-top: -70px;

  .hasBlueBg {
    border-radius: 0 30px 0 0;
  }
}

.brageBoxEl {
  height: 100px;

  .leftEl {
    position: absolute;
    z-index: 100;
    display: block;
    content: '';
    height: 54px;
    width: 14px;
    transform: translateY(-50%);
    background: url('~/assets/images/icon/fund_brage.png') no-repeat;
    background-size: contain;
  }

  .rightEl {
    position: absolute;
    z-index: 100;
    display: block;
    content: '';
    height: 54px;
    width: 14px;
    right: 40px;
    transform: translateY(-50%);
    background: url('~/assets/images/icon/fund_brage.png') no-repeat;
    background-size: contain;
  }
}

.firstBox1 {
  height: 180px;
  position: relative;

  .bgEl {
    background: url('~/assets/images/icon/fund_box1bg.png') no-repeat;
    width: 80%;
    background-position: top center;
    height: 100px;
    background-size: cover;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;

  }

  .infoBox {
    z-index: 100;
    box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  }

  .relative::after {
    position: absolute;
    display: block;
    content: '';
    right: 0;
    height: 40%;
    width: 2px;
    top: 50%;
    transform: translateY(-50%);
    background: currentColor;
  }
}

.investPage {
  background: url('~/assets/images/img/fund_investDetail.png') no-repeat;
  min-height: 100vh;
  background-size: cover;
  background-position: top;
  background-attachment: fixed;
}
</style>
