<script setup lang="ts">
import { defineProps } from 'vue';

import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';

const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data;

</script>

<template>
    <div class="mb-3 overflow-hidden rounded-2xl border border-[rgba(45,87,255,0.08)] bg-white color-[#404040] shadow-[0_12px_28px_rgba(2,26,123,0.10)]">
        <div class="flex min-w-0 items-start justify-between gap-3 bg-[linear-gradient(135deg,#2D57FF_0%,#244ee6_100%)] px-4 py-3">
            <div class="min-w-0 flex-1">
                <span class="block break-words text-[0.9375rem] font-semibold leading-[1.35] tracking-[-0.01em] colorfff">{{ data.product.pro_name }}</span>
                <div class="flex">
                    <div
                        class="mt-2 h-5 max-w-full truncate rounded-full bg-[#FFDA1C] px-2 text-center text-[0.75rem] font-medium leading-5 tracking-[0.04em] color000">
                        {{ data.product.pro_code }}
                    </div>
                </div>
            </div>
            <div class="ml-1 w-[126px] min-w-[126px] rounded-xl px-3 py-2 text-[0.875rem] max-[430px]:w-[118px] max-[430px]:min-w-[118px] "
                :class="getBlockBgClass(true, data.product.is_rise)">
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
                <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{ $t('comm.c61') }}</div>
                <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ data.number }}</div>
            </div>
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{ $t('comm.c62') }}</div>
                <div class="min-w-0 text-right font-semibold tracking-[-0.01em] tabular-nums">{{ UseExchangeNumber(data.limit_price * data.number)   }}</div>
            </div>
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">{{ $t('comm.c64') }}</div>
                <div class="min-w-0 text-right font-semibold">{{ data.create_time }}</div>
            </div>
            </div>

            <div class="rounded-xl bg-[#f7f9ff] px-4 py-2 text-[0.8125rem] font-medium tracking-[0.01em] text-[#6c7690]">
                {{ $t('comm.c63') }}: <span class="font-semibold tracking-[-0.01em] tabular-nums text-[#243253]">{{ data.fee }}</span>
            </div>
        </div>

    </div>
</template>
