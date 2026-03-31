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
    <div class="cardHeader bg-[#2D57FF] px-3 py-2 rounde pb-2">
      <div class="titleBlock flex flex-col">
        <span class="titleText colorfff font-bold text-sm">{{ data.product.pro_name }}</span>
        <div class="flex">
          <div class="codeBadge mt-1 text-center px-2 h-[20px] leading-[20px] bg-[#FFDA1C] rounded-4xl color000 text-xs">
            {{ data.product.pro_code }}
          </div>
        </div>
      </div>
      <div class="pricePanel text-sm rounded-sm px-2 py-1 ml-1" :class="getBlockBgClass(true, data.product.is_rise)">
        <div class="priceRow flex items-baseline justify-between">
          <div class="priceValue text-sm color000 font-bold">
            {{ UseExchangeNumber(data.product.price) }}
          </div>
          <img :src="data.product?.is_rise > 1 ? upIcon : downIcon" class="w-3 h-3 ml-1 shrink-0" />

        </div>
        <div class="priceMeta flex items-baseline text-[11px]">
          <div class="priceMetaValue">
            {{
            getNumberType(true, data.product?.is_rise)
            +
            UseExchangeNumber(data.product?.rise)
            }}
          </div>
          <div class="priceMetaValue ml-1">
            ({{
            getNumberType(true, data.product?.is_rise) +
            data.product?.rise_rate
            }}%)
          </div>
        </div>

      </div>
    </div>
    <div class="px-3 py-2 space-y-2 text-sm color000">
      <div class="detailRow">
        <div class="rowLabel">{{$t('comm.c41')}}</div>
        <div class="rowValue">{{ UseExchangeNumber(data.price)  }}</div>
      </div>
      <div class="detailRow mb-2">
        <div class="rowLabel">{{$t('comm.c42')}}</div>
        <div class="rowValue" :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise  }}
        </div>
      </div>
      <div class="detailRow mb-2">
        <div class="rowLabel">{{$t('comm.c43')}}</div>
        <div class="rowValue" :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise_rate + '%' }}
        </div>
      </div>

      <div class="toggleMoreBtn" v-if="!data.showMore" @click="data.showMore = true">
        {{$t('comm.c44')}}
        <Icon name="solar:alt-arrow-down-bold" size="24" />
      </div>
      <div class="space-y-3" v-else>
        <div class="detailRow">
          <div class="rowLabel">{{$t('comm.c45')}}</div>
          <div class="rowValue">{{ data.number }}</div>
        </div>
        <div class="detailRow">
          <div class="rowLabel">{{$t('comm.c46')}}</div>
          <div class="rowValue">{{ UseExchangeNumber(data.price * data.number)  }}</div>
        </div>
        <div class="detailRow">
          <div class="rowLabel">{{$t('comm.c47')}}</div>
          <div class="rowValue">{{ data.deal_time }}</div>
        </div>
        <!-- <div class="flex justify-between items-center">
          <div>{{$t('comm.c48')}}</div>
          <div>{{ data.fee }}</div>
        </div> -->

        <div class="detailRow">
          <div class="rowLabel">{{$t('comm.c49')}}</div>
          <div class="rowValue">{{ UseExchangeNumber(data.product?.price * data.number)  }}</div>
        </div>
        <div class="toggleMoreBtn toggleMoreBtn--collapse" @click="data.showMore = false">
          {{$t('comm.c44Close')}}
          <Icon name="solar:alt-arrow-up-bold" size="24" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="mt-3 contentBtn" @click="goDetails">{{$t('comm.c50')}}</div>
        <div class="mt-3 contentBtn" @click="closePosition">{{$t('comm.c51')}}</div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="flex justify-center items-center h-full">
        <div class="dialogPanel bg-white p-3 rounded-2xl">
          <div class="text-center font-bold borderB pb-1 text-gray-700">
            {{$t('comm.c51')}}
          </div>
          <div class="mt-3 borderB pb-1">
            <div class="dialogHeader flex items-center">
              <span class="dialogTitle font-bold">{{ data.product.pro_name }}</span>
              <div class="codeBadge px-2 h-[20px] leading-[20px] ml-2 bg-[#FFDA1C] rounded-4xl color000 text-xs">
                {{ data.product.pro_code }}
              </div>
            </div>
            <div class="detailRow mt-1">
              <div class="rowLabel text-sm">{{$t('comm.c53')}}</div>
              <div class="rowValue">
                {{ UseExchangeNumber(data.price)  }}
              </div>
            </div>
            <div class="detailRow mt-1">
              <div class="rowLabel text-sm">{{$t('comm.c54')}}</div>
              <div class="rowValue">
                {{ UseExchangeNumber(data.product?.price)  }}
              </div>
            </div>
            <div class="detailRow mt-1">
              <div class="rowLabel text-sm">{{ $t('record.a2') }}</div>
              <div class="rowValue">{{ data.number }}</div>
            </div>
            <div class="detailRow mt-1">
              <div class="rowLabel text-sm">{{$t('comm.c55')}}</div>
              <div class="rowValue" :class="getNumberClass(true,data.profit_type)">
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

.cardHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.titleBlock {
  flex: 1;
  min-width: 0;
}

.titleText {
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.codeBadge {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pricePanel {
  flex-shrink: 0;
  width: 126px;
  min-width: 126px;
}

.priceRow,
.priceMeta,
.detailRow,
.dialogHeader {
  min-width: 0;
}

.priceValue,
.priceMetaValue,
.dialogTitle {
  min-width: 0;
}

.priceMeta {
  flex-wrap: nowrap;
  justify-content: flex-end;
  gap: 4px;
  line-height: 1.2;
  white-space: nowrap;
}

.priceMetaValue {
  white-space: nowrap;
}

.detailRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.rowLabel {
  flex: 0 1 42%;
  min-width: 0;
}

.rowValue {
  flex: 0 1 58%;
  min-width: 0;
  text-align: right;
  line-height: 1.45;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.dialogPanel {
  width: min(350px, calc(100vw - 24px));
}

.dialogHeader {
  gap: 8px;
}

.dialogTitle {
  flex: 1;
  overflow-wrap: anywhere;
}

.toggleMoreBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--mainColor);
  cursor: pointer;
  font-weight: 600;
}

.toggleMoreBtn--collapse {
  padding-top: 4px;
}

.borderB {
  border-bottom: 1px solid #ccc;
}

@media (max-width: 430px) {
  .pricePanel {
    width: 118px;
    min-width: 118px;
  }

  .rowLabel {
    flex-basis: 40%;
  }

  .rowValue {
    flex-basis: 60%;
    font-size: 13px;
  }
}
</style>
