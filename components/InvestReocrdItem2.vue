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
        <div class="flex items-center justify-between bg-[#2D57FF] px-3 py-2 rounde pb-2">
            <div class="flex flex-col">
                <span class="colorfff font-bold truncate text-sm">{{ data.product.pro_name }}</span>
                <div class="flex">
                    <div
                        class="mt-1 text-center px-2 h-[20px] leading-[20px] bg-[#FFDA1C] rounded-4xl color000 text-xs">
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

        <div class="grid mt-3 px-3 grid-cols-2 gap-4 text-sm text-center">
            <div class="py-2 rounded-md bg-[#E5F0FE]">
                <div class="color000">{{ $t('comm.c24') }}</div>
                <div class=" font-bold mt-1" :class="getNumberClass(true, data.profit_type)">
                    {{ getNumberType(true, data.profit_type) }}{{ UseExchangeNumber(data.expected_profit)   }}
                </div>
            </div>
            <div class="py-2 rounded-md  bg-[#E5F0FE]">
                <div class="color000">{{ $t('comm.c25') }}</div>
                <div class=" font-bold mt-1" :class="getNumberClass(true, data.profit_type)">
                    {{ getNumberType(true, data.profit_type) }}{{ data.expected_profit_rate  }}%
                </div>
            </div>
        </div>

        <div class="mt-3 px-3 pb-3 text-sm color000 space-y-2">
            <div class="flex justify-between items-center mb-2">
                <div>{{ $t('comm.c26') }}</div>
                <div>{{ UseExchangeNumber(data.price)  }}</div>
            </div>
            <div class="flex justify-between items-center">
                <div>{{ $t('comm.c30') }}</div>
                <div>{{ data.number }}</div>
            </div>
            <div class="flex justify-between items-center">
                <div>{{ $t('comm.c31') }}</div>
                <div>{{ UseExchangeNumber(data.price * data.number)   }}</div>
            </div>
            <div class="flex  justify-center items-center mainTextColor" v-if="!data.showMore"
                @click="data.showMore = true">
                {{ $t('comm.c29') }}
                <Icon name="solar:alt-arrow-down-bold" size="24" />
            </div>
            <div class="space-y-2" v-else>


                <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c32') }}</div>
                    <div>{{ data.deal_time }}</div>
                </div>
                <!-- <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c33') }}</div>
                    <div>{{ data.fee }}</div>
                </div> -->
                <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c34') }}</div>
                    <div>{{ UseExchangeNumber(data.close_money)  }}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c35') }}</div>
                    <div>{{ data.close_number  }}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div>{{ $t('comm.c36') }}</div>
                    <div>{{ data.close_time }}</div>
                </div>

            </div>
            <div div class="contentBtn mt-2" @click="goDetails">
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
</style>
