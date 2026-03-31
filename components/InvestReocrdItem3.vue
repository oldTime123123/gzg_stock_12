<script setup lang="ts">
import { defineProps } from 'vue';

import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';

const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data;

const isRiseText: any = {
    1: '-',
    2: '+',
}
const isRiseClass: any = {
    1: 'colorDown',
    2: 'colorUp',
}


</script>

<template>
    <!-- Type 1 -->
    <div class="recordItemEl mb-3 rounded-md overflow-hidden color-[#404040]">
        <div class="cardHeader bg-[#2D57FF] px-3 py-2 rounde pb-2">
            <div class="titleBlock flex flex-col">
                <span class="titleText colorfff font-bold text-sm">{{ data.product.pro_name }}</span>
                <div class="flex">
                    <div
                        class="codeBadge mt-1 text-center px-2 h-[20px] leading-[20px] bg-[#FFDA1C] rounded-4xl color000 text-xs">
                        {{ data.product.pro_code }}
                    </div>
                </div>
            </div>
            <div class="pricePanel text-sm rounded-sm px-2 py-1 ml-1 "
                :class="getBlockBgClass(true, data.product.is_rise)">
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
        <div class="mt-3 px-3 pb-3 text-sm color000">

            <!-- <div class="flex items-center justify-between mb-2">
                <div>委托方向</div>
                <div class="mainTextColor">{{ data.buy_type>1?'买跌':'买涨' }}</div>
            </div> -->

            <div class="detailRow mb-2">
                <div>{{ $t('comm.c61') }}</div>
                <div class="rowValue">{{ data.number }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c62') }}</div>
                <div class="rowValue">{{ UseExchangeNumber(data.limit_price * data.number)   }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c63') }}</div>
                <div class="rowValue">{{ data.fee }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c64') }}</div>
                <div class="rowValue">{{ data.create_time }}</div>
            </div>
        </div>

    </div>
</template>

<style lang="less" scoped>
.recordItemEl {
    background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 11%);
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

.priceMeta {
    flex-wrap: nowrap;
    justify-content: flex-end;
    gap: 4px;
    line-height: 1.2;
    white-space: nowrap;
}

.priceValue,
.priceMetaValue {
    min-width: 0;
    white-space: nowrap;
}

.detailRow {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
}

.rowValue {
    min-width: 0;
    max-width: 58%;
    text-align: right;
    line-height: 1.45;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.detailRow > :first-child {
    min-width: 0;
    overflow-wrap: anywhere;
}

@media (max-width: 430px) {
    .pricePanel {
        width: 118px;
        min-width: 118px;
    }

    .rowValue {
        max-width: 52%;
        font-size: 13px;
    }
}
</style>
