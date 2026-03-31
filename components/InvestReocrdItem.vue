<script setup lang="ts">
import { defineProps } from "vue";

import upIcon from "~/assets/images/icon/upIcon.png";
import downIcon from "~/assets/images/icon/downIcon.png";
import { subCloseStockHandle } from "~/api/trade";
import { showToast } from "vant";
import { getNumberClass, getNumberType, UseExchangeNumber } from "../utils";
const { t } = useI18n()
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

</script>

<template>
  <div class="mb-3 overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white shadow-[0_12px_28px_rgba(2,26,123,0.10)]">
    <div class="flex min-w-0 items-start justify-between gap-3 bg-[linear-gradient(135deg,#2D57FF_0%,#244ee6_100%)] px-4 py-3">
      <div class="min-w-0 flex-1">
        <span class="colorfff block break-words text-[0.9375rem] font-semibold leading-[1.35] tracking-[-0.01em]">{{ data.product.pro_name }}</span>
        <div class="flex">
          <div class="mt-2 h-5 max-w-full truncate rounded-full bg-[#FFDA1C] px-2 text-center text-[0.75rem] font-medium leading-5 tracking-[0.04em] color000">
            {{ data.product.pro_code }}
          </div>
        </div>
      </div>
      <div class="ml-1 w-[126px] min-w-[126px] rounded-xl px-3 py-2 text-[0.875rem] max-[430px]:w-[118px] max-[430px]:min-w-[118px]" :class="getBlockBgClass(true, data.product.is_rise)">
        <div class="flex items-baseline justify-between">
          <div class="min-w-0 text-[1rem] font-bold tracking-[-0.02em] tabular-nums color000">
            {{ UseExchangeNumber(data.product.price) }}
          </div>
          <img :src="data.product?.is_rise > 1 ? upIcon : downIcon" class="w-3 h-3 ml-1 shrink-0" />

        </div>
        <div class="mt-1 flex items-baseline justify-end gap-1 whitespace-nowrap text-[0.75rem] font-semibold leading-[1.2] tabular-nums">
          <div class="min-w-0 whitespace-nowrap">
            {{
            getNumberType(true, data.product?.is_rise)
            +
            UseExchangeNumber(data.product?.rise)
            }}
          </div>
          <div class="min-w-0 whitespace-nowrap">
            ({{
            getNumberType(true, data.product?.is_rise) +
            data.product?.rise_rate
            }}%)
          </div>
        </div>
      </div>
    </div>
    <div class="grid gap-3 px-4 py-4 text-[0.9375rem] color000">
      <div class="grid gap-2 rounded-xl bg-[#f7f9ff] px-4 py-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c41')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ UseExchangeNumber(data.price)  }}</div>
        </div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c42')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums" :class="getNumberClass(true, data.order_analysis?.is_rise)">
            {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise  }}
          </div>
        </div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c43')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums" :class="getNumberClass(true, data.order_analysis?.is_rise)">
            {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise_rate + '%' }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center text-[0.875rem] font-semibold tracking-[-0.01em] text-[var(--mainColor)]" v-if="!data.showMore" @click="data.showMore = true">
        {{$t('comm.c44')}}
        <Icon name="solar:alt-arrow-down-bold" size="24" />
      </div>
      <div class="grid gap-3" v-else>
        <div class="grid gap-3 rounded-xl border border-[rgba(45,87,255,0.10)] px-4 py-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c45')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ data.number }}</div>
        </div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c46')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ UseExchangeNumber(data.price * data.number)  }}</div>
        </div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c47')}}</div>
          <div class="min-w-0 text-right font-semibold">{{ data.deal_time }}</div>
        </div>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c49')}}</div>
          <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ UseExchangeNumber(data.product?.price * data.number)  }}</div>
        </div>
        </div>
        <div class="flex items-center justify-center text-[0.875rem] font-semibold tracking-[-0.01em] text-[var(--mainColor)]" @click="data.showMore = false">
          {{$t('comm.c44Close')}}
          <Icon name="solar:alt-arrow-up-bold" size="24" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 pt-1">
        <div class="borderContentBtn mt-0" @click="goDetails">{{$t('comm.c50')}}</div>
        <div class="contentBtn mt-0" @click="closePosition">{{$t('comm.c51')}}</div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="flex justify-center items-center h-full">
        <div class="w-[min(350px,calc(100vw-24px))] rounded-2xl bg-white p-4">
          <div class="borderB pb-1 text-center text-[1rem] font-bold tracking-[-0.01em] text-gray-700">
            {{$t('comm.c51')}}
          </div>
          <div class="mt-3 borderB pb-1">
            <div class="flex min-w-0 items-center gap-2">
              <span class="min-w-0 flex-1 break-words text-[0.9375rem] font-semibold tracking-[-0.01em]">{{ data.product.pro_name }}</span>
              <div class="ml-2 h-5 max-w-full truncate rounded-full bg-[#FFDA1C] px-2 text-[0.75rem] font-medium leading-5 tracking-[0.04em] color000">
                {{ data.product.pro_code }}
              </div>
            </div>
            <div class="mt-3 grid gap-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c53')}}</div>
              <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">
                {{ UseExchangeNumber(data.price)  }}
              </div>
            </div>
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c54')}}</div>
              <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">
                {{ UseExchangeNumber(data.product?.price)  }}
              </div>
            </div>
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{ $t('record.a2') }}</div>
              <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ data.number }}</div>
            </div>
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{$t('comm.c55')}}</div>
              <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums" :class="getNumberClass(true,data.profit_type)">
                {{ getNumberType(true, data.profit_type) +  UseExchangeNumber(data.expected_profit)  }}
              </div>
            </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
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
