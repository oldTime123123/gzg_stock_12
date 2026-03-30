<script setup lang="ts">
import { defineProps } from 'vue';
import { stockCollect } from '~/api/home/home';

import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';
import { showToast } from 'vant';
const { t } = useI18n()

const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data
const emit = defineEmits()
const collectHandle = () => {

    data.isCollect = !data.isCollect
    stockCollect({
        pid: data.pid,
        status:2
    }).then(res => {
        showToast(t('xx.a2'))
        emit('deleteStock', data)
    })
}

const router = useRouter()
const useSocketStore = socketStore()
const goTrade = data => {
  useSocketStore.currentCoin = {
    ...data.stock,
    id: data.pid,
    pro_code:data.stock.code,
    pro_name:data.stock.name,
  }
  router.push('/trade')
}
</script>


<template>
    <div class="collectStockItemEl cursor-pointer p-2 rounded-xl bg-[#E5F0FE]" @click="goTrade(data)" >
        <div class="flex justify-between ">
            <div class="grow text-sm">
                <div class="mainTextColor h-[40px]">{{ data.stock.name }}</div>
                <div class="colorSecond">{{ data.stock.code }}</div>
            </div>
            <div>
                <Icon name="tabler:star-filled" size="20" class="text-amber-300" @click.stop="collectHandle" />
            </div>
        </div>
        <div class="mt-1 priceBox  bg-white rounded-md p-1 text-center">
            <div class="text-lg font-bold " :class="data.stock.is_rise == 2 ? 'colorUp' : 'colorDown'">
                {{ data.stock.price }}<img :src="data.stock.is_rise == 2 ? upIcon : downIcon" class="w-3 h-3 ml-1 inline-block">
            </div>
            <div v-if="data.stock.is_rise == 2" class="text-sm mt-1 rounded-md colorUp2">
                +{{ UseExchangeNumber(data.stock.rise) }}(+{{ UseExchangeNumber(data.stock.rise_rate) }}%)
            </div>
            <div v-else class="text-sm mt-1 rounded-md colorDown2">
                <span>-{{ UseExchangeNumber(data.stock.rise) }}(-{{ UseExchangeNumber(data.stock.rise_rate) }}%)</span>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
.collectStockItemEl {
    .colorUp2 {
        background: #FFF0EF;
        color: #FF0000;
    }

    .colorDown2 {
        background: #E6FEE2;
        color: #02CD8E;
    }
}
</style>
