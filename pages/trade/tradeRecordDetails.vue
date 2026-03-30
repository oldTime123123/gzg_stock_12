<script setup lang="ts">
import { getRecordDetails } from "~/api/trade";

const pub = usePublicStore();
const route = useRoute();
const curId = route.query.id;
const orderInfo = ref({
  product: {
    id: "-",
  },
  expected_profit_rate: 0,
  expected_profit:0,
});

const getData = () => {
  getRecordDetails({
    id: curId,
  }).then((res) => {
    orderInfo.value = res;
  });
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div>
    <second-page-nav-bar :title="$t('trade.t129')"></second-page-nav-bar>

    <div class="borderTB py-3 px-3">
      <div class="flex  justify-between  items-baseline ">
        <div class="text-2xl font-bold mainTextColor truncate  flex-1">
          {{ orderInfo.product?.pro_name }}
        </div>
        <div class="bg-[#FFDA1C] py-0.5 px-3 rounded-full ml-2 text-xs text-center">
          {{ orderInfo.buy_type > 1 ? $t('trade.t130') : $t('trade.t131') }}
        </div>
      </div>
      <div class="flex  justify-between  items-start mt-1 ">
        <div class="py-0.5 mt-1 rounded-full text-xl">
          {{ orderInfo.product?.pro_code }}
        </div>
        <div class="text-right">
          <div>
            {{ $t('trade.t125') }}:
            <span :class="getNumberClass(true, orderInfo.profit_type)">
              {{ getNumberType(true, orderInfo.profit_type) +
              orderInfo.expected_profit
              }}</span>
          </div>

          <div>
            {{ $t('trade.t132') }}:
            <span :class="getNumberClass(true, orderInfo.profit_type)">{{
              getNumberType(true, orderInfo.profit_type) +
              orderInfo.expected_profit_rate
              }}%</span>
          </div>
        </div>
      </div>


    </div>
    <div class="bg-gray-100 h-[20px]"></div>
    <div class="px-3 mt-3">
      <div class="text-lg font-bold">{{ $t('trade.t133') }}</div>
      <div class="mt-3">
        <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t134') }}</div>
          <div>
            {{ orderInfo.number }}
          </div>
        </div>
        <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t135') }}</div>
          <div>
            {{ orderInfo.money }}
          </div>
        </div>

        <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t136') }}</div>
          <div>
            {{ orderInfo.close_status > 1 ? $t('trade.t137') : $t('trade.t138') }}
          </div>
        </div>
        <!-- <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t139') }}</div>
          <div>X{{ orderInfo.lever }} </div>
        </div>
        <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t141') }}</div>
          <div>
            {{ orderInfo.profit }}
          </div>
        </div> -->
        <div class="flex mb-1 items-center justify-between">
          <div class="text-[#404040] text-sm">{{ $t('trade.t142') }}</div>
          <div>
            {{ orderInfo.create_time }}
          </div>
        </div>
        <div class="flex mb-1 items-center justify-between" v-if="orderInfo.fee>0">
          <div class="text-[#404040] text-sm">{{ $t('x.a10') }}</div>
          <div>
            {{ orderInfo.fee }}
          </div>
        </div>
        <div class="flex mb-1 items-center justify-between"  v-if="orderInfo.close_fee>0">
          <div class="text-[#404040] text-sm">{{ $t('x.a11') }}</div>
          <div>
            {{ orderInfo.close_fee }}
          </div>
        </div>
        <div v-if="orderInfo.close_price > 0">
          <div class="flex mb-1 items-center justify-between">
            <div class="text-[#404040] text-sm">{{ $t('trade.t143') }}</div>
            <div>
              {{ orderInfo.close_price }}
            </div>
          </div>
          <div class="flex mb-1 items-center justify-between">
            <div class="text-[#404040] text-sm">{{ $t('trade.t144') }}</div>
            <div>
              {{ orderInfo.close_time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.borderTB {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
</style>
