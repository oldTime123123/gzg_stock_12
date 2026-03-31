<script setup lang="ts">
import { defineProps } from 'vue';

import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';
import { UseExchangeNumber } from '../utils';

const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data;

const isRiseText:any = {
    1: '-',
    2: '+',
}
const isRiseClass:any = {
    1: 'colorDown',
    2: 'colorUp',
}

const router = useRouter()
const goDetails = () => {
    router.push('/trade/tradeRecordDetails?id=' + data.id)
}

</script>

<template>
    <!-- type 3 -->
    <div class="recordItemEl overflow-hidden mb-3 rounded-md color-[#404040]">
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

        <div class="metricGrid grid mt-3 px-3 grid-cols-2 gap-4 text-sm text-center">
            <div class="metricCard py-2 rounded-md bg-[#E5F0FE]">
                <div class="color000">{{ $t('comm.c24') }}</div>
                <div class="metricValue font-bold mt-1" :class="getNumberClass(true, data.profit_type)">
                    {{ getNumberType(true, data.profit_type) }}{{ UseExchangeNumber(data.expected_profit)   }}
                </div>
            </div>
            <div class="metricCard py-2 rounded-md  bg-[#E5F0FE]">
                <div class="color000">{{ $t('comm.c25') }}</div>
                <div class="metricValue font-bold mt-1" :class="getNumberClass(true, data.profit_type)">
                    {{ getNumberType(true, data.profit_type) }}{{ data.expected_profit_rate  }}%
                </div>
            </div>
        </div>

        <div class="mt-3 px-3 pb-3 text-sm color000 space-y-2">
            <div class="detailRow mb-2">
                <div class="rowLabel">{{ $t('comm.c26') }}</div>
                <div class="rowValue">{{ UseExchangeNumber(data.price)  }}</div>
            </div>
            <div class="detailRow">
                <div class="rowLabel">{{ $t('comm.c30') }}</div>
                <div class="rowValue">{{ data.number }}</div>
            </div>
            <div class="detailRow">
                <div class="rowLabel">{{ $t('comm.c31') }}</div>
                <div class="rowValue">{{ UseExchangeNumber(data.price * data.number)   }}</div>
            </div>
            <div class="toggleMoreBtn" v-if="!data.showMore"
                @click="data.showMore = true">
                {{ $t('comm.c29') }}
                <Icon name="solar:alt-arrow-down-bold" size="24" />
            </div>
            <div class="space-y-2" v-else>


                <div class="detailRow">
                    <div class="rowLabel">{{ $t('comm.c32') }}</div>
                    <div class="rowValue">{{ data.deal_time }}</div>
                </div>
                <!-- <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c33') }}</div>
                    <div>{{ data.fee }}</div>
                </div> -->
                <div class="detailRow">
                    <div class="rowLabel">{{ $t('comm.c34') }}</div>
                    <div class="rowValue">{{ UseExchangeNumber(data.close_money)  }}</div>
                </div>
                <div class="detailRow">
                    <div class="rowLabel">{{ $t('comm.c35') }}</div>
                    <div class="rowValue">{{ data.close_number  }}</div>
                </div>
                <div class="detailRow">
                    <div class="rowLabel">{{ $t('comm.c36') }}</div>
                    <div class="rowValue">{{ data.close_time }}</div>
                </div>
                <div class="toggleMoreBtn toggleMoreBtn--collapse" @click="data.showMore = false">
                    {{ $t('comm.c29Close') }}
                    <Icon name="solar:alt-arrow-up-bold" size="24" />
                </div>

            </div>
            <div class="contentBtn mt-2" @click="goDetails">
                {{ $t('comm.c37') }}
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

.metricGrid,
.detailRow {
    min-width: 0;
}

.metricCard {
    min-width: 0;
}

.metricValue {
    overflow-wrap: anywhere;
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
    overflow-wrap: anywhere;
}

.rowValue {
    flex: 0 1 58%;
    min-width: 0;
    text-align: right;
    line-height: 1.45;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.toggleMoreBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mainColor);
    cursor: pointer;
    font-weight: 600;
}

.toggleMoreBtn--collapse {
    padding-top: 4px;
}

@media (max-width: 430px) {
    .metricGrid {
        gap: 10px;
    }

    .pricePanel {
        width: 118px;
        min-width: 118px;
    }

    .rowLabel {
        flex-basis: 40%;
    }

    .rowValue,
    .metricValue {
        font-size: 13px;
    }
}

@media (max-width: 360px) {
    .metricGrid {
        grid-template-columns: 1fr;
    }
}
</style>
