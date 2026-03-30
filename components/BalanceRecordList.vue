<script setup lang="ts">
import { getUserBalanceRecord } from '~/api/home/home';

const params = reactive({
    page: 1,
    limit: 10,
});

const items = ref(new Array())
const error = ref(false);
const loading = ref(false);
const finished = ref(false);

const fetchItemsList = () => {
    loading.value = true;
    finished.value = true;
    getUserBalanceRecord(params.page++, params.limit, 1).then((res: any) => {
        items.value = items.value.concat(res.data);
        const bool = params.page > res.last_page;
        nextTick(() => {
            finished.value = bool;
        });
    }).catch(() => {
        error.value = true;
    }).finally(() => {
        loading.value = false;
    })
}
</script>

<template>
    <div v-if="finished && items.length == 0">
        <div class="nullData mt-10"></div>
        <div class="text-lg mt-2 color text-blue-300 text-center">
            {{$t('comm.c4')}}
        </div>
    </div>
    <div v-else class="px-3 mt-4">
        <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
            <div class="bg-[#ECF4FE] mb-3 px-3 py-2 rounded-sm" v-for="(item, index) in items" :key="index">
                <div class=" rounded-xl space-y-1">
                    <div class="flex justify-between items-center color000 font-bold text-sm">
                        <!-- <div v-if="item.change_type == 1">{{$t('comm.c2')}}</div>
                        <div v-else>{{$t('comm.c3')}}</div> -->
                        <div class="">{{ item.change_reason }}</div>
                        <div class="text-xs">
                            {{ item.createTime }}
                        </div>
                    </div>
                    <div class="flex justify-between items-center  text-xs text-[#454545]">
                        <!-- <div class="">{{ item.change_reason }}</div> -->
                        
                        <div>
                            <span v-if="item.info_type==1">{{$t('comm.c98')}}{{ item.info.pro_code }},{{$t('comm.c99')}}{{ item.info.pro_name }}</span>
                        </div>
                        <div v-if="item.change_type == 1" class="colorUp">+{{ UseExchangeNumber(item.amount) }}</div>
                        <div v-else class="colorDown">-{{ UseExchangeNumber(item.amount) }}</div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>