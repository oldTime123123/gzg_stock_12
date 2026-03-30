<script setup lang="ts">
import { defineProps } from "vue";

import upIcon from "~/assets/images/icon/upIcon.png";
import downIcon from "~/assets/images/icon/downIcon.png";
import { subCloseStockHandle } from "~/api/trade";
import { showToast } from "vant";
import { getNumberClass, getNumberType, UseExchangeNumber } from "../utils";
const { t, locale } = useI18n()
const props = defineProps<{
  data: Record<string, any>;
}>();
const data: any = props.data;

const showPop = ref(false);
const closePosition = () => {
  showPop.value = true;
};

const router = useRouter();
const goDetails = () => {
  router.push("/trade/tradeRecordDetails?id=" + data.id);
};
const emits = defineEmits();
const pub = usePublicStore();
const confirmClosePositionHandle = () => {
  showPop.value = false;
  pub.showLoading = true;
  subCloseStockHandle({
    order_id: data.id,
  }).then((res) => {
    showToast(t('comm.c6'));
    emits("updateRecordHandle");

  });
};

const isRiseClass: any = {
  1: "colorDown",
  2: "colorUp",
};
</script>

<template>
  <!--  -->
  <div class="recordItemEl mb-3 overflow-hidden rounded-xl">
    <div class="flex items-center justify-between bg-[#2D57FF] px-3 py-2 rounde pb-2">
      <div class="flex flex-col">
        <span class="colorfff font-bold truncate text-sm">{{ data.product.pro_name }}</span>
        <div class="flex">
          <div class="mt-1 text-center px-2 h-[20px] leading-[20px] bg-[#FFDA1C] rounded-4xl color000 text-xs">
            {{ data.product.pro_code }}
          </div>
        </div>
      </div>
      <div class="  text-sm rounded-sm px-2 py-1 ml-1 " :class="getBlockBgClass(true, data.product.is_rise)">
        <div class="flex items-baseline justify-between">
          <div class="text-sm color000 font-bold">
            {{ UseExchangeNumber(data.product.price) }}
          </div>
          <img :src="data.product?.is_rise > 1 ? upIcon : downIcon" class="w-3 h-3 ml-1" />

        </div>
        <div class="flex items-baseline text-[11px]">
          <div class=" ">
            {{
            getNumberType(true, data.product?.is_rise)
            +
            UseExchangeNumber(data.product?.rise)
            }}
          </div>
          <div class="ml-1 ">
            ({{
            getNumberType(true, data.product?.is_rise) +
            data.product?.rise_rate
            }}%)
          </div>
        </div>

      </div>
    </div>
    <div class="px-3 py-2 space-y-2 text-sm color000">
      <div class="flex justify-between items-center">
        <div>{{$t('comm.c41')}}</div>
        <div>{{ UseExchangeNumber(data.price)  }}</div>
      </div>
      <div class="flex items-center justify-between mb-2">
        <div>{{$t('comm.c42')}}</div>
        <div :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise  }}
        </div>
      </div>
      <div class="flex items-center justify-between mb-2">
        <div>{{$t('comm.c43')}}</div>
        <div :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise_rate + '%' }}
        </div>
      </div>

      <div class="flex justify-center items-center mainTextColor" v-if="!data.showMore" @click="data.showMore = true">
        {{$t('comm.c44')}}
        <Icon name="solar:alt-arrow-down-bold" size="24" />
      </div>
      <div class="space-y-3" v-else>
        <div class="flex justify-between items-center">
          <div>{{$t('comm.c45')}}</div>
          <div>{{ data.number }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>{{$t('comm.c46')}}</div>
          <div>{{ UseExchangeNumber(data.price * data.number)  }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>{{$t('comm.c47')}}</div>
          <div>{{ data.deal_time }}</div>
        </div>
        <!-- <div class="flex justify-between items-center">
          <div>{{$t('comm.c48')}}</div>
          <div>{{ data.fee }}</div>
        </div> -->

        <div class="flex justify-between items-center">
          <div>{{$t('comm.c49')}}</div>
          <div>{{ UseExchangeNumber(data.product?.price * data.number)  }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="mt-3 contentBtn" @click="goDetails">{{$t('comm.c50')}}</div>
        <div class="mt-3 contentBtn" @click="closePosition">{{$t('comm.c51')}}</div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="flex justify-center items-center h-full">
        <div class="bg-white p-3 w-[350px] rounded-2xl">
          <div class="text-center font-bold borderB pb-1 text-gray-700">
            {{$t('comm.c51')}}
          </div>
          <div class="mt-3 borderB pb-1">
            <div class="flex items-center">
              <span class="font-bold">{{ data.product.pro_name }}</span>
              <div class="px-2 h-[20px] leading-[20px] ml-2 bg-[#FFDA1C] rounded-4xl color000 text-xs">
                {{ data.product.pro_code }}
              </div>
            </div>
            <div class="mt-1 flex items-center justify-between">
              <div class="text-sm">{{$t('comm.c53')}}</div>
              <div>
                {{ UseExchangeNumber(data.price)  }}
              </div>
            </div>
            <div class="mt-1 flex items-center justify-between">
              <div class="text-sm">{{$t('comm.c54')}}</div>
              <div>
                {{ UseExchangeNumber(data.product?.price)  }}
              </div>
            </div>
            <div class="mt-1 flex items-center justify-between">
              <div class="text-sm">{{ $t('record.a2') }}</div>
              <div>{{ data.number }}</div>
            </div>
            <div class="mt-1 flex items-center justify-between">
              <div class="text-sm">{{$t('comm.c55')}}</div>
              <div :class="getNumberClass(true,data.profit_type)">
                {{ getNumberType(true, data.profit_type) +  UseExchangeNumber(data.expected_profit)  }}
              </div>
            </div>

          </div>

          <div class="mt-3 grid grid-cols-2 gap-2">
            <div class="borderContentBtn" @click="showPop = false">{{$t('comm.c56')}}</div>
            <div class="contentBtn" @click="confirmClosePositionHandle">
              {{$t('comm.c57')}}
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
.recordItemEl {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 11%);
  box-shadow: 0px 0px 6px 0px rgba(2, 26, 123, 0.14);
}

.borderB {
  border-bottom: 1px solid #ccc;
}
</style>
