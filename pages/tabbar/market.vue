<script lang="ts" setup>
import { getStockIndexList } from "~/api/home/home";
import { LineOption } from "~/utils/indexLineStyle";

import upIcon from "~/assets/images/icon/upIcon.png";
import downIcon from "~/assets/images/icon/downIcon.png";
import { ISO_TIMESTAMP_REGEX } from "valibot";
const { t, locale } = useI18n()

const actRecordType = ref(0);
const tabs = ref([
  {
        text: t('market.m1'),
    type: 0,
  },

  {
        text: t('market.m2'),
    type: 1,
  },
]);

const lineDataList = ref([]);
const getData = () => {
  getStockIndexList().then((res: any) => {
    lineDataList.value = Array.isArray(res.index) && res.index.length > 1
      ? res.index.slice(0, 2)
      : res.index;
  });
};
const route = useRoute();
onMounted(() => {
  if (route.query.type) {
    actRecordType.value = Number(route.query.type);
  }
  getData();
});

const changeLineTypeData = (data: any) => {
  const result = Array(100)
    .fill(null)
    .map((_, i) => data[i] ?? null);
  for (let i = 1; i < 100; i++) {
    if (result[i] == null) {
      result[i] = result[i - 1];
    }
  }

  return result;
};
const pub = usePublicStore();
const changeDataType = (type: number) => {
  if (actRecordType.value == type) return;
  actRecordType.value = type;
  pub.showLoading = true;
};

</script>
<template>
  <section>
    <div class="hasNormalBg">
      <TabbarTopNavBar />

      <div class="pageContainer px-3 mt-3">
        <div class="topInfoEl px-2 pb-2">
          <div class="pt-7 pl-8 flex items-center">
            <div class="text-white text-base font-bold">{{ $t('market.m3') }}</div>
            <!-- <div class="ml-10 text-xs">
                            <div class="flex items-center justify-center colorfff titleRightBg ">
                                もっと見る
                                <UIcon name="solar:alt-arrow-right-bold"></UIcon>
                            </div>
                        </div> -->
          </div>
          <div class="mt-3 px-3">
            <div class="between proGoodsEl mb-2 p-2 bg-amber-50 rounded-sm flex items-center justify-between"
              v-for="(item, index) in lineDataList" :key="index">
              <div class="leftBoxEl text-center text-sm w-1/4">
                <div class="nameEl p-1">{{ item.exchange_name }}</div>
                <div class="p-1 font-bold">{{ item.price }}</div>
              </div>
              <div class="flex-1 mx-1 flex  justify-center">
                <ClientOnly>
                  <apexchart width="46%" height="50" type="area" :options="LineOption" :series="[
                      {
                        data: changeLineTypeData(
                          item.chart.indicators.quote[0].close
                        ),
                      },
                    ]" />
                </ClientOnly>
              </div>
              <div class="flex1 w-1/4">
                <div class="mt-1 text-sm text-right" :class="getNumberClass(true,item.is_rise)">
                  <div class="font-black flex items-center flex-row-reverse">
                    <img :src="item.is_rise == 2 ? upIcon : downIcon" class="w-3 h-3 ml-1" />
                    {{ getNumberType(true, item.is_rise) + UseExchangeNumber(item.chart?.rise) }}
                  </div>
                  <div class="bg-[#e5f0fe]  py-px px-2 mt-1 rounded-md"
                    :class="item.is_rise == 2 ? 'colorUp' : 'colorDown'">
                    {{ getNumberType(true, item.is_rise) }}
                 {{ item.rise_rate }}%
                  </div>
                </div>
              </div>
            </div>
            <div class=" mb-2 p-2 h-[80px] bg-[#dce8f9] rounded-sm "
              v-for="(item, index) in 2" v-if="lineDataList.length == 0" :key="index">
            </div>

          </div>
        </div>

        <div class="recordBoxEl mt-3 pb-2">
          <div class="grid grid-cols-2 text-center recordTypeBoxEl">
            <div v-for="(tab, index) in tabs" :class="actRecordType == tab.type ? 'actRecordEl' : ''" :key="index"
              @click="changeDataType(tab.type)">
              {{ tab.text }}
            </div>
          </div>
          <div class="mt-3 px-3">
            <MarketRecordList v-if="actRecordType < 1" />
            <CollectStockList v-else @changeDataType="changeDataType" />
          </div>
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 130px);
}

.recordBoxEl {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
  border-radius: 10px;

  .recordTypeBoxEl {
    background: var(--mainColor);
    height: 44px;
    line-height: 44px;
    border-radius: 10px 10px 0 0;
    position: relative;
    overflow: hidden;

    > div {
      position: relative;
      z-index: 1;
      cursor: pointer;
      color: #fff;
      transition: color 0.3s;

      &.actRecordEl {
        color: var(--mainColor);

        &::before {
          content: "";
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
    }
  }
}

.topInfoEl {
  // height: 229px;
  background: url("~/assets/images/img/market_info.png") no-repeat;
  background-size: 100%;
  background-position: center;
  height: 15rem;
  border-radius: 12px;

  .proGoodsEl {
    .leftBoxEl {
      background: #ffda1c;
      border-radius: 8px;

      .nameEl {
        border-radius: 8px;
        background: #2d57ff;
        color: #fff;
      }
    }
  }

  .titleRightBg {
    background: url("~/assets/images/icon/i_rightBg.png") no-repeat;
    background-size: contain;
    width: 100px;
    height: 24px;
  }


}
</style>
