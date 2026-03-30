<script lang="ts" setup>
// import { useRouter } from 'nuxt/app';
import rightUrl from '~/assets/images/icon/fundRecIcon.png';
import { getLixibaoInfo } from '../../api/trade';
import { UseExchangeNumber } from '../../utils';
const pub = usePublicStore()
const router = useRouter()
const rightClickHandle = () => {
  router.push('/record/fundRecord')
}
const goDetail = (item) => {
  if (item.can_buy !== 1) return
  router.push('/fund/' + item.id)
}

const richTxt = ref("")
const pageInfo = ref({
  balance: 0,
  lixibao_balance: 0,
  lixibao_shouru: 0,
  lixibao_shouru_yuji: 0,
})
const lixibaoList = ref([])
const getData = () => {
  getLixibaoInfo().then(res => {
    pageInfo.value.balance = res.balance
    pageInfo.value.lixibao_balance = res.lixibao_balance
    pageInfo.value.lixibao_shouru = res.lixibao_shouru
    pageInfo.value.lixibao_shouru_yuji = res.lixibao_shouru_yuji
    pub.cancelLixibaoFlag = res.can_interrupt > 0
    lixibaoList.value = res.lixibaos
    richTxt.value = res.lixibao_desc
  })
}

onBeforeMount(() => {
  getData()
});
</script>
<template>
  <div>
    <div class="hasNormalBg">
      <second-page-nav-bar class="z-10 " :title="''" :right-icon="rightUrl"
        :right-click-handle="rightClickHandle"></second-page-nav-bar>

      <div class=" ">
        <div class="pl-6 text-white text-xl topRight">
          {{ $t('index.i12') }}
        </div>
        <div class="fundPageIcon pointer-events-none absolute right-0 top-0 z-8">
        </div>
      </div>
      <div class="fund_pageContainer pt-3  mt-4 z-10 relative rounded-t-xl">
        <!-- topInfo -->
        <div class="px-3">
          <div class="topBalanceInfoEl">
            <div class="grid  grid-cols-2  place-items-center">
              <div class="text-[#FFDA1C]">{{ $t('fund.f1') }}</div>
              <div>{{ UseExchangeNumber(pageInfo.balance) + getCurrency() }} </div>
            </div>
            <div class="pt-14 px-8">
              <div class="flex items-center justify-between mb-2 ">
                <div class="text-xs text-[#262626]">
                  {{ $t('fund.f2') }}
                </div>
                <div class="text-sm mainTextColor">
                  {{ UseExchangeNumber(pageInfo.lixibao_balance) + getCurrency() }}
                </div>
              </div>
              <div class="flex items-center justify-between mb-2 ">
                <div class="text-xs text-[#262626]">
                  {{ $t('fund.f3') }}
                </div>
                <div class="text-sm mainTextColor">
                  {{ UseExchangeNumber(pageInfo.lixibao_shouru) + getCurrency() }}
                </div>
              </div>
              <div class="flex items-center justify-between mb-2 ">
                <div class="text-xs text-[#262626]">
                  {{ $t('fund.f4') }}
                </div>
                <div class="text-sm mainTextColor">
                  {{ UseExchangeNumber(pageInfo.lixibao_shouru_yuji) + getCurrency() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-t-2xl mt-3 pt-3 bg-white mt-4pt-3">
          <div class="investList  px-3 ">
            <div class="topInfo pt-8">
              <div class="w-[100px] py-1 font-bold rounded-r-full text-center bg-[#FFDA1C] ">
                {{ $t('fund.f5') }}
              </div>
              <div class="mt-1 w-[90px] h-[4px]  rounded-r-full text-center bg-[#FFDA1C]"></div>
            </div>
            <div class=" rounded-b-lg overflow-hidden isolate">
              <div class="botListElLightBgEl isolate rounded-b-lg  ">
                <div class="botListEl px-3 mb-2">
                  <div class="" v-if="lixibaoList.length == 0">
                    <div class="nullData "></div>
                    <div class="text-lg mt-2 color text-white text-center">
                      {{ $t('trade.t8') }}
                    </div>
                  </div>
                  <div v-else class="h-[200px] investItemEl px-5  mb-2 " v-for="(item, index) in lixibaoList"
                    :key="index">
                    <div class="pt-4 text-xs text-right text-white  h-[40px]">
                      {{ item.title }}
                    </div>
                    <div class="mt-4">
                      <div class="flex items-center justify-between mb-2">
                        <div class="text-sm">
                          {{ $t('fund.f6') }}
                        </div>
                        <div class="mainTextColor">{{ item.rate * 100 }}%</div>
                      </div>
                      <div class="flex items-center justify-between mb-2">
                        <div class="text-sm">
                          {{ $t('fund.f7') }}
                        </div>
                        <div class="font-bold">{{ item.day + $t('fund.f18') }}</div>
                      </div>
                      <div class="mt-2 contentBtn" :class="item.can_buy !== 1 ? 'disAbledBtn' : ''"
                        @click="goDetail(item)">
                        {{ $t('fund.f8') }}
                      </div>
                    </div>
                  </div>
                  <div class="h-[20px]"></div>
                </div>
              </div>
            </div>

          </div>
          <div class="h-[30px] bg-white"></div>
          <div class="px-3  bg-[#2D57FF] pt-1 pb-4 rounded-t-lg">
            <div class="flex items-center justify-between ">
              <div class="flex items-center colorfff">
                <Icon class=" w-7 h-7" name="bxs:news"></Icon>
                <div class="text-lg ml-2">{{ $t('fund.f9') }}</div>
              </div>
              <div class="mt-[-30px]">
                <img src="~/assets/images/img/fund_investRule.png" width="120" height="120">
              </div>
            </div>
            <div class="mt-3 p-3 bg-white rounded-lg">
              <div v-html="richTxt"></div>
            </div>
          </div>
        </div>



      </div>
    </div>
  </div>

</template>

<style lang="less" scoped>
.fundPageIcon {
  background: url('~/assets/images/icon/fundIcon.png') no-repeat;
  background-size: contain;
  width: 300px;
  height: 300px;
}

.fund_pageContainer {
  background: rgba(143, 195, 255, 0.5);
  border-top: 2px solid #fff;

  .topBalanceInfoEl {
    margin: 0 auto;
    background: url('~/assets/images/img/fund_topGroup.png') no-repeat;
    background-size: 100%;
    height: 260px;
    padding-top: 60px;

    background-position: center;
  }
@media(max-width:360px){
  .topBalanceInfoEl {
        width: 340px;
          max-width: 340px;
  }
}
  .investList {
    .topInfo {
      background: url('~/assets/images/img/fund_investTopBg.png') no-repeat;
      background-size: 100%;
      background-position: top;
      height: 100px;
    }

    .botListElLightBgEl {
      background: linear-gradient(to bottom, #5088F2, #F2F5AF, #5088F2);

      .botListEl {
        background: url('~/assets/images/img/fund_light.png') no-repeat;

        background-size: 100%;
        background-position: top;

      }

      .investItemEl {
        background: url('~/assets/images/img/fund_investItemBg.png') no-repeat;
        background-size: contain;
      }
    }

  }

}
</style>
