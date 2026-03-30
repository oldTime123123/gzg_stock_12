<script setup lang="ts">
import upIcon from '~/assets/images/icon/upIcon.png';
import downIcon from '~/assets/images/icon/downIcon.png';
import { stockCollect } from '~/api/home/home';
import { showToast } from 'vant';
const { t, locale } = useI18n()
const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data

const collectHandle = () => {
    data.isCollect = !data.isCollect
    stockCollect({
        pid: data.id,
        status: "1"
    }).then(res => {
        showToast(t('comm.c67'))
    })
}

const router = useRouter()
const useSocketStore = socketStore()
const goTrade = item => {
  useSocketStore.currentCoin = item
  router.push('/trade')
}
</script>

<template>
    <div>
        <div class="mb-3 recordItemEl p-2 rounded-xl bg-[#ECF4FE] color-[#404040]" @click="goTrade(data)">
            <div class="flex items-center text-sm justify-between">
                <div class="flex items-center text-sm">
                    <div class="font-black mainTextColor">{{ data.pro_name }}</div>
                    <div class="ml-1 flex items-center" :class="data.is_rise == 2 ? 'colorUp' : 'colorDown'">
                        {{ data.pro_code }}
                        <img :src="data.is_rise == 2 ? upIcon : downIcon" class="w-3 h-3 ml-1">
                    </div>

                </div>
                <div>
                    <Icon name="tabler:star-filled" size="20"
                        :class="data.isCollect ? ' text-amber-300' : 'text-gray-300'" @click.stop="collectHandle" />

                </div>
            </div>

            <div class="mt-2">
                <div class="flex items-center justify-between my-1">
                    <span>{{$t('comm.c68')}}</span>
                    <span class="color000">{{ data.price }}</span>
                </div>
                <div class="flex items-center justify-between my-1">
                    <span>{{$t('comm.c69')}}</span>
                    <span v-if="data.is_rise == 2" class="colorUp">+{{ UseExchangeNumber(data.rise) }}</span>
                    <span v-else class="colorDown">-{{ UseExchangeNumber(data.rise) }}</span>
                </div>
                <div class="flex items-center justify-between my-1">
                    <span>{{$t('comm.c70')}}</span>
                    <span v-if="data.is_rise == 2" class="colorUp">+{{ data.rise_rate }}%</span>
                    <span v-else class="colorDown">-{{ data.rise_rate }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>
