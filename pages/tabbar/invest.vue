<script lang="ts" setup>
  import eyeClose from '~/assets/images/icon/m_eye_close.png';
import eyeOpen from '~/assets/images/icon/m_eye_open.png';
import { computed, ref } from 'vue';
import { getCircleOption } from '~/utils/indexLineStyle';
import { getUserAccountBalance } from '~/api/home/home';
const colors = ['#FFDA1C', '#E24400', '#01fff5', '#02CD8E',]
const series = ref([0, 0, 0, 0]) // 数据: 可用资金, 冻结金额, 持仓市值
const { t, locale } = useI18n();
const balanceList = ref({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  product_balance: 0,
  inStockProfit: 0,


})
const getData = () => {
  getUserAccountBalance().then((res: any) => {
    balanceList.value = res
    series.value = [
      Number(res.balance),
      Number(res.product_balance),
      Number(res.frozenAmount),
    ]
  })
}
const circleChartStyle = getCircleOption(colors)

const balanceBox = computed(() => {
  return [
    {
      amount: balanceList.value.totalAsset || 0,
      color: '#2D9AFF',
      name: t('index.i1'),
    },
    {
      amount: series.value[0] || 0,
      color: colors[0],
      name: t('index.i2'),
    },
    {
      amount: series.value[1] || 0,
      color: colors[1],
      name: t('index.i3')
    },
    {
      amount: series.value[2] || 0,
      color: colors[2],
      name: t('mine.m16')
    },
    {
      amount: balanceList.value.inStockProfit || 0,
      color: colors[3],
      name: t('index.i4')
    },

  ]
})
const pub = usePublicStore()

const actRecordType = computed(() => {
  return pub.actRecordType
})
const recordTypeTabs = ref([
  {
    text: t('index.i5'),
    type: 3,
  },
  {
    text: t('index.i6'),
    type: 1,
  },
  {
    text: t('index.i7'),
    type: 2,
  },
])

const changeRecordType = (type) => {
  if (actRecordType.value == type) return
  pub.actRecordType = type
  pub.showLoading = true
  actRecordType.value = type

}

const router = useRouter()
const changePage = (url: any) => {
  if (url) {
    router.push(url)
  }
}

const showBalance = ref(true)
onBeforeMount(() => {
  getData()
})
onMounted(() => {

})
</script>
<template>
  <section>
    <div class="hasNormalBg">
      <TabbarTopNavBar />

      <ClientOnly>
        <div class="pageContainer px-3 mt-3">
          <div class="investBannerEl   leftBoxEl">
            <div class="whiteBgEl"></div>
            <div class="yellowBgEl"></div>

            <div class="flex items-center  justify-between  p-4 rounded-xl">

              <div class="relative w-[120px] h-[120px] absolute z-30  " style="margin-left: -15px;">
                <apexchart v-if="series" type="donut" width="120px" height="120px" :options="circleChartStyle"
                  :series="series" />

                <div class="totalAmount flex items-center justify-center">
                  <div class="colorfff text-center text-xs">
                    <div>{{ t('index.i1') }}</div>
                    <div>{{  (showBalance ? '*****' : UseExchangeNumber(balanceList.totalAsset)) }}</div>
                  </div>
                </div>
              </div>

              <div class=" absolute  absBox  min-w-1/2  z-20   bg-[var(--mainColor)] p-2 rounded-lg">
                <div class="flex items-center mt-[5px] text-[12px] colorfff justify-between"
                  v-for="(item, index) in balanceBox" :key="index">
                  <div class="flex items-center flex-1  ">
                    <div class=" w-3 h-3" :style="{ background: item.color }"></div>
                    <div class="ml-1 truncate  balanceNameEl flex items-center">
                      {{ item.name }}
                <img v-if="index == 0" :src="showBalance ? eyeClose : eyeOpen" class="w-4 h-4 ml-1" @click="showBalance = !showBalance">

                    </div>
                  </div>
                  <div class="ml-1">{{ getCurrency() +(showBalance ? '*****' : UseExchangeNumber(item.amount)) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="recordBoxEl mt-3 pb-2">
            <div class="grid grid-cols-3 text-center recordTypeBoxEl">
              <div v-for="(tab, index) in recordTypeTabs" :class="actRecordType == tab.type ? 'actRecordEl' : ''"
                :key="index" @click="changeRecordType(tab.type)">
                {{ tab.text }}
              </div>
            </div>

            <div class="mt-3 px-3">
              <div class="contentBtn my-3" v-if="actRecordType == 3" @click="changePage('/trade/spoRecord')">
                {{ $t('comm.c5') }}
              </div>

              <InvestReocrdList :type="actRecordType" @updateUserBalance="getData" />
            </div>

          </div>

        </div>
      </ClientOnly>
    </div>

    <Tabbar />
  </section>
</template>





<style lang="less" scoped>
.hasNormalBg {
  min-height: 100%;
}

@media (max-width: 380px) {
  .balanceNameEl {
    max-width: 80px;
  }

  .absBox {
    width: calc(100% - 130px);
    right: 0;
    font-size: 10px;
  }
}

@media (min-width: 380px) {
  .balanceNameEl {
    max-width: 160px;
  }

  .absBox {
    width: calc(100% - 140px);
    right: 0;
  }
}

.recordBoxEl {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  border-radius: 10px;

  .recordTypeBoxEl {
    background: var(--mainColor);
    height: 44px;
    line-height: 44px;
    border-radius: 10px 10px 0 0;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--mainColor);

    >div {
      position: relative;
      z-index: 1;
      cursor: pointer;
      color: #fff;
      transition: color 0.3s;

      &.actRecordEl {
        color: var(--mainColor);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          background: #fff;
          z-index: -1;
          transform: skewX(-20deg);
        }
      }

      &:first-child.actRecordEl::before {
        left: -20px;
        right: -15px;
        border-radius: 10px 0 0 0;
      }

      &:last-child.actRecordEl::before {
        left: -15px;
        right: -20px;
        border-radius: 0 10px 0 0;
      }

      &:not(:first-child):not(:last-child).actRecordEl::before {
        left: -15px;
        right: -15px;
        background: #FFF;
      }
    }
  }
}

.totalAmount {
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--mainColor);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.investBannerEl {
  position: relative;
  // height: 200px;
  width: 100%;

  .whiteBgEl {
    width: 60%;
    height: 100%;
    position: absolute;
    background: linear-gradient(#fff, #95BAEF, );
    border-radius: 20px;
    z-index: 10;
  }

  // .yellowBgEl {
  //   z-index: 9;
  //   width: 60%;
  //   right: 0;
  //   height: 95%;
  //   bottom: 0;
  //   position: absolute;
  //   background: linear-gradient(#F8D52C, rgba(0, 0, 0, 0), );
  //   border-radius: 20px;
  // }

  // background: url('~/assets/images/img/invest_box.png') no-repeat;
  //   background-size: 100%;
  //   height: 150px;
  //   background-position: top center;
}
</style>
